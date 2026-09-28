import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give unauthorized error response
 * @export
 * @class UnauthorizedException
 * @extends {HttpException}
 */
export class UnauthorizedException extends HttpException {
  constructor(message?: string | object, error = 'Unauthorized') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED
    );
  }
}
