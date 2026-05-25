// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Scaffolder Engine
// ─────────────────────────────────────────────

import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { BuildConfig, GeneratedFile } from './types.js';
import { resolveTemplateFiles } from './templates.js';
import { displaySuccess, displayDryRunHeader, displayError } from './messages.js';
import { printFileTree, sleep, formatBytes } from './utils/display.js';

export async function runScaffolder(config: BuildConfig): Promise<void> {
  try {
    const files = resolveTemplateFiles(config);

    if (config.dryRun) {
      await executeDryRun(config, files);
    } else {
      await executeGeneration(config, files);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    displayError(`Scaffolding failed: ${message}`);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// DRY RUN — preview only
// ─────────────────────────────────────────────

async function executeDryRun(config: BuildConfig, files: GeneratedFile[]): Promise<void> {
  displayDryRunHeader(config);

  console.log(chalk.bold.cyan('  ◈ Files that would be generated:\n'));
  printFileTree(files, config.projectName);

  const totalBytes = files.reduce((acc, f) => acc + Buffer.byteLength(f.content, 'utf-8'), 0);

  console.log(
    chalk.dim('  Total: ') +
      chalk.white(`${files.length} files`) +
      chalk.dim(' · ') +
      chalk.white(formatBytes(totalBytes))
  );
  console.log();

  console.log(chalk.dim('  To generate for real, run without --dry-run.'));
  console.log();
}

// ─────────────────────────────────────────────
// FULL GENERATION — write files to disk
// ─────────────────────────────────────────────

async function executeGeneration(config: BuildConfig, files: GeneratedFile[]): Promise<void> {
  const targetDir = path.resolve(process.cwd(), config.projectName);

  // Pre-flight check
  if (await fs.pathExists(targetDir)) {
    displayError(
      `Directory "${config.projectName}" already exists. Remove it or choose a different project name.`
    );
    process.exit(1);
  }

  console.log();

  const steps: Array<{
    label: string;
    action: () => Promise<void>;
  }> = [
    {
      label: 'Initializing frame structure',
      action: async () => {
        await fs.ensureDir(targetDir);
        await sleep(200);
      },
    },
    {
      label: `Writing ${files.length} components`,
      action: async () => {
        for (const file of files) {
          const filePath = path.join(targetDir, file.path);
          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, file.content, 'utf-8');
        }
        await sleep(100);
      },
    },
    {
      label: 'Calibrating configuration',
      action: async () => {
        await sleep(300);
      },
    },
    {
      label: 'Sealing chassis',
      action: async () => {
        await sleep(200);
      },
    },
  ];

  for (const step of steps) {
    const spinner = ora({
      text: chalk.cyan(step.label) + chalk.dim('...'),
      color: 'cyan',
      spinner: 'dots',
    }).start();

    try {
      await step.action();
      spinner.succeed(chalk.green('✔ ') + chalk.white(step.label));
    } catch (err) {
      spinner.fail(chalk.red('✖ ') + chalk.white(step.label));
      throw err;
    }
  }

  displaySuccess(config);
}
