/**
 * ユーザーに確認を求め、Y/yの場合はtrueを返す
 * @param question 確認メッセージ
 * @returns 確認結果（Y/yならtrue）
 */
export async function askConfirmation(question: string): Promise<boolean> {
  process.stdout.write(question);

  for await (const line of console) {
    const answer = line.trim().toLowerCase();
    return answer === "y" || answer === "yes";
  }

  return false;
}
