import { Context } from 'hono';
import logger from '@lib/loggers';
import { DomainErrorAbstract } from '@lib/errors/domain-error.abstract';
import { ErrorObject } from '@api/lib/schemas/error/error-object.schema';
import { ApiError } from '@lib/errors/api-error.abstract';
import { DbErrorAbstract } from '@lib/errors/db-error.abstract';
import { ErrorCode } from '@shared/error-code.const';
import { ERROR_STATUS_MAP } from '@api/lib/errors/error-status.helper';

const createErrorResponse = (message: string, code: ErrorCode): ErrorObject => {
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

  if (err instanceof DomainErrorAbstract || err instanceof DbErrorAbstract) {
    const status = ERROR_STATUS_MAP.get(err.constructor.name);
    const statusCode = status?.statusCode || 500;
    const code = err?.code || status?.code || ErrorCode.INTERNAL_SERVER_ERROR;

    return c.json(createErrorResponse(err.message, code), statusCode);
  }

  return c.json(
    createErrorResponse(
      'Internal Server Error',
      ErrorCode.INTERNAL_SERVER_ERROR
    ),
    500
  );
};

export const notFoundHandler = (c: Context) => {
  return c.json(
    createErrorResponse(`Not Found: ${c.req.path}`, ErrorCode.NOT_FOUND),
    404
  );
};
