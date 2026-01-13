import { ErrorCode } from '@shared/error-code.const';
import type { AxiosError } from 'axios';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/** APIエラーレスポンスの型 */
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  error?: {
    code?: ErrorCode;
    message?: string;
  };
}

/** エラーハンドリング結果 */
export interface ErrorHandlerResult {
  status: number;
  message: string;
  code: ErrorCode;
  validationErrors?: Record<string, string[]>;
}

/**
 * Axiosエラーを解析して統一されたエラー情報を返す
 */
export const axiosErrorHandler = (error: AxiosError): ErrorHandlerResult => {
  const status = error.response?.status || 500;
  const defaultMessage = '不明なエラーが発生しました';
  const defaultCode = ErrorCode.INTERNAL_SERVER_ERROR;

  // レスポンスがない場合
  if (!error.response?.data) {
    // リクエストは送信されたがレスポンスがない
    if (error.request) {
      return {
        status,
        message:
          'サーバーに接続できませんでした。しばらくしてから再度お試しください。',
        code: defaultCode,
      };
    }
    // リクエスト設定中のエラー
    return {
      status,
      message: defaultMessage,
      code: defaultCode,
    };
  }

  const errorData = error.response.data as ApiErrorResponse;

  // バリデーションエラーがある場合
  const validationErrors = errorData.errors;

  // メッセージの優先順位: error.message > errorData.message > errors の最初のメッセージ > デフォルト
  let message = errorData.error?.message || errorData.message;
  if (!message && validationErrors) {
    const firstError = Object.values(validationErrors)[0]?.[0];
    message = firstError || '入力に問題があります';
  }

  return {
    status,
    message: message || defaultMessage,
    code: errorData.error?.code || defaultCode,
    validationErrors,
  };
};

/**
 * バリデーションエラーをreact-hook-formのエラーとしてセットする
 */
export const setFormValidationErrors = <T extends FieldValues>(
  validationErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>,
  allowedFields: readonly (keyof T)[]
): void => {
  if (!validationErrors) return;

  Object.entries(validationErrors).forEach(([field, messages]) => {
    if (allowedFields.includes(field as keyof T) && messages[0]) {
      setError(field as Path<T>, {
        type: 'server',
        message: messages[0],
      });
    }
  });
};
