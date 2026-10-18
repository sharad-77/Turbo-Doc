import Router from 'router';
import { ServerResponse } from 'http';
import { API_URLS, HttpStatus, ResponseMessage } from '../constants/index.js';
import { ExtendedRequest } from '../interfaces/index.js';
import { zodValidatorMiddleware, requireAuth } from '../middlewares/index.js';
import {
  signUpSchema,
  signInEmailSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  sendVerificationEmailSchema,
  verifyEmailSchema,
} from '../schemas/index.js';
import { auth, toNodeHandler, Session } from '@repo/auth-v2';
import { sendSuccessResponse } from '../utils/index.js';

const authRouter = Router();
const nodeHandler = toNodeHandler(auth);

const authHandler = (req: ExtendedRequest, res: ServerResponse) => {
  if (!req.headers.origin && req.headers.host) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    req.headers.origin = `${protocol}://${req.headers.host}`;
  }
  return nodeHandler(req, res);
};

authRouter.post(API_URLS.SIGNUP_EMAIL, zodValidatorMiddleware(signUpSchema), authHandler);

authRouter.post(API_URLS.SIGNIN_EMAIL, zodValidatorMiddleware(signInEmailSchema), authHandler);

authRouter.post(
  API_URLS.FORGET_PASSWORD,
  zodValidatorMiddleware(forgetPasswordSchema),
  authHandler
);

authRouter.post(API_URLS.RESET_PASSWORD, zodValidatorMiddleware(resetPasswordSchema), authHandler);

authRouter.post(
  API_URLS.CHANGE_PASSWORD,
  requireAuth,
  zodValidatorMiddleware(changePasswordSchema),
  authHandler
);

authRouter.post(
  API_URLS.SEND_VERIFICATION_EMAIL,
  zodValidatorMiddleware(sendVerificationEmailSchema),
  authHandler
);

authRouter.get(API_URLS.VERIFY_EMAIL, zodValidatorMiddleware(verifyEmailSchema), authHandler);

authRouter.get(API_URLS.ME, requireAuth, (req: ExtendedRequest, res: ServerResponse) => {
  const session = (req as ExtendedRequest & { auth?: Session }).auth;
  sendSuccessResponse(
    res,
    {
      data: {
        user: session?.user,
        session: {
          id: session?.session.id,
          expiresAt: session?.session.expiresAt,
          createdAt: session?.session.createdAt,
        },
      },
      message: ResponseMessage.RECORD_FOUND,
    },
    HttpStatus.OK
  );
});

authRouter.use(authHandler);

export { authRouter };
