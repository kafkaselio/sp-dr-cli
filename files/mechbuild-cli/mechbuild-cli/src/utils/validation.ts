// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Validation Utilities
// ─────────────────────────────────────────────

/** Validates a project name: lowercase, kebab-case, no spaces, no special chars. */
export function validateProjectName(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return 'Project name cannot be empty.';
  }

  if (/\s/.test(value)) {
    return 'No spaces allowed — use kebab-case (e.g. my-project)';
  }

  if (/[A-Z]/.test(value)) {
    return 'Lowercase only — use kebab-case (e.g. my-project)';
  }

  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    return 'Must start with a letter and contain only a-z, 0-9, and hyphens.';
  }

  if (value.length < 2) {
    return 'Project name must be at least 2 characters.';
  }

  if (value.length > 64) {
    return 'Project name must be 64 characters or fewer.';
  }

  if (value.startsWith('-') || value.endsWith('-')) {
    return 'Cannot start or end with a hyphen.';
  }

  if (/--/.test(value)) {
    return 'Cannot contain consecutive hyphens.';
  }

  return undefined; // valid
}

/** Converts a freeform string to a valid kebab-case project name. */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Checks if a directory path already exists. Returns an error string or undefined. */
export async function validateDirectoryFree(
  name: string
): Promise<string | undefined> {
  const { existsSync } = await import('fs');
  if (existsSync(name)) {
    return `Directory "./${name}" already exists. Choose a different name or remove it first.`;
  }
  return undefined;
}
