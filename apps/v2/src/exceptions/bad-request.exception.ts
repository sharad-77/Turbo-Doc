import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give bad request error on user request
 * @export
 * @class BadRequestException
 * @extends {HttpException}
 */
export class BadRequestException extends HttpException {
  constructor(message?: string | object, error = 'Bad Request') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    );
  }
}
