import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { AxiosError } from "axios";
import { usePostApiAuthSignup } from "@generated/web-api/default/default";
import type { PostApiAuthSignupBody } from "@generated/web-api/model/postApiAuthSignupBody";
import type { PostApiAuthSignup200 } from "@generated/web-api/model/postApiAuthSignup200";

export function meta() {
  return [
    { title: "サインアップ - Journey" },
    { name: "description", content: "新しいアカウントを作成して始めましょう" },
  ];
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostApiAuthSignupBody>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PostApiAuthSignupBody, string>>
  >({});

  const signupMutation = usePostApiAuthSignup({
    mutation: {
      onSuccess: (response) => {
        // サインアップ成功時の処理
        // response.data には PostApiAuthSignup200 型のデータが含まれます
        const userData: PostApiAuthSignup200 = response.data;
        console.log("サインアップ成功:", userData);
        // ホームページへリダイレクト
        navigate("/");
      },
      onError: (error: AxiosError) => {
        // エラーハンドリング
        const newErrors: Partial<Record<keyof PostApiAuthSignupBody, string>> =
          {};

        if (error.response?.data) {
          const errorData = error.response.data as {
            message?: string;
            errors?: Record<string, string[]>;
          };

          // バリデーションエラーの場合
          if (errorData.errors) {
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (
                field === "name" ||
                field === "email" ||
                field === "password"
              ) {
                newErrors[field] = messages[0] || "入力に問題があります。";
              }
            });
          } else if (errorData.message) {
            // 一般的なエラーメッセージ
            newErrors.email = errorData.message;
          } else {
            newErrors.email = "サインアップに失敗しました。";
          }
        } else if (error.request) {
          // リクエストは送信されたが、レスポンスが受け取れなかった場合
          newErrors.email =
            "サーバーに接続できませんでした。しばらくしてから再度お試しください。";
        } else {
          // リクエストの設定中にエラーが発生した場合
          newErrors.email =
            "サインアップに失敗しました。もう一度お試しください。";
        }

        setErrors(newErrors);
      },
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PostApiAuthSignupBody, string>> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "名前は2文字以上で入力してください。";
    }

    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください。";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // クライアント側バリデーション
    if (!validateForm()) {
      return;
    }

    // usePostApiAuthSignup の mutate 関数を使用してリクエストを送信
    // mutate の引数は { data: PostApiAuthSignupBody } の形式
    signupMutation.mutate({ data: formData });
  };

  const handleChange =
    (field: keyof PostApiAuthSignupBody) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // フィールド変更時にエラーをクリア
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            アカウントを作成
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            新しいアカウントを作成して始めましょう
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange("name")}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="山田 太郎"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange("email")}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange("password")}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="8文字以上"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {signupMutation.isPending ? "作成中..." : "アカウントを作成"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              既にアカウントをお持ちの方はこちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
