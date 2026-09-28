import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give internal server error response on user request
 * @export
 * @class InternalServerErrorException
 * @extends {HttpException}
 */
export class InternalServerErrorException extends HttpException {
  constructor(message?: string | object, error = 'Internal Server Error') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
