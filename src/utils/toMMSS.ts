/**
 * Converts a float time representation from seconds to the `MM:SS:MS` format.
 * @param  {number} secs  The amount of seconds.
 * @returns string        The formatted time.
 */
export function toMMSS(secs: number): string {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const ms = Math.floor((secs - minutes * 60 - seconds) * 100);

  return `${minutes}:${seconds}:${ms}`;
}
