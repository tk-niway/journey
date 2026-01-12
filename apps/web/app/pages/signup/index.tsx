import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AxiosError } from "axios";
import { usePostApiAuthSignup } from "@generated/web-api/default/default";
import type { PostApiAuthSignupBody } from "@generated/web-api/model/postApiAuthSignupBody";
import type { PostApiAuthSignup200 } from "@generated/web-api/model/postApiAuthSignup200";
import { InputText } from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { Heading } from "../../components/texts/Heading";
import { Description } from "../../components/texts/Description";
import { LinkText } from "../../components/texts/LinkText";

// Zod スキーマの定義
const signupSchema = z.object({
  name: z
    .string()
    .min(2, "名前は2文字以上で入力してください。")
    .max(100, "名前は100文字以内で入力してください。"),
  email: z.email("有効なメールアドレスを入力してください。"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください。")
    .max(100, "パスワードは100文字以内で入力してください。"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function meta() {
  return [
    { title: "サインアップ - Journey" },
    { name: "description", content: "新しいアカウントを作成して始めましょう" },
  ];
}

export default function SignupPage() {
  const navigate = useNavigate();

  // react-hook-form の設定（zod スキーマを使用）
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

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
                setError(field as keyof PostApiAuthSignupBody, {
                  type: "server",
                  message: messages[0] || "入力に問題があります。",
                });
              }
            });
          } else if (errorData.message) {
            // 一般的なエラーメッセージ
            setError("email", {
              type: "server",
              message: errorData.message,
            });
          } else {
            setError("email", {
              type: "server",
              message: "サインアップに失敗しました。",
            });
          }
        } else if (error.request) {
          // リクエストは送信されたが、レスポンスが受け取れなかった場合
          setError("email", {
            type: "server",
            message:
              "サーバーに接続できませんでした。しばらくしてから再度お試しください。",
          });
        } else {
          // リクエストの設定中にエラーが発生した場合
          setError("email", {
            type: "server",
            message: "サインアップに失敗しました。もう一度お試しください。",
          });
        }
      },
    },
  });

  // フォーム送信処理
  const onSubmit = (data: SignupFormData) => {
    // zod でバリデーション済みのデータを PostApiAuthSignupBody 型に変換
    const signupData: PostApiAuthSignupBody = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    // usePostApiAuthSignup の mutate 関数を使用してリクエストを送信
    // mutate の引数は { data: PostApiAuthSignupBody } の形式
    signupMutation.mutate({ data: signupData });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Heading className="mt-6">アカウントを作成</Heading>
          <Description className="mt-2">
            新しいアカウントを作成して始めましょう
          </Description>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <InputText
              label="名前"
              type="text"
              autoComplete="name"
              placeholder="山田 太郎"
              error={errors.name}
              {...register("name")}
            />
            <InputText
              label="メールアドレス"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              error={errors.email}
              {...register("email")}
            />
            <InputText
              label="パスワード"
              type="password"
              autoComplete="new-password"
              placeholder="8文字以上"
              error={errors.password}
              {...register("password")}
            />
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isSubmitting || signupMutation.isPending}
            >
              アカウントを作成
            </Button>
          </div>

          <div className="text-center">
            <LinkText to="/">既にアカウントをお持ちの方はこちら</LinkText>
          </div>
        </form>
      </div>
    </div>
  );
}
