import consola from "consola";
import $ from "dax-sh";

export default async function dock(): Promise<void> {
  consola.info("Dockの設定を構成しています...");

  // Dockの自動非表示: trueの場合、Dockを自動で隠します。
  // これを有効にすると画面を広く使えるため、作業スペースが拡大します。
  await $`defaults write com.apple.dock autohide -bool true`;

  // 最近使用したアプリケーションの非表示: falseにすると、Dockに最近のアプリが表示されなくなります。
  // プライバシーを重視する場合や、Dockをシンプルに保ちたい場合に有用です。
  await $`defaults write com.apple.dock show-recents -bool false`;

  // Dockアイコンのサイズ: ピクセル単位でアイコンサイズを設定します。
  // 32pxはデフォルトの約半分で、より多くのアイコンをDockに表示できます。
  await $`defaults write com.apple.dock tilesize -int 32`;

  // Dockアイコンの拡大機能: trueにすると、マウスオーバー時にアイコンが拡大表示されます。
  // アイコンの識別が容易になり、特に多くのアプリがDockにある場合に便利です。
  await $`defaults write com.apple.dock magnification -bool false`;

  // 拡大時のアイコンサイズ: マウスオーバー時のアイコンサイズをピクセル単位で設定します。
  // 64pxは適度な拡大サイズで、アイコンの詳細が見やすくなります。
  await $`defaults write com.apple.dock largesize -int 64`;

  // Dockの位置: "bottom"、"left"、"right"のいずれかを指定できます。
  // 画面下部に配置すると、一般的なmacOSの外観に近くなります。
  await $`defaults write com.apple.dock orientation -string "bottom"`;

  // ウィンドウ最小化エフェクト: "scale"は縮小エフェクトを使用します。
  // このエフェクトは視覚的に分かりやすく、システムの応答が速く感じられます。
  await $`defaults write com.apple.dock mineffect -string "scale"`;

  // アプリケーション起動時のアニメーションを無効化: falseにすると、起動アニメーションが表示されなくなります。
  // システムの応答が速く感じられ、特に低スペックのマシンで有用です。
  await $`defaults write com.apple.dock launchanim -bool false`;

  // 永続的なアプリケーション（空の配列）
  await $`defaults write com.apple.dock persistent-apps -array`;

  // 永続的なその他のアイテム（空の配列）
  await $`defaults write com.apple.dock persistent-others -array`;

  // アプリケーションアイコンに最小化
  await $`defaults write com.apple.dock minimize-to-application -bool true`;

  // 静的アイテムのみ表示
  await $`defaults write com.apple.dock static-only -bool true`;

  // 自動非表示の遅延時間
  await $`defaults write com.apple.dock autohide-delay -float 0.0`;

  // 最近使用したスペース
  await $`defaults write com.apple.dock mru-spaces -bool false`;

  // Launchpadの列数を設定: 各ページに表示されるアプリのアイコンの列数を定義します。
  // 24列に設定すると、より多くのアプリを一度に表示できます。
  await $`defaults write com.apple.dock springboard-columns -int 24`;

  // Launchpadの行数を設定: 各ページに表示されるアプリのアイコンの行数を定義します。
  // 12行に設定すると、より多くのアプリを一度に表示できます。
  await $`defaults write com.apple.dock springboard-rows -int 12`;

  // 変更を適用するためにDockを再起動
  await $`killall Dock`.noThrow();

  consola.success("Dockの設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await dock();
}
