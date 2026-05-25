// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Interactive Wizard
// ─────────────────────────────────────────────

import * as p from '@clack/prompts';
import chalk from 'chalk';
import {
  BuildConfig,
  WizardOptions,
  ProjectType,
  Database,
  Auth,
  Extra,
  FRAMEWORK_MAP,
  DATABASE_OPTIONS,
  AUTH_OPTIONS,
  EXTRA_OPTIONS,
} from './types.js';
import { validateProjectName, validateDirectoryFree } from './utils/validation.js';
import { displayProjectSummary } from './messages.js';
import { PresetManager } from './presetManager.js';
import { runScaffolder } from './scaffolder.js';

export async function runWizard(options: WizardOptions): Promise<void> {
  const presetManager = new PresetManager();

  // ── If listing presets, handled in index.ts before we get here
  // ── If a preset is requested, load it and skip the wizard
  if (options.preset) {
    const preset = presetManager.get(options.preset);
    if (!preset) {
      p.log.error(
        chalk.red(`Preset "${options.preset}" not found. Run --list-presets to see available presets.`)
      );
      process.exit(1);
    }

    const config: BuildConfig = { ...preset, dryRun: options.dryRun };
    p.log.success(chalk.cyan(`Loaded preset: ${options.preset}`));

    displayProjectSummary(config);
    await runScaffolder(config);
    return;
  }

  // ─────────────────────────────────────────────
  // INTRO
  // ─────────────────────────────────────────────
  p.intro(chalk.bold.cyan(' ◈ SP//DR BUILD SYSTEM  ') + chalk.dim('— mech assembly initiated'));

  // ─────────────────────────────────────────────
  // PROJECT NAME
  // ─────────────────────────────────────────────
  const projectName = await p.text({
    message: chalk.cyan('◆') + ' ' + chalk.white('Designate your mech frame') + chalk.dim(' (project name)'),
    placeholder: 'my-project',
    validate: (value) => {
      const nameError = validateProjectName(value);
      if (nameError) return nameError;
      return undefined;
    },
  });

  if (p.isCancel(projectName)) return handleCancel();

  // Check directory collision
  const dirError = await validateDirectoryFree(projectName as string);
  if (dirError) {
    p.log.error(chalk.red(dirError));
    process.exit(1);
  }

  // ─────────────────────────────────────────────
  // PROJECT TYPE
  // ─────────────────────────────────────────────
  const projectType = await p.select<{ label: string; value: ProjectType; hint: string }[], ProjectType>({
    message: chalk.cyan('◆') + ' ' + chalk.white('Select frame class') + chalk.dim(' (project type)'),
    options: [
      { label: 'Web App', value: 'web', hint: 'Frontend SPA or SSR application' },
      { label: 'API Server', value: 'api', hint: 'Backend REST / async API service' },
      { label: 'Full Stack', value: 'fullstack', hint: 'Integrated frontend + backend' },
      { label: 'CLI Tool', value: 'cli', hint: 'Command-line interface program' },
    ],
  });

  if (p.isCancel(projectType)) return handleCancel();

  // ─────────────────────────────────────────────
  // FRAMEWORK (CHASSIS)
  // ─────────────────────────────────────────────
  const frameworkOptions = FRAMEWORK_MAP[projectType as ProjectType];

  const framework = await p.select<{ label: string; value: string; hint: string }[], string>({
    message: chalk.cyan('◆') + ' ' + chalk.white('Install chassis') + chalk.dim(' (framework)'),
    options: frameworkOptions,
  });

  if (p.isCancel(framework)) return handleCancel();

  // ─────────────────────────────────────────────
  // DATABASE (MEMORY CORE)
  // ─────────────────────────────────────────────
  const database = await p.select<{ label: string; value: Database; hint: string }[], Database>({
    message: chalk.cyan('◆') + ' ' + chalk.white('Bind memory core') + chalk.dim(' (database)'),
    options: DATABASE_OPTIONS,
  });

  if (p.isCancel(database)) return handleCancel();

  // ─────────────────────────────────────────────
  // AUTH (SECURITY MODULE)
  // ─────────────────────────────────────────────
  const auth = await p.select<{ label: string; value: Auth; hint: string }[], Auth>({
    message: chalk.cyan('◆') + ' ' + chalk.white('Arm security module') + chalk.dim(' (authentication)'),
    options: AUTH_OPTIONS,
  });

  if (p.isCancel(auth)) return handleCancel();

  // ─────────────────────────────────────────────
  // EXTRAS (SUBSYSTEMS)
  // ─────────────────────────────────────────────
  const extras = await p.multiselect<{ label: string; value: Extra; hint: string }[], Extra>({
    message: chalk.cyan('◆') + ' ' + chalk.white('Mount subsystems') + chalk.dim(' (extras — space to toggle)'),
    options: EXTRA_OPTIONS,
    required: false,
  });

  if (p.isCancel(extras)) return handleCancel();

  // ─────────────────────────────────────────────
  // BUILD CONFIG ASSEMBLY
  // ─────────────────────────────────────────────
  const config: BuildConfig = {
    projectName: projectName as string,
    projectType: projectType as ProjectType,
    framework: framework as string,
    database: database as Database,
    auth: auth as Auth,
    extras: extras as Extra[],
    dryRun: options.dryRun,
  };

  // ─────────────────────────────────────────────
  // CONFIRMATION SCREEN
  // ─────────────────────────────────────────────
  p.note(
    [
      chalk.dim('PILOT ID   ') + chalk.white.bold(config.projectName.toUpperCase()),
      chalk.dim('FRAME      ') + chalk.white(config.projectType),
      chalk.dim('CHASSIS    ') + chalk.white(config.framework),
      chalk.dim('MEMORY     ') + chalk.white(config.database),
      chalk.dim('SECURITY   ') + chalk.white(config.auth),
      chalk.dim('SUBSYSTEMS ') + chalk.white(config.extras.length > 0 ? config.extras.join(', ') : 'none'),
      '',
      config.dryRun
        ? chalk.yellow.dim('⚠  DRY RUN — no files will be written')
        : chalk.green.dim('✔  Files will be written to ./' + config.projectName),
    ].join('\n'),
    chalk.bold.cyan('◈ Build Manifest')
  );

  const confirmed = await p.confirm({
    message: chalk.bold.white('Deploy this build?'),
    initialValue: true,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.outro(chalk.yellow('Build cancelled. Standing by.'));
    return;
  }

  // ─────────────────────────────────────────────
  // OPTIONAL: SAVE PRESET
  // ─────────────────────────────────────────────
  if (options.savePreset) {
    presetManager.save(options.savePreset, config);
    p.log.success(
      chalk.green(`Preset "${options.savePreset}" saved to ~/.mechrc`)
    );
  }

  // ─────────────────────────────────────────────
  // SCAFFOLD
  // ─────────────────────────────────────────────
  await runScaffolder(config);
}

function handleCancel(): void {
  p.cancel(chalk.red('Build aborted. Mech standing down.'));
  process.exit(0);
}
