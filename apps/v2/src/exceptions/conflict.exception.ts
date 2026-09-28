import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give conflict error on user request
 * @export
 * @class ConflictException
 * @extends {HttpException}
 */
export class ConflictException extends HttpException {
  constructor(message?: string | object, error = 'Conflict') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.CONFLICT),
      HttpStatus.CONFLICT
    );
  }
}
