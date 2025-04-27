import { exec, spawnSync } from "node:child_process";
import { promisify } from "node:util";

/**
 * Maintains sudo privileges by periodically refreshing the sudo timestamp.
 *
 * This function prevents sudo from timing out during long-running operations
 * that require elevated privileges. It works by running `sudo -v` at regular
 * intervals to extend the sudo session.
 *
 * @example
 * ```ts
 * import keepSudo from '#utils/keep-sudo';
 *
 * // Start maintaining sudo privileges
 * const stopSudo = await keepSudo();
 *
 * // Run operations that require sudo privileges...
 *
 * // Stop maintaining sudo privileges when done
 * await stopSudo();
 * ```
 *
 * @returns A function that stops the sudo maintenance when called
 * @throws {Error} If the initial sudo authentication fails
 */
export default async function keepSudo({
  interval = 60_000,
  beforeExecSudo = () => {},
}: KeepSudoOptions = {}): Promise<StopSudo> {
  if (isSudoing()) {
    return () => Promise.resolve();
  }
  await beforeExecSudo();
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await execSudo();
  } catch (error) {
    throw new Error(`Failed to execute sudo: ${error}`, { cause: error });
  }
  const pool = () => execSudo().catch(() => {});
  const id = setInterval(pool, interval);
  return async () => void clearInterval(id);
}

type KeepSudoOptions = {
  /**
   * The time interval in milliseconds between sudo refreshes (default: 60000ms / 1 minute)
   */
  interval?: number;

  /**
   * A function that will be called when the sudo command is executed.
   */
  beforeExecSudo?: () => Promise<void> | void;
};

/**
 * A function that stops the sudo maintenance process when called.
 * This is returned by the keepSudo function.
 */
type StopSudo = () => Promise<void>;

/**
 * Executes a sudo command to refresh the sudo timestamp.
 * Uses `sudo -v` which extends the sudo session without executing a command.
 *
 * @returns A promise that resolves when the sudo command completes successfully
 * @throws If the sudo command fails (e.g., authentication fails or sudo is not available)
 */
async function execSudo(): Promise<void> {
  await execAsync("sudo -v");
}

const execAsync = promisify(exec);

/**
 * Checks if sudo privileges are currently cached/available without prompting for password.
 *
 * This function allows checking if sudo is available without showing any password prompts
 * or error messages to the user.
 *
 * @example
 * ```ts
 * import { isSudoing } from '#utils/keep-sudo';
 *
 * if (isSudoing()) {
 *   console.log('Sudo privileges are cached');
 *   // Perform operations requiring sudo...
 * } else {
 *   console.log('Need to request sudo privileges first');
 *   // Request sudo privileges...
 * }
 * ```
 *
 * @returns true if sudo is cached, false otherwise
 */
export function isSudoing(): boolean {
  const result = spawnSync("sudo", ["-n", "true"], { stdio: "ignore" });
  return result.status === 0;
}
