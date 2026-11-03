import { execFileSync } from 'child_process';

const gitDateCache = new Map<string, string | undefined>();
let isShallowRepo: boolean | null = null;

function checkIsShallow(): boolean {
  if (isShallowRepo !== null) return isShallowRepo;
  try {
    const stdout = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    isShallowRepo = stdout === 'true';
  } catch {
    isShallowRepo = false;
  }
  return isShallowRepo;
}

/**
 * Returns the ISO 8601 date of the last commit touching the specified file from git log,
 * or lastReviewed fallback if provided.
 *
 * In a shallow clone (e.g. Cloudflare Workers Builds with --depth 1), git log returns
 * misleading or identical timestamps across all files. In that case, git log is skipped
 * and only lastReviewed is used (or undefined is returned to omit dateModified).
 */
export function getGitCommitDate(filePath?: string, lastReviewed?: string | Date | null): string | undefined {
  const parseReviewed = (dateVal?: string | Date | null): string | undefined => {
    if (!dateVal) return undefined;
    const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  // If in a shallow repository, do NOT use git log; fallback to lastReviewed (or undefined)
  if (checkIsShallow()) {
    return parseReviewed(lastReviewed);
  }

  if (!filePath) {
    return parseReviewed(lastReviewed);
  }

  if (gitDateCache.has(filePath)) {
    return gitDateCache.get(filePath);
  }

  try {
    const stdout = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (stdout) {
      gitDateCache.set(filePath, stdout);
      return stdout;
    }
  } catch {
    // Silently fall back
  }

  const fallback = parseReviewed(lastReviewed);
  gitDateCache.set(filePath, fallback);
  return fallback;
}
