import consola from "consola";
import $ from "#dax";
import env from "#env";

export default async function share(): Promise<void> {
  consola.info("共有設定を構成しています...");

  const machineName = env.MACHINE_NAME;

  // コンピュータ名とローカルホスト名の設定
  await $`sudo scutil --set ComputerName ${machineName}`;
  await $`sudo scutil --set LocalHostName ${machineName}`;

  // ゲストアカウントの無効化
  // セキュリティを高めるため、システム全体のゲストアカウントを無効にします
  await $`sudo /usr/sbin/sysadminctl -guestAccount off`;

  // AFPゲストアクセスの無効化
  // Apple Filing Protocol経由のゲストアクセスを無効にし、未認証ユーザーからのファイルアクセスを防ぎます
  await $`sudo /usr/sbin/sysadminctl -afpGuestAccess off`;

  // SMBゲストアクセスの無効化
  // Windows互換のファイル共有プロトコル(SMB)経由のゲストアクセスを無効にします
  await $`sudo /usr/sbin/sysadminctl -smbGuestAccess off`;

  // SSH（リモートログイン）を有効化
  await $`sudo systemsetup -setremotelogin on`;

  // 画面共有有効化
  await $`sudo launchctl enable system/com.apple.screensharing`;
  await $`sudo launchctl kickstart -kp system/com.apple.screensharing`;

  consola.success("共有設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await share();
}
