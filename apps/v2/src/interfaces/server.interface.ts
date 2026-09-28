import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';

/**
 * Interface for extended request object
 * @export
 * @interface ExtendedRequest
 * @extends {IncomingMessage}
 * @template Body
 */
export interface ExtendedRequest<Body = unknown> extends IncomingMessage {
  body: Body;
  token?: Record<string, unknown>;
  params: Record<string, string | undefined>;
  query?: ParsedUrlQuery;
  file?: unknown;
  user?: Record<string, unknown>;
  skip?: boolean;
  platform?: number;
}

export interface ExtendedResponse extends ServerResponse {
  language?: string;
}

/**
 * Interface for next function of middlewares
 * @export
 * @interface NextFunctionInterface
 */
export interface NextFunctionInterface {
  (err?: unknown): void;
  (deferToNext: 'router'): void;
}
