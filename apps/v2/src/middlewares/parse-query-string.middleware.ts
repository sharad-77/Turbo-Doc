import { ServerResponse } from 'http';
import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';
import { parse as parseUrl } from 'url';

/**
 * Parse url and set query in req.query
 * @export
 * @param {ExtendedRequest} req
 * @param {ServerResponse} res
 * @param {NextFunctionInterface} next
 * @returns
 */
export function ParseQueryStringMiddleware(
  req: ExtendedRequest,
  res: ServerResponse,
  next: NextFunctionInterface
) {
  if (req.url) {
    const queryParams = parseUrl(req.url, true).query;
    req.query = queryParams;
  }
  next();
}
