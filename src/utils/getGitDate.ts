import { execFileSync } from 'child_process';

const gitDateCache = new Map<string, string>();

/**
 * Returns the ISO 8601 date of the last commit touching the specified file from git log.
 * Never returns the build date or current timestamp.
 */
export function getGitCommitDate(filePath?: string): string {
  if (!filePath) return '2026-01-01T00:00:00Z';
  if (gitDateCache.has(filePath)) {
    return gitDateCache.get(filePath)!;
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
    // Silently fall back to deterministic project commit baseline
  }

  const fallback = '2026-01-01T00:00:00Z';
  gitDateCache.set(filePath, fallback);
  return fallback;
}
