import consola from "consola";
import $ from "dax-sh";

export default async function sound(): Promise<void> {
  consola.info("サウンド設定を構成しています...");

  // 起動チャイムを無効化
  // Macの起動時に鳴るチャイム音を無効にします
  // 静かな環境での使用や、深夜の再起動時に便利です
  await $`sudo nvram StartupMute=%01`;

  consola.success("サウンド設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await sound();
}
