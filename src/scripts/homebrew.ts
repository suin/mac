import { constants, access } from "node:fs/promises";
import consola from "consola";
import $ from "dax-sh";

// ディレクトリが存在するかどうかを確認する関数
async function directoryExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export default async function homebrew(): Promise<void> {
  if (await directoryExists("/opt/homebrew")) {
    consola.info("Homebrew は既にインストールされています。");
    return;
  }

  consola.info(
    "Homebrew がインストールされていません。インストールを開始します...",
  );
  const script = $.request(
    "https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh",
  );
  await $`bash`.stdin(script).env("NONINTERACTIVE", "1");

  consola.success("Homebrew のインストールが完了しました。");
}

if (import.meta.path === Bun.main) {
  await homebrew();
}
