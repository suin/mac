import { execSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { chmod, unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Writable } from "node:stream";
import commandExists from "command-exists-promise";
import consola from "consola";

async function download() {
  const response = await fetch("https://releases.jetify.com/devbox");
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }
  if (response.body === null) {
    throw new Error("Response body is null");
  }
  return response.body;
}

function createTempFile() {
  const filePath = path.join(os.tmpdir(), `devbox-${Date.now()}`);
  const writableStream = Writable.toWeb(createWriteStream(filePath));
  return {
    path: filePath,
    writableStream,
    async remove() {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    },
  };
}

async function install(): Promise<void> {
  const temp = createTempFile();
  try {
    const content = await download();
    await content.pipeTo(temp.writableStream);
    await chmod(temp.path, 0o755);
    execSync("sudo mkdir -p /usr/local/bin");
    execSync(`sudo cp ${temp.path} /usr/local/bin/devbox`);
  } finally {
    temp.remove();
  }
}

export default async function devbox(): Promise<void> {
  consola.info("Devboxの設定を確認しています...");
  if (await commandExists("devbox")) {
    consola.info("Devboxは既にインストールされています。");
    return;
  }

  consola.info(
    "Devboxがインストールされていないため、インストールを開始します...",
  );

  await install();
  consola.success("Devboxのインストールが完了しました。");
}

if (import.meta.path === Bun.main) {
  await devbox();
}
