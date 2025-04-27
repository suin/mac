import { homedir } from "node:os";
import consola from "consola";
import $ from "dax-sh";

export default async function finder(): Promise<void> {
  consola.info("Finderの設定を構成しています...");

  // 全てのファイル拡張子を表示: trueにすると、すべてのファイルの拡張子が表示されます。
  // ファイルタイプを一目で確認できるため、ファイル管理が容易になります。
  await $`defaults write NSGlobalDomain AppleShowAllExtensions -bool true`;

  // 隠しファイルを表示: trueにすると、通常は非表示のファイル（.で始まるファイル）も表示されます。
  // 開発作業や詳細な設定を行う際に便利ですが、通常使用では不要なファイルも表示されるため注意が必要です。
  await $`defaults write com.apple.finder AppleShowAllFiles -bool true`;

  // デスクトップアイコンの非表示: falseにすると、デスクトップ上のアイコンが非表示になります。
  // クリーンな作業環境を好む場合や、デスクトップの整理を強制する場合に有用です。
  await $`defaults write com.apple.finder CreateDesktop -bool false`;

  // 拡張子変更時の警告を無効化: falseにすると、ファイル拡張子を変更する際の警告が表示されなくなります。
  // 頻繁にファイル拡張子を変更する作業を行う場合、作業効率が向上します。
  await $`defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false`;

  // パスバーを表示: trueにすると、Finderウィンドウの下部にファイルパスが表示されます。
  // 現在の位置を把握しやすくなり、ディレクトリ間の移動が容易になります。
  await $`defaults write com.apple.finder ShowPathbar -bool true`;

  // ステータスバーを表示: trueにすると、Finderウィンドウの下部に選択したアイテムの情報が表示されます。
  // ファイル数や容量などの情報を素早く確認できるため、ファイル管理に役立ちます。
  await $`defaults write com.apple.finder ShowStatusBar -bool true`;

  // 新しいFinderウィンドウのデフォルト表示をデスクトップに設定: PfDeはデスクトップを意味します。
  // 頻繁にデスクトップを使用する場合に便利です。
  await $`defaults write com.apple.finder NewWindowTarget -string "PfDe"`;

  // 新しいFinderウィンドウのデフォルトパスをデスクトップに設定: ホームディレクトリのデスクトップを指定します。
  // NewWindowTargetと連携して、新しいウィンドウの初期位置を制御します。
  await $`defaults write com.apple.finder NewWindowTargetPath -string "file://${homedir()}/Desktop/"`;

  // 最近使用したタグを表示しない: falseにすると、最近使用したタグの表示が無効になります。
  // タグ機能を使用しない場合や、インターフェースをシンプルに保ちたい場合に有用です。
  await $`defaults write com.apple.finder ShowRecentTags -bool false`;

  // デフォルトのFinderビューをリスト表示に設定: Nlsvはリストビューを意味します。
  // リスト表示はファイル名、サイズ、更新日時などの詳細情報を一目で確認できるため、効率的なファイル管理が可能になります。
  await $`defaults write com.apple.finder FXPreferredViewStyle -string "Nlsv"`;

  // Finderのサイドバーアイコンサイズを小サイズに設定: 値の1は小サイズを意味します（1=小、2=中（デフォルト）、3=大）。
  // この設定はFinderのサイドバーに表示されるアイコンの大きさに影響します。
  await $`defaults write NSGlobalDomain NSTableViewDefaultSizeMode -int 1`;

  // 変更を適用するためにFinderを再起動
  await $`killall Finder`;

  consola.success("Finderの設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await finder();
}
