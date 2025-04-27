import consola from "consola";
import $ from "dax-sh";

export default async function keyboard(): Promise<void> {
  consola.info("キーボード設定を構成しています...");

  // キーリピート速度の設定: 値が小さいほどキーリピートが速くなります（通常は1〜2が高速）
  // システムの応答性を向上させ、テキスト入力やカーソル移動を効率化します
  await $`defaults write NSGlobalDomain KeyRepeat -int 2`;

  // 初期キーリピート遅延の設定: 値が小さいほどキーを押してからリピートが始まるまでの時間が短くなります
  // 素早いタイピングをサポートするために、押し続けた時の反応速度を調整します
  await $`defaults write NSGlobalDomain InitialKeyRepeat -int 15`;

  // 長押しによる特殊文字表示機能の無効化: falseにするとキーの長押しでアクセント付き文字などを選択するメニューが表示されなくなります
  // デフォルト（true）では例えば「a」キーを長押しするとà、á、â、äなどの選択肢が表示されますが、
  // falseに設定すると代わりにキーリピート（文字の連続入力）が有効になり、プログラミングなどの作業に適しています
  await $`defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false`;

  consola.success("キーボード設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await keyboard();
}
