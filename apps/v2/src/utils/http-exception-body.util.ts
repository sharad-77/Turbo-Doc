/**
 * Use to create http exception body from different exceptions
 * @export
 * @param {(string | object)} message
 * @param {string} [error]
 * @param {number} [statusCode]
 * @returns {object}
 */
export function createHttpExceptionBody(
  message: string | object,
  error?: string,
  statusCode?: number
): object {
  if (!message) {
    return { statusCode, error };
  }
  return typeof message === 'object' && message && !Array.isArray(message)
    ? message
    : { statusCode, error, message };
}
