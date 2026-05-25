// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Entry Point
// ─────────────────────────────────────────────

import { Command } from 'commander';
import { displayBanner } from './messages.js';
import { runWizard } from './wizard.js';
import { PresetManager } from './presetManager.js';

const program = new Command();

program
  .name('mechbuild')
  .description('SP//DR Build System — Mech-assembly project scaffolding CLI')
  .version('1.0.0', '-v, --version', 'Display mechbuild version');

// ── Default build command (interactive wizard)
program
  .command('build', { isDefault: true })
  .description('Launch the interactive mech-assembly build wizard')
  .option('--dry-run', 'Preview what would be generated without writing files')
  .option('--preset <name>', 'Load a saved preset configuration from ~/.mechrc')
  .option('--save-preset <name>', 'Save this build configuration as a named preset')
  .action(async (options: { dryRun?: boolean; preset?: string; savePreset?: string }) => {
    displayBanner();

    await runWizard({
      dryRun: options.dryRun ?? false,
      preset: options.preset,
      savePreset: options.savePreset,
    });
  });

// ── List presets
program
  .command('presets')
  .description('List all saved presets in ~/.mechrc')
  .action(() => {
    displayBanner();
    const pm = new PresetManager();
    pm.listPresets();
  });

// ── Delete preset
program
  .command('delete-preset <name>')
  .description('Delete a saved preset from ~/.mechrc')
  .action((name: string) => {
    const pm = new PresetManager();
    if (pm.delete(name)) {
      console.log(`\n  ✔ Preset "${name}" deleted.\n`);
    } else {
      console.error(`\n  ✖ Preset "${name}" not found.\n`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('\nFatal error:', err?.message ?? err);
  process.exit(1);
});
