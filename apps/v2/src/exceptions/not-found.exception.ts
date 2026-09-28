import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give not found error on user request
 * @export
 * @class NotFoundException
 * @extends {HttpException}
 */
export class NotFoundException extends HttpException {
  constructor(message?: string | object, error = 'Not Found') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND
    );
  }
}
