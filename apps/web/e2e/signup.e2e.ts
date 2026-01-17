import { test, expect } from '@playwright/test';

/**
 * SignupページのE2Eテスト
 * ルーティングと認証ガードのテスト
 */
test.describe('Signup Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にlocalStorageをクリア
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('未認証ユーザーは/signupにアクセスできる', async ({ page }) => {
    await page.goto('/signup');

    // ページが正しく表示される
    await expect(page).toHaveTitle(/サインアップ/);
    await expect(page.getByRole('heading', { name: 'アカウントを作成' })).toBeVisible();
  });

  test('認証済みユーザーは/signupにアクセスすると/homeにリダイレクトされる', async ({
    page,
  }) => {
    // /api/users/me をモック（認証済みユーザーとして扱う）
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: '山田 太郎',
          email: 'test@example.com',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }),
      });
    });

    // ページ読み込み前にトークンを設定（clientLoaderが実行される前に設定される）
    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'test-token');
    });

    // /signupにアクセスし、/homeへのリダイレクトを待機
    await page.goto('/signup', { waitUntil: 'networkidle' });

    // /homeにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/home/);
  });

  test('フォームの入力フィールドが表示される', async ({ page }) => {
    await page.goto('/signup');

    // 各入力フィールドが存在することを確認
    await expect(page.getByLabel('名前')).toBeVisible();
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(page.getByRole('button', { name: 'アカウントを作成' })).toBeVisible();
  });

  test('サインインへのリンクが表示される', async ({ page }) => {
    await page.goto('/signup');

    const signinLink = page.getByRole('link', { name: /既にアカウントをお持ちの方はこちら/ });
    await expect(signinLink).toBeVisible();
    await expect(signinLink).toHaveAttribute('href', '/signin');
  });

  test('バリデーションエラーが表示される', async ({ page }) => {
    await page.goto('/signup');

    // 無効なデータを入力
    await page.getByLabel('名前').fill('あ');
    await page.getByLabel('メールアドレス').fill('invalid-email');
    await page.getByLabel('パスワード').fill('123');

    // 送信ボタンをクリック
    await page.getByRole('button', { name: 'アカウントを作成' }).click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('名前は2文字以上で入力してください。')).toBeVisible();
    await expect(page.getByText('有効なメールアドレスを入力してください。')).toBeVisible();
    await expect(page.getByText('パスワードは8文字以上で入力してください。')).toBeVisible();
  });

  test('有効なデータでフォームを送信できる', async ({ page }) => {
    await page.goto('/signup');

    // APIリクエストをインターセプト
    let requestIntercepted = false;
    await page.route('**/api/auth/signup', async (route) => {
      requestIntercepted = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: '1',
            name: '山田 太郎',
            email: 'test@example.com',
          },
        }),
      });
    });

    // 有効なデータを入力
    await page.getByLabel('名前').fill('山田 太郎');
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('password123');

    // 送信ボタンをクリック
    await page.getByRole('button', { name: 'アカウントを作成' }).click();

    // APIリクエストが送信されたことを確認
    await expect(async () => {
      expect(requestIntercepted).toBe(true);
    }).toPass();
  });

  test('サインインリンクをクリックすると/signinに遷移する', async ({ page }) => {
    await page.goto('/signup');

    const signinLink = page.getByRole('link', { name: /既にアカウントをお持ちの方はこちら/ });
    await signinLink.click();

    // /signinに遷移することを確認
    await expect(page).toHaveURL(/\/signin/);
  });
});
