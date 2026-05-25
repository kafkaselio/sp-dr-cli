// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Shared Types
// ─────────────────────────────────────────────

export type ProjectType = 'web' | 'api' | 'fullstack' | 'cli';

export type Database =
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'mongodb'
  | 'redis'
  | 'none';

export type Auth =
  | 'jwt'
  | 'oauth-github'
  | 'oauth-google'
  | 'session'
  | 'none';

export type Extra =
  | 'docker'
  | 'github-actions'
  | 'eslint'
  | 'husky'
  | 'conventional-commits'
  | 'readme';

export interface BuildConfig {
  projectName: string;
  projectType: ProjectType;
  framework: string;
  database: Database;
  auth: Auth;
  extras: Extra[];
  dryRun: boolean;
}

export interface WizardOptions {
  dryRun: boolean;
  preset?: string;
  savePreset?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface PresetStore {
  [name: string]: Omit<BuildConfig, 'dryRun'>;
}

export interface FrameworkMeta {
  label: string;
  value: string;
  hint: string;
}

export const FRAMEWORK_MAP: Record<ProjectType, FrameworkMeta[]> = {
  web: [
    { label: 'React (Vite)', value: 'react-vite', hint: 'Fast SPA with Vite bundler' },
    { label: 'Next.js App Router', value: 'nextjs', hint: 'Full-stack React with App Router' },
    { label: 'Vue (Vite)', value: 'vue-vite', hint: 'Progressive framework on Vite' },
    { label: 'Svelte', value: 'svelte', hint: 'Compile-time reactive framework' },
  ],
  api: [
    { label: 'Express', value: 'express', hint: 'Minimal Node.js web framework' },
    { label: 'FastAPI', value: 'fastapi', hint: 'Modern Python API with auto-docs' },
    { label: 'Django REST', value: 'django', hint: 'Batteries-included Python framework' },
    { label: 'Go Fiber', value: 'go-fiber', hint: 'Express-inspired Go web framework' },
  ],
  fullstack: [
    { label: 'Next.js App Router', value: 'nextjs', hint: 'React full-stack with server components' },
    { label: 'Nuxt', value: 'nuxt', hint: 'Vue-based full-stack framework' },
    { label: 'SvelteKit', value: 'sveltekit', hint: 'Svelte full-stack framework' },
  ],
  cli: [
    { label: 'Node CLI Starter', value: 'node-cli', hint: 'JS/ESM CLI with Commander' },
    { label: 'TypeScript CLI Starter', value: 'ts-cli', hint: 'Typed CLI with Commander + chalk' },
  ],
};

export const DATABASE_OPTIONS: { label: string; value: Database; hint: string }[] = [
  { label: 'PostgreSQL', value: 'postgresql', hint: 'Relational — production standard' },
  { label: 'MySQL', value: 'mysql', hint: 'Relational — widely supported' },
  { label: 'SQLite', value: 'sqlite', hint: 'Embedded — zero config' },
  { label: 'MongoDB', value: 'mongodb', hint: 'Document — flexible schema' },
  { label: 'Redis', value: 'redis', hint: 'In-memory — cache / queue' },
  { label: 'None', value: 'none', hint: 'Skip database configuration' },
];

export const AUTH_OPTIONS: { label: string; value: Auth; hint: string }[] = [
  { label: 'JWT', value: 'jwt', hint: 'Stateless token authentication' },
  { label: 'OAuth — GitHub', value: 'oauth-github', hint: 'Sign in with GitHub' },
  { label: 'OAuth — Google', value: 'oauth-google', hint: 'Sign in with Google' },
  { label: 'Session + Cookie', value: 'session', hint: 'Classic server-side sessions' },
  { label: 'None', value: 'none', hint: 'Skip auth configuration' },
];

export const EXTRA_OPTIONS: { label: string; value: Extra; hint: string }[] = [
  { label: 'Docker Compose', value: 'docker', hint: 'Container orchestration config' },
  { label: 'GitHub Actions CI', value: 'github-actions', hint: 'Automated CI pipeline' },
  { label: 'ESLint + Prettier', value: 'eslint', hint: 'Code quality & formatting' },
  { label: 'Husky Hooks', value: 'husky', hint: 'Git hooks for quality gates' },
  { label: 'Conventional Commits', value: 'conventional-commits', hint: 'Commit message standard' },
  { label: 'README Template', value: 'readme', hint: 'GitHub-ready project README' },
];
