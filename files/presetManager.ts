// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Preset Manager
// ─────────────────────────────────────────────

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { BuildConfig, PresetStore } from './types.js';

const MECHRC_PATH = path.join(os.homedir(), '.mechrc');

export class PresetManager {
  private store: PresetStore;

  constructor() {
    this.store = this.load();
  }

  /** Load presets from ~/.mechrc, returning empty store on missing/corrupt file. */
  private load(): PresetStore {
    try {
      if (fs.existsSync(MECHRC_PATH)) {
        const raw = fs.readFileSync(MECHRC_PATH, 'utf-8');
        const parsed = JSON.parse(raw) as PresetStore;
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      }
    } catch {
      // Silently ignore corrupt presets file
    }
    return {};
  }

  /** Persist the current store to ~/.mechrc. */
  private persist(): void {
    fs.writeFileSync(MECHRC_PATH, JSON.stringify(this.store, null, 2), 'utf-8');
  }

  /** Save a BuildConfig under a named preset. */
  save(name: string, config: BuildConfig): void {
    const { dryRun, ...persistable } = config;
    this.store[name] = persistable;
    this.persist();
    console.log(
      chalk.green(`\n  ✔ Preset "${name}" saved to ${MECHRC_PATH}\n`)
    );
  }

  /** Load a named preset. Returns undefined if not found. */
  get(name: string): Omit<BuildConfig, 'dryRun'> | undefined {
    return this.store[name];
  }

  /** List all saved presets to stdout. */
  listPresets(): void {
    const names = Object.keys(this.store);

    if (names.length === 0) {
      console.log(chalk.yellow('\n  No saved presets found in ~/.mechrc\n'));
      return;
    }

    console.log(chalk.bold.cyan('\n  ◈ Saved Presets\n'));

    names.forEach((name) => {
      const preset = this.store[name]!;
      console.log(
        chalk.cyan(`  ▸ ${name.padEnd(24)}`) +
          chalk.dim(
            `${preset.framework} / ${preset.database} / ${preset.auth}`
          )
      );
    });

    console.log();
    console.log(chalk.dim(`  Load with: mechbuild --preset <name>\n`));
  }

  /** Check if a preset name exists. */
  has(name: string): boolean {
    return name in this.store;
  }

  /** Delete a preset by name. */
  delete(name: string): boolean {
    if (this.has(name)) {
      delete this.store[name];
      this.persist();
      return true;
    }
    return false;
  }

  /** Return all preset names. */
  names(): string[] {
    return Object.keys(this.store);
  }
}
