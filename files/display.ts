// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Display Utilities
// ─────────────────────────────────────────────

import chalk from 'chalk';
import { GeneratedFile } from '../types.js';

/** Print a styled section header. */
export function sectionHeader(title: string): void {
  console.log();
  console.log(
    chalk.cyan('  ┌' + '─'.repeat(title.length + 4) + '┐')
  );
  console.log(chalk.cyan('  │') + chalk.bold.white('  ' + title + '  ') + chalk.cyan('│'));
  console.log(chalk.cyan('  └' + '─'.repeat(title.length + 4) + '┘'));
  console.log();
}

/** Print a styled file tree for dry-run mode. */
export function printFileTree(files: GeneratedFile[], projectName: string): void {
  console.log();
  console.log(chalk.bold.cyan(`  📁 ${projectName}/`));

  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
  const total = sorted.length;

  sorted.forEach((file, idx) => {
    const isLast = idx === total - 1;
    const segments = file.path.split('/');
    const filename = segments.pop() ?? file.path;
    const depth = segments.length;
    const indent = '  ' + '  '.repeat(depth);
    const connector = isLast ? '└─' : '├─';
    const icon = getFileIcon(filename);

    console.log(
      chalk.dim(indent + connector + ' ') +
        chalk.dim(icon + ' ') +
        chalk.white(filename)
    );
  });

  console.log();
  console.log(
    chalk.dim(`  ${total} files would be generated.`)
  );
  console.log();
}

/** Print a labeled log line in dry-run mode. */
export function dryRunLog(label: string, value: string): void {
  console.log(
    chalk.dim('  →') +
      ' ' +
      chalk.cyan(label.padEnd(24)) +
      chalk.white(value)
  );
}

/** Get an emoji icon for a filename based on extension. */
function getFileIcon(filename: string): string {
  if (filename === 'package.json') return '📦';
  if (filename === '.env.example') return '🔑';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return '🔷';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return '🟡';
  if (filename.endsWith('.py')) return '🐍';
  if (filename.endsWith('.go')) return '🐹';
  if (filename.endsWith('.md')) return '📝';
  if (filename === 'Dockerfile' || filename === 'docker-compose.yml') return '🐳';
  if (filename.endsWith('.yml') || filename.endsWith('.yaml')) return '⚙️';
  if (filename === '.gitignore') return '🚫';
  if (filename.endsWith('.json')) return '📋';
  return '📄';
}

/** Format bytes to a human-readable string. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Sleep for a given number of milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
