import { ServerResponse, OutgoingHttpHeaders } from 'http';

/**
 * Send success response
 * @export
 * @param {ServerResponse} res
 * @param {{ data?: unknown; message?: string }} body
 * @param {number} [statusCode=200]
 * @param {OutgoingHttpHeaders} [headers={}]
 */
export function sendSuccessResponse(
  res: ServerResponse,
  body: { data?: unknown; message?: string },
  statusCode = 200,
  headers: OutgoingHttpHeaders = {}
) {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify({ isError: false, ...body }));
}

/**
 * Send error response
 * @export
 * @param {ServerResponse} res
 * @param {{ data?: unknown; message: string; [key: string]: unknown }} body
 * @param {number} [statusCode=400]
 * @param {OutgoingHttpHeaders} [headers={}]
 */
export function sendErrorResponse(
  res: ServerResponse,
  body: { data?: unknown; message: string; [key: string]: unknown },
  statusCode = 400,
  headers: OutgoingHttpHeaders = {}
) {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify({ isError: true, ...body }));
}
