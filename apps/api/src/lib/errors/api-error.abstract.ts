import { ErrorCode } from '@shared/error-code.const';
import { ContentfulStatusCode } from '@lib/errors/http-status.const';

export abstract class ApiError extends Error {
  abstract code: ErrorCode;
  abstract statusCode: ContentfulStatusCode;
}
