import { HttpException } from './http.exception.js';
import { createHttpExceptionBody } from '../utils/index.js';
import { HttpStatus } from '../constants/index.js';

/**
 * Use to give large entity error on user request
 * @export
 * @class LargeRequestException
 * @extends {HttpException}
 */
export class LargeRequestException extends HttpException {
  constructor(message?: string | object, error = 'Entity Too Large') {
    super(
      createHttpExceptionBody(message ?? error, error, HttpStatus.PAYLOAD_TOO_LARGE),
      HttpStatus.PAYLOAD_TOO_LARGE
    );
  }
}
