import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give forbidden error response
 * @export
 * @class ForbiddenException
 * @extends {HttpException}
 */
export class ForbiddenException extends HttpException {
  constructor(message?: string | object, error = 'Forbidden') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.FORBIDDEN),
      HttpStatus.FORBIDDEN
    );
  }
}
