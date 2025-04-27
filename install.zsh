#!/bin/zsh

echo "macOS設定自動化ツールのインストールを開始します..."

# ZIPファイルをダウンロードして展開
echo "リポジトリをダウンロードして展開しています..."
curl -sL https://github.com/suin/mac/archive/refs/heads/main.zip | bsdtar -xf-

# 展開したディレクトリに移動
cd mac-main

# 実行権限の付与
chmod +x index.zsh

# 環境設定ファイルの作成
cp .env.dist .env

# 実行案内
echo ""
echo "インストール準備が完了しました！"
echo ""
echo "次のステップ:"
echo ""
echo "1. mac-mainディレクトリに移動する"
echo "   cd mac-main"
echo ""
echo "2. 環境設定ファイル(.env)を編集する"
echo "   vim .env               # vimで編集する場合"
echo "   open -a TextEdit .env  # TextEditで編集する場合"
echo ""
echo "3. インストールスクリプトを実行する"
echo "   ./index.zsh"
echo "   スクリプトは管理者権限（sudo）を要求します。パスワードを入力してください。"
