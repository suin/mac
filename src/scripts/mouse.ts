import consola from "consola";
import $ from "dax-sh";

export default async function mouse(): Promise<void> {
  consola.info("マウス設定を構成しています...");

  // スクロール方向の設定: falseにすると、従来の「Windows式」スクロール方向になります。
  // - true (1): ナチュラル（Apple標準）- コンテンツの移動方向がスクロール操作と同じ
  // - false (0): 従来の「Windows式」- スクロール操作と逆方向にコンテンツが移動
  await $`defaults write -g com.apple.swipescrolldirection -bool false`;

  consola.success("マウス設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await mouse();
}
