import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give not modified response on user request
 * @export
 * @class NotModifiedException
 * @extends {HttpException}
 */
export class NotModifiedException extends HttpException {
  constructor(message?: string | object, error = 'Not Modified') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.NOT_MODIFIED),
      HttpStatus.NOT_MODIFIED
    );
  }
}
