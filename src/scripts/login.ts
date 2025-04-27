import consola from "consola";
import $ from "#dax";

export default async function login(): Promise<void> {
  consola.info("ログイン画面の設定を構成しています...");

  // ゲストを完全に非表示（ログインも不可）
  // システムセキュリティを強化するため、ゲストユーザーによるログインを無効化します
  await $`sudo defaults write /Library/Preferences/com.apple.loginwindow GuestEnabled -bool false`;

  // ログイン画面を「名前＋パスワード」フォームに固定
  // ユーザー名とパスワードの両方を入力させることで、セキュリティを強化します
  await $`sudo defaults write /Library/Preferences/com.apple.loginwindow SHOWFULLNAME -bool true`;

  // ログインアイコンの設定
  consola.info("ログインアイコンを設定しています...");

  // 画像ファイルの絶対パスを取得
  const img = new URL("../../icon.jpg", import.meta.url).pathname;

  // ② jpegphoto / Picture 属性を一旦削除（残っていると優先度が競合するため）
  await $`sudo dscl . delete /Users/$USER jpegphoto`;
  await $`sudo dscl . delete /Users/$USER Picture`;

  // ③ Picture 属性を新しい画像パスで再作成
  await $`sudo dscl . create /Users/$USER Picture ${img}`;

  consola.info("ログインアイコンが設定されました");

  consola.success("ログイン画面の設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await login();
}
