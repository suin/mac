import consola from "consola";
import $ from "#dax";

export default async function safari(): Promise<void> {
  consola.info("Safariの設定を構成しています...");

  // URLバーに完全なURLを表示: trueにすると、簡略化されたドメイン名ではなく完全なURLが表示されます
  // 開発作業やセキュリティ確認を行う際に、実際のURLパスを確認できるため便利です
  await $`defaults write com.apple.Safari ShowFullURLInSmartSearchField -bool true`;

  // 変更を適用するためにSafariを再起動
  await $`killall Safari`.noThrow();

  consola.success("Safariの設定が完了しました。");
}

if (import.meta.path === Bun.main) {
  await safari();
}
