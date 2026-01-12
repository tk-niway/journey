import { ErrorCode } from '@shared/error-code.const';

export abstract class DbErrorAbstract extends Error {
  abstract code?: ErrorCode;
}
