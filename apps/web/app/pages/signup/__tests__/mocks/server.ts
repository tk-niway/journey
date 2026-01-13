import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

/**
 * MSWサーバーのセットアップ
 * APIリクエストをモックする
 */
export const server = setupServer(
  // サインアップAPIのモック
  http.post('http://localhost:3000/api/auth/signup', async ({ request }) => {
    const body = await request.json();
    const { name, email, password } = body as {
      name: string;
      email: string;
      password: string;
    };

    // バリデーションエラーのシミュレーション
    if (email === 'error@example.com') {
      return HttpResponse.json(
        {
          message: 'このメールアドレスは既に使用されています',
          errors: {
            email: ['このメールアドレスは既に使用されています'],
          },
        },
        { status: 400 }
      );
    }

    // 成功レスポンス
    return HttpResponse.json(
      {
        data: {
          id: '1',
          name,
          email,
        },
      },
      { status: 200 }
    );
  })
);
