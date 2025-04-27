import consola from "consola";
import env from "#env";
import devbox from "#scripts/devbox";
import dock from "#scripts/dock";
import finder from "#scripts/finder";
import homebrew from "#scripts/homebrew";
import keyboard from "#scripts/keyboard";
import keyboardShortcutKeys from "#scripts/keyboard-shortcut-keys";
import login from "#scripts/login";
import mouse from "#scripts/mouse";
import safari from "#scripts/safari";
import screensaver from "#scripts/screensaver";
import security from "#scripts/security";
import share from "#scripts/share";
import sound from "#scripts/sound";
import { askConfirmation } from "#utils";
import keepSudo from "#utils/keep-sudo";

// 環境変数
consola.info("環境変数の設定内容:");
console.dir(env, { depth: null });

// 権限確認
consola.warn(
  "システム設定を変更するには、Terminalにフルディスクアクセス権限が必要です。",
  "システム環境設定 > プライバシーとセキュリティ > フルディスクアクセス で確認できます。",
  "以下のコマンドでフルディスクアクセス設定を直接開けます：",
  'open "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"',
);

const answer = await askConfirmation(
  "Terminalにフルディスクアクセス権限を設定済みですか？ (y/N): ",
);

if (!answer) {
  consola.error(
    "設定を中止しました。Terminalにフルディスクアクセス権限を付与してから再実行してください。",
  );
  process.exit(1);
}

// sudo権限を維持
const stopSudo = await keepSudo({
  beforeExecSudo() {
    console.log("sudo権限を維持するため、パスワードを入力してください。");
  },
});

// インストールスクリプトを実行
await homebrew();
await devbox();

// 設定スクリプトを実行
await dock();
await finder();
await keyboard();
await keyboardShortcutKeys();
await login();
await mouse();
await safari();
await screensaver();
await security();
await share();
await sound();

consola.success(
  "すべての設定を適用しました。変更を完全に反映させるには再起動をお勧めします。",
);

await stopSudo();
