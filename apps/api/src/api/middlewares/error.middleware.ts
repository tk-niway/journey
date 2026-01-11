import { Context } from 'hono';
import logger from '@lib/loggers';
import {
  UserCreateDbError,
  UserCreateTransactionDbError,
  UserCredentialCreateDbError,
} from '@db/repositories/users/users-table.error';
import {
  UserAlreadyExistsError,
  EmailAlreadyExistsError,
  UserNotFoundError,
} from '@domains/user/errors/user.error';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ApiError } from '@api/lib/errors/exceptions';
import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';
import { DbErrorAbstract } from '@db/lib/errors/db-error.abstract';
import { ErrorObject } from '@api/lib/schemas/error/error-object.schema';

// DomainErrorAbstractのエラークラス名とステータスコードのマッピング
const ERROR_STATUS_MAP = new Map<string, ContentfulStatusCode>([
  [UserAlreadyExistsError.name, 409],
  [EmailAlreadyExistsError.name, 409],
  [UserCreateDbError.name, 500],
  [UserCredentialCreateDbError.name, 500],
  [UserCreateTransactionDbError.name, 500],
  [UserNotFoundError.name, 404],
]);

const createErrorResponse = (message: string, code: string): ErrorObject => {
  return {
    error: {
      message,
      code,
    },
  };
};

export const errorHandler = (err: Error, c: Context) => {
  logger.error('Global Error Handler', err);

  if (err instanceof ApiError) {
    return c.json(createErrorResponse(err.message, err.code), err.statusCode);
  }

  if (err instanceof DomainErrorAbstract) {
    const statusCode = ERROR_STATUS_MAP.get(err.constructor.name) || 500;

    return c.json(createErrorResponse(err.message, err.code), statusCode);
  }

  if (err instanceof DbErrorAbstract) {
    const statusCode = ERROR_STATUS_MAP.get(err.constructor.name) || 500;

    return c.json(createErrorResponse(err.message, err.code), statusCode);
  }

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
