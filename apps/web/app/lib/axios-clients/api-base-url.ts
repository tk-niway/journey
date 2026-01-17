/**
 * APIのベースURLを決定する
 */
export const resolveApiBaseUrl = (envBaseUrl: string | undefined): string => {
  return envBaseUrl ?? '';
};
