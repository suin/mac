import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import consola from "consola";
import $ from "#dax";

export default async function security(): Promise<void> {
  consola.info("セキュリティ設定を構成しています...");
  await enableTouchIdOnSudo();
  consola.success("セキュリティ設定が完了しました。");
}

async function enableTouchIdOnSudo(): Promise<void> {
  // Touch IDをsudoコマンドで使用できるように設定
  // これにより、sudoコマンド実行時にパスワード入力の代わりにTouch IDが使用できるようになります
  // Touch IDによる認証は、パスワード入力の手間を省きつつも高いセキュリティを維持できます
  consola.info("sudoコマンドでTouch IDを有効にしています...");
  const edit = existsSync("/etc/pam.d/sudo_local");
  const file = edit
    ? "/etc/pam.d/sudo_local"
    : "/etc/pam.d/sudo_local.template";
  const observedContent = await readFile(file, "utf-8");
  const lines = observedContent.split("\n");
  const hasPamTid = lines.some((line) => /^auth.+pam_tid\.so/.test(line));
  if (!hasPamTid) {
    lines.push("auth       sufficient     pam_tid.so");
  }
  const desiredContent = lines.join("\n");
  if (observedContent === desiredContent) {
    consola.info("sudo_localの設定は変更の必要はありません。");
    return;
  }
  if (edit) {
    await $`sudo chmod +w /etc/pam.d/sudo_local`;
  }
  await $`echo ${desiredContent} | sudo tee /etc/pam.d/sudo_local`;
  await $`sudo chmod -w /etc/pam.d/sudo_local`;
  consola.success("sudoコマンドでTouch IDを有効にしました。");
}

if (import.meta.path === Bun.main) {
  await security();
}
