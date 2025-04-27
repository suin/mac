# コントリビューションガイド

このプロジェクトへの貢献に興味をお持ちいただき、ありがとうございます。このガイドでは、プロジェクトに参加する方法について説明します。

## 開発環境のセットアップ

### 前提条件

- macOS 15.0 (Sequoia) 以降
- [Git](https://git-scm.com/)
- [Devbox](https://www.jetpack.io/devbox/) (開発環境の構築に必要)

### セットアップ手順

1. リポジトリをクローンします。

```bash
git clone https://github.com/yourusername/mac.git
cd mac
```

2. Devbox環境を起動し、必要なツールをセットアップします。

```bash
devbox shell
```

3. Devbox環境内で依存関係をインストールします。Bunもインストールされます。

```bash
bun install
```

4. `.env.dist`ファイルをコピーして`.env`ファイルを作成します。

```bash
cp .env.dist .env
```

5. `.env`ファイルを編集して、開発環境に合わせた設定にします。

## 開発ワークフロー

### コードスタイル

このプロジェクトでは[Biome](https://biomejs.dev/)を使用してコードスタイルを統一しています。コードを提出する前に、lintとフォーマットを実行してください：

```bash
biome check
biome check --fix
```

### スクリプトの追加

新しい設定スクリプトを追加する場合は、以下のパターンに従ってください：

1. `src/scripts/`ディレクトリに新しいTypeScriptファイルを作成します。
2. 次のテンプレートを使用してください：

```typescript
import consola from "consola";
import $ from "dax-sh";

export default async function yourScriptName(): Promise<void> {
  consola.info("処理を開始しています...");
  
  // 設定コマンド
  await $`defaults write com.example.domain YourSetting -bool true`;
  
  consola.success("設定が完了しました");
}

// 単独実行できるようにする
if (import.meta.path === Bun.main) {
  $.setPrintCommand(true);
  await yourScriptName();
}
```

3. `src/index.ts`にインポートして実行リストに追加します。

### テスト

各スクリプトは単独で実行できるよう設計されています。個別にテストするには：

```bash
bun src/scripts/your-script.ts
```

全体をテストするには：

```bash
./index.zsh
```

## イシューとプルリクエスト

### イシューの報告

バグを見つけた場合や新機能のリクエストがある場合は、GitHubイシューを作成してください。その際、以下の情報を含めてください：

- macOSのバージョン
- 問題の詳細な説明
- 再現手順（バグの場合）
- 期待される結果と実際の結果

### プルリクエストのプロセス

1. プロジェクトをフォークします。
2. 新しいブランチを作成します。
3. 変更を加えます。
4. テストを実行して、変更が機能することを確認します。
5. 変更をコミットしてプッシュします。
6. プルリクエストを作成します。

プルリクエストには以下を含めてください：

- 変更内容の簡潔な説明
- 関連するイシューへの参照（該当する場合）
- 変更をテストした方法の説明

## コードレビュー

プルリクエストはメンテナーによってレビューされます。レビュー中に変更が求められることがあります。議論は建設的かつ敬意を払った形で行われることを期待します。

## コミットメッセージのガイドライン

コミットメッセージは以下の形式に従ってください：

```
<type>: <description>

[optional body]
```

typeは次のいずれかを使用してください：

- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響しない変更（フォーマットなど）
- refactor: バグ修正でも新機能追加でもないコード変更
- perf: パフォーマンスを向上させるコード変更
- test: 不足しているテストの追加や既存のテストの修正
- chore: ビルドプロセスやツールなどの変更

例：

```
feat: 画面録画設定スクリプトを追加

macOSの画面録画設定を自動化するスクリプトを追加。
画質、フレームレート、保存場所などの設定が可能。
```

## ブランチ戦略

現在は以下のブランチ戦略を採用しています：

- `main`: 安定版ブランチ。リリース済みのコードのみ。

## ヘルプと質問

質問や支援が必要な場合は、GitHubのイシューを作成するか、プロジェクトのDiscussionsセクションを利用してください。
