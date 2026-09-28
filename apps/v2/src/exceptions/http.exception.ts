/**
 * Base http exception class.
 * @export
 * @class HttpException
 * @extends {Error}
 */
export class HttpException extends Error {
  /**
   * Response to be sent to user on exception
   * @private
   * @type {(string | object)}
   */
  private readonly response: string | object;

  /**
   * Http status of the exception
   * @private
   * @type {number}
   */
  private readonly status: number;

  /**
   * Exception message
   * @type {*}
   */
  override readonly message: string;

  /**
   * Raw response / payload
   */
  readonly payload: unknown;

  /**
   * Creates an instance of HttpException.
   * This is a base exception class.
   * It generates error response based on given response object
   * @param {(string | object)} response
   * @param {number} status
   */
  constructor(response: string | object, status: number) {
    super();
    this.name = this.constructor.name;
    this.response = response;
    this.status = status;
    this.payload = response;
    this.message = typeof response === 'string' ? response : JSON.stringify(response);

    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Give response of exception
   * @returns {(string | object)}
   */
  getResponse(): string | object {
    return this.response;
  }

  /**
   * Give http status of exception
   * @returns {number}
   */
  getStatus(): number {
    return this.status;
  }

  /**
   * Give exception message in string
   * @returns {string}
   */
  override toString(): string {
    const message = this.getErrorString(this.payload);
    return `Error: ${message}`;
  }

  /**
   * Generate error message string
   * @private
   * @param {*} target
   * @returns
   */
  private getErrorString(target: unknown) {
    return typeof target === 'string' ? target : JSON.stringify(target);
  }
}
