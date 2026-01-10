import { Context } from 'hono';
import logger from '@lib/logger';
import { UserTableCreateError } from '@db/users/users-table.error';
import {
  UserAlreadyExistsError,
  EmailAlreadyExistsError,
} from '@domains/user/errors/user.error';
import { UserApiUserNotFoundError } from '@api/users/errors/user-api.error';
import { ErrorResponse } from '@api/common/schemas/error.schema';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import {
  NotFoundTokenError,
  InvalidUserError,
  InvalidTokenError,
  ExpiredTokenError,
} from '@api/auth/errors/auth.error';

// カスタムエラーの基底インターフェース
interface CustomError extends Error {
  code: string;
}

// エラークラス名とステータスコードのマッピング
const ERROR_STATUS_MAP = new Map<string, ContentfulStatusCode>([
  [UserAlreadyExistsError.name, 409],
  [EmailAlreadyExistsError.name, 409],
  [UserApiUserNotFoundError.name, 404],
  [UserTableCreateError.name, 500],
  [NotFoundTokenError.name, 401],
  [InvalidUserError.name, 401],
  [InvalidTokenError.name, 401],
  [ExpiredTokenError.name, 401],
]);

const createErrorResponse = (message: string, code: string): ErrorResponse => {
  return {
    error: {
      message,
      code,
    },
  };
};

const isCustomError = (err: Error): err is CustomError => {
  return 'code' in err && typeof err.code === 'string';
};

export const errorHandler = (err: Error, c: Context) => {
  logger.error('Global Error Handler', err);

  // カスタムエラーの処理
  const statusCode = ERROR_STATUS_MAP.get(err.constructor.name);

  if (statusCode) {
    const errorCode = isCustomError(err) ? err.code : 'ERROR';
    return c.json(createErrorResponse(err.message, errorCode), statusCode);
  }

  // 予期しないエラー
  return c.json(
    createErrorResponse('Internal Server Error', 'INTERNAL_SERVER_ERROR'),
    500
  );
};

export const notFoundHandler = (c: Context) => {
  return c.json(
    createErrorResponse(`Not Found: ${c.req.path}`, 'NOT_FOUND'),
    404
  );
};
