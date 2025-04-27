# カスタマイズガイド

このドキュメントでは、macOS設定スクリプトをカスタマイズする方法について説明します。

## スクリプト別のカスタマイズ

各設定スクリプトは`src/scripts/`ディレクトリに配置されています。特定の設定をカスタマイズするには、対応するスクリプトファイルを編集します。

## カスタマイズ例

### 最小限の変更を適用する

特定の設定のみを適用したい場合は、`src/index.ts`ファイルを編集して、必要ないスクリプトをコメントアウトします：

```typescript
// 設定スクリプトを実行
await dock();
await finder();
// await keyboard();  // コメントアウトして適用しない
// await keyboardShortcutKeys();  // コメントアウトして適用しない
// await login();  // コメントアウトして適用しない
await mouse();
// 他の設定...
```

### 独自の設定スクリプトを追加する

1. `src/scripts/`ディレクトリに新しい設定ファイル（例：`myconfig.ts`）を作成します：

```typescript
import consola from "consola";
import $ from "dax-sh";

export default async function myconfig(): Promise<void> {
  consola.info("カスタム設定を適用しています...");
  
  // 独自の設定コマンド
  await $`defaults write com.example.app MySetting -bool true`;
  
  consola.success("カスタム設定を適用しました");
}

if (import.meta.path === Bun.main) {
  await myconfig();
}
```

2. `src/index.ts`にインポートして実行リストに追加します：

```typescript
import myconfig from "#scripts/myconfig";

// 他のインポート...

// 設定スクリプトを実行
await dock();
await finder();
// 他の設定...
await myconfig();  // 独自の設定を追加
```

## ショートカットキーの調べ方

ショートカットキーのIDを調べるには、以下の手順を使用します：

```bash
# 現在のショートカットキー設定を保存
defaults read $HOME/Library/Preferences/com.apple.symbolichotkeys.plist > com.apple.symbolichotkeys.plist
git add com.apple.symbolichotkeys.plist

# GUIでショートカットキーを変更する

# 変更後の設定を保存して差分を確認
defaults read $HOME/Library/Preferences/com.apple.symbolichotkeys.plist > com.apple.symbolichotkeys.plist
git diff
```

この方法で、設定変更前後の差分を確認し、変更したいショートカットキーのIDを特定できます。

## 単独実行

部分的に設定スクリプトを実行したいときに便利です。

```bash
./bin/bun src/scripts/実行したいファイル.ts
```

初回実行時、`bin`ディレクトリが存在しない場合は`index.zsh`を先に実行することでbunが自動的にインストールされます。

この単独実行の方法により、個別のスクリプトを実行して特定の設定のみを適用できます。
