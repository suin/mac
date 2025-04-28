import fs from "node:fs/promises";

/**
 * アプリケーションがFull Disk Access権限を持っているかどうかをチェックする
 *
 * この関数は保護されたファイル（/Library/Preferences/com.apple.TimeMachine.plist）に
 * アクセスできるかどうかをテストすることで、Full Disk Access権限の有無を判定します。
 *
 * 【実装の背景】
 * macOSでは純正の `tccutil` コマンドは `reset` しかサポートしておらず、
 * 状態確認用の機能は提供されていません。状態を把握するには以下の方法が現実的です：
 *
 * 1. 保護されたファイルを読めるかでテストする（このメソッドで採用）
 *    - メリット: 一行で判定でき、シンプル
 *    - デメリット: 「リストに載っているか」ではなく「今このプロセスが権限を持っているか」を見る方法
 *
 * 2. TCC データベース（SQLite）を直接問い合わせる
 *    - メリット: 正確にアプリケーションがリストに登録されているかを確認できる
 *    - デメリット: Terminal自身にFDAがないとDBを読めない（Catch-22問題）
 *
 * macOSのセキュリティモデルでは、Full Disk Accessが必要な領域へのアクセスは
 * 権限がなければ単純にエラーになります。この性質を利用して権限の有無をチェックしています。
 *
 * 注意: この関数を実行するアプリケーション自体にFull Disk Accessの権限が
 * 付与されていない場合は常にfalseを返します。GUI設定変更後はアプリケーションの
 * 再起動が必要です。
 *
 * @returns アプリケーションがFull Disk Access権限を持っているかどうかを示すPromise<boolean>
 */
export async function checkFullDiskAccess(): Promise<boolean> {
  // FDAが必要な保護されたファイル
  const protectedFile = "/Library/Preferences/com.apple.TimeMachine.plist";

  try {
    // ファイルの読み取りアクセスをテスト
    await fs.access(protectedFile, fs.constants.R_OK);
    return true; // ファイルにアクセスできた場合、FDAあり
  } catch (error) {
    return false; // アクセスに失敗した場合、FDAなし
  }
}

if (import.meta.path === Bun.main) {
  const hasAccess = await checkFullDiskAccess();
  console.log(`Full Disk Access: ${hasAccess ? "Enabled" : "Disabled"}`);
}
