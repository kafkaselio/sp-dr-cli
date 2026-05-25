// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Messages & Visuals
// ─────────────────────────────────────────────

import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { BuildConfig } from './types.js';

// Mech-themed gradient palettes
const cyanPurple = gradient(['#00f5ff', '#7b2fff', '#ff00c8']);
const goldGradient = gradient(['#f7971e', '#ffd200']);
const neonGreen = gradient(['#00ff87', '#60efff']);

export const MECH_QUOTES = [
  'Neural uplink synchronized. Core temperature nominal.',
  'Chassis integrity at 100%. Weapons hot.',
  'Mech assembly protocol initiated. Stand by.',
  'All systems green. Deploy when ready, pilot.',
  'Power core engaged. Build sequence initiated.',
  'Synchronizing with orbital network...',
  'Pilot confirmed. Initiating SP//DR protocol.',
  'Frame locked. Calibration complete.',
  'System boot successful. Awaiting your command.',
  'Threat assessment complete. Building defensive grid.',
];

export const ASCII_BANNER = `
  ███████╗██████╗     ██╗   ██╗██████╗ ██████╗ 
  ██╔════╝██╔══██╗    ██║   ██║██╔══██╗██╔══██╗
  ███████╗██████╔╝    ██║   ██║██║  ██║██████╔╝
  ╚════██║██╔═══╝     ╚██╗ ██╔╝██║  ██║██╔══██╗
  ███████║██║          ╚████╔╝ ██████╔╝██║  ██║
  ╚══════╝╚═╝           ╚═══╝  ╚═════╝ ╚═╝  ╚═╝
  ██████╗ ██╗   ██╗██╗██╗     ██████╗           
  ██╔══██╗██║   ██║██║██║     ██╔══██╗          
  ██████╔╝██║   ██║██║██║     ██║  ██║          
  ██╔══██╗██║   ██║██║██║     ██║  ██║          
  ██████╔╝╚██████╔╝██║███████╗██████╔╝          
  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝           
        ██████╗ ██╗   ██╗███████╗████████╗███████╗███╗   ███╗
        ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
        ╚█████╗  ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
         ╚═══██╗  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
        ██████╔╝   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
        ╚═════╝    ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
`;

export function displayBanner(): void {
  console.clear();
  console.log(cyanPurple(ASCII_BANNER));

  const subtitle = boxen(
    chalk.dim('v1.0.0') +
      '  ' +
      chalk.cyan('◆') +
      '  ' +
      chalk.white('Mech-assembly project scaffolding') +
      '  ' +
      chalk.cyan('◆') +
      '  ' +
      chalk.dim('by SP//DR Labs'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan',
      dimBorder: true,
    }
  );

  console.log(subtitle);
  console.log();

  const quote = MECH_QUOTES[Math.floor(Math.random() * MECH_QUOTES.length)];
  console.log('  ' + chalk.dim.italic(`[ ${quote} ]`));
  console.log();
}

export function displayProjectSummary(config: BuildConfig): void {
  const rows = [
    ['CHASSIS', config.framework],
    ['MEMORY CORE', config.database === 'none' ? 'offline' : config.database],
    ['SECURITY MODULE', config.auth === 'none' ? 'offline' : config.auth],
    [
      'SUBSYSTEMS',
      config.extras.length > 0 ? config.extras.join(', ') : 'none',
    ],
    ['DRY RUN', config.dryRun ? 'enabled' : 'disabled'],
  ];

  const maxLabelLen = Math.max(...rows.map(([l]) => l.length));

  const tableLines = rows.map(([label, value]) => {
    const padded = label.padEnd(maxLabelLen);
    return (
      '  ' +
      chalk.dim('▸') +
      ' ' +
      chalk.cyan(padded) +
      '  ' +
      chalk.white(value)
    );
  });

  const box = boxen(
    chalk.bold.white('◈ BUILD MANIFEST ◈') +
      '\n' +
      chalk.cyan(`  PILOT ID  `) +
      chalk.white.bold(config.projectName.toUpperCase()) +
      '\n' +
      chalk.cyan(`  FRAME     `) +
      chalk.white(config.projectType.toUpperCase()) +
      '\n\n' +
      tableLines.join('\n'),
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'double',
      borderColor: 'cyan',
      title: chalk.dim('DEPLOYMENT PACKAGE'),
      titleAlignment: 'center',
    }
  );

  console.log(box);
}

export function displaySuccess(config: BuildConfig): void {
  const nextSteps = [
    chalk.dim('$') + ' ' + chalk.cyan(`cd ${config.projectName}`),
    chalk.dim('$') + ' ' + chalk.cyan('npm install'),
    chalk.dim('$') + ' ' + chalk.cyan('npm run dev'),
  ].join('\n    ');

  const message =
    neonGreen(`⚡ SP//DR online — `) +
    chalk.bold.white(config.projectName) +
    neonGreen(` assembled successfully`) +
    '\n\n' +
    chalk.dim('  📁 Location: ') +
    chalk.white(`./${config.projectName}`) +
    '\n\n' +
    chalk.cyan('  🔧 Next Steps:\n') +
    '    ' +
    nextSteps;

  console.log(
    boxen(message, {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 1, right: 1 },
      borderStyle: 'round',
      borderColor: 'greenBright',
      title: chalk.greenBright('  BUILD COMPLETE  '),
      titleAlignment: 'center',
    })
  );
}

export function displayDryRunHeader(config: BuildConfig): void {
  console.log(
    boxen(
      goldGradient('◈ DRY RUN MODE ◈') +
        '\n' +
        chalk.dim('  No files will be written to disk.\n') +
        chalk.dim(`  Preview for: `) +
        chalk.white.bold(config.projectName),
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'classic',
        borderColor: 'yellow',
      }
    )
  );
}

export function displayError(message: string): void {
  console.log(
    boxen(chalk.red('✖ ') + chalk.white(message), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      borderStyle: 'round',
      borderColor: 'red',
    })
  );
}
