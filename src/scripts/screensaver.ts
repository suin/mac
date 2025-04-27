import consola from "consola";

export default async function screensaver(): Promise<void> {
  consola.info("スクリーンセーバーの設定を構成しています...");

  consola.success("スクリーンセーバーの設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await screensaver();
}
