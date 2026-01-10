import { sign, verify } from 'hono/jwt';
import { setCookie, getCookie } from 'hono/cookie';
import { Context, MiddlewareHandler, Next } from 'hono';
import env from '@consts/env';
import logger from '@lib/logger';
import {
  ExpiredTokenApiError,
  InvalidTokenApiError,
  InvalidUserApiError,
  NotFoundTokenApiError,
} from '@api/errors';

export type AccessTokenPayload = {
  sub: string;
  exp: number;
};

// 認証不要のパスリスト
const publicPaths = ['/api/auth/signup', '/api/auth/login'];

const COOKIE_NAME = 'access_token';

export type RequestUser = {
  id: string;
};

export const createAccessToken = async (
  context: Context,
  userId: string
): Promise<string> => {
  const payload: AccessTokenPayload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  };

  const token = await sign(payload, env.AUTH_SECRET);

  setCookie(context, COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60,
    path: '/',
  });

  return token;
};

// JWT検証ミドルウェアを追加
export const verifyAccessToken: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  // 認証不要のパスの場合はスキップ
  if (publicPaths.includes(c.req.path)) return next();

  // リクエスト元のIPアドレス
  const ipAddress = c.req.header('x-forwarded-for') || 'unknown';

  // リクエスト元のUserAgent
  const userAgent = c.req.header('user-agent') || 'unknown';

  // Cookieからトークンを取得
  let token = getCookie(c, COOKIE_NAME);

  // Cookieにない場合はAuthorizationヘッダーから取得
  if (!token) {
    const authHeader = c.req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    logger.error(
      `Unauthorized: No access token found from ${ipAddress} (${userAgent})`
    );
    throw new NotFoundTokenApiError();
  }

  try {
    const payload = await verify(token, env.AUTH_SECRET);

    // ペイロードをコンテキストに保存
    const user: RequestUser = { id: payload.sub as string };
    c.set('user', user);
    c.set('jwtPayload', payload);

    await next();
  } catch (error) {
    logger.error(
      `Unauthorized: Invalid access token from ${ipAddress} (${userAgent})`,
      error
    );

    // エラーメッセージから期限切れを判定
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('exp') || errorMessage.includes('expired')) {
      logger.error(
        `Unauthorized: Expired access token from ${ipAddress} (${userAgent})`,
        error
      );
      throw new ExpiredTokenApiError();
    }

    logger.error(
      `Unauthorized: Invalid access token from ${ipAddress} (${userAgent})`,
      error
    );
    throw new InvalidTokenApiError();
  }
};

export const requestUserFromContext = (c: Context): RequestUser => {
  const user = c.get('user');
  if (!user) throw new InvalidUserApiError();
  return user;
};
