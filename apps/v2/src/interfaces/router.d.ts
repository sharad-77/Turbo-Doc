declare module 'router' {
  export interface NextFunction {
    (err?: unknown): void;
    (deferToNext: 'router'): void;
  }

  export type RouteHandler = (
    req: import('http').IncomingMessage,
    res: import('http').ServerResponse,
    next: NextFunction
  ) => void | Promise<void>;

  export interface RouterInstance {
    (
      req: import('http').IncomingMessage,
      res: import('http').ServerResponse,
      next?: (err?: unknown) => void
    ): void;
    use(...handlers: unknown[]): this;
    use(path: string | RegExp, ...handlers: unknown[]): this;
    get(path: string | RegExp, ...handlers: unknown[]): this;
    post(path: string | RegExp, ...handlers: unknown[]): this;
    put(path: string | RegExp, ...handlers: unknown[]): this;
    delete(path: string | RegExp, ...handlers: unknown[]): this;
    patch(path: string | RegExp, ...handlers: unknown[]): this;
    options(path: string | RegExp, ...handlers: unknown[]): this;
    head(path: string | RegExp, ...handlers: unknown[]): this;
    all(path: string | RegExp, ...handlers: unknown[]): this;
    [key: string]: unknown;
  }

  export interface RouterOptions {
    caseSensitive?: boolean;
    mergeParams?: boolean;
    strict?: boolean;
  }

  export interface RouterConstructor {
    new (options?: RouterOptions): RouterInstance;
    (options?: RouterOptions): RouterInstance;
  }

  const Router: RouterConstructor;
  export default Router;
}
