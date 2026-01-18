import {
  UserCreateDbError,
  UserCredentialCreateDbError,
  UserCreateTransactionDbError,
  UserCredentialUpdateDbError,
  UserUpdateDbError,
  UserUpdateTransactionDbError,
} from '@db/repositories/users/users-table.error';
import {
  UserAlreadyExistsError,
  EmailAlreadyExistsError,
  UserNotFoundError,
  UserNotFoundByIdError,
  InvalidPasswordError,
} from '@domains/user/errors/user.error';
import { NoteNotFoundError } from '@domains/note/errors/note.error';
import { ContentfulStatusCode } from '@lib/errors/http-status.const';
import { ErrorCode } from '@shared/error-code.const';

// DomainErrorAbstractのエラークラス名とステータスコードのマッピング
export const ERROR_STATUS_MAP = new Map<
  string,
  { code: ErrorCode; statusCode: ContentfulStatusCode }
>([
  [
    UserAlreadyExistsError.name,
    { code: ErrorCode.USER_ID_ALREADY_EXISTS, statusCode: 409 },
  ],
  [
    EmailAlreadyExistsError.name,
    { code: ErrorCode.USER_EMAIL_ALREADY_EXISTS, statusCode: 409 },
  ],
  [
    UserCreateDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [
    UserCredentialCreateDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [
    UserCreateTransactionDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [
    UserUpdateDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [
    UserCredentialUpdateDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [
    UserUpdateTransactionDbError.name,
    { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 },
  ],
  [UserNotFoundError.name, { code: ErrorCode.USER_NOT_FOUND, statusCode: 404 }],
  [
    UserNotFoundByIdError.name,
    { code: ErrorCode.USER_NOT_FOUND, statusCode: 404 },
  ],
  [
    InvalidPasswordError.name,
    { code: ErrorCode.USER_INVALID_PASSWORD, statusCode: 401 },
  ],
  [NoteNotFoundError.name, { code: ErrorCode.NOTE_NOT_FOUND, statusCode: 404 }],
]);
