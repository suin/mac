import consola from "consola";
import $ from "dax-sh";

type Category = { readonly text: string };
type Action = {
  readonly category: Category;
  readonly group?: string | undefined;
  readonly text: string;
  readonly id: number;
};

const categories = {
  launchpad_dock: {
    text: "Launchpad & Dock",
  },
  mission_control: {
    text: "Mission Control",
  },
  windows: {
    text: "Windows",
  },
  input_sources: {
    text: "Input Sources",
  },
  screenshots: {
    text: "Screenshots",
  },
  spotlight: {
    text: "Spotlight",
  },
} as const satisfies Record<string, Category>;

/**
 * Apple shortcut keys
 *
 * References:
 * - https://github.com/andyjakubowski/dotfiles/blob/main/AppleSymbolicHotKeys%20Mappings
 */
const actions = {
  // Launchpad & Dock
  launchpad_dock$turn_dock_hiding_on_off: {
    category: categories.launchpad_dock,
    text: "Turn Dock hiding on/off",
    id: 52,
  },

  // Mission Control
  mission_control$mission_control$move_left_a_space: {
    category: categories.mission_control,
    group: "Mission Control",
    text: "Move left a space",
    id: 79,
  },
  mission_control$mission_control$move_right_a_space: {
    category: categories.mission_control,
    group: "Mission Control",
    text: "Move right a space",
    id: 81,
  },

  // Windows
  windows$general$minimize: {
    category: categories.windows,
    group: "General",
    text: "Minimize",
    id: 233,
  },

  // Input Sources
  input_sources$select_previous_input_source: {
    category: categories.input_sources,
    text: "Select the previous input source",
    id: 60,
  },
  input_sources$select_next_source_in_input_menu: {
    category: categories.input_sources,
    text: "Select next source in input menu",
    id: 61,
  },

  // Screenshots
  screenshots$save_picture_of_screen_as_a_file: {
    category: categories.screenshots,
    text: "Save picture of screen as a file",
    id: 28,
  },
  screenshots$copy_picture_of_screen_to_the_clipboard: {
    category: categories.screenshots,
    text: "Copy picture of screen to the clipboard",
    id: 29,
  },
  screenshots$save_picture_of_selected_area_as_a_file: {
    category: categories.screenshots,
    text: "Save picture of selected area as a file",
    id: 30,
  },
  screenshots$copy_picture_of_selected_area_to_the_clipboard: {
    category: categories.screenshots,
    text: "Copy picture of selected area to the clipboard",
    id: 31,
  },
  screenshots$screenshot_and_recording_options: {
    category: categories.screenshots,
    text: "Screenshot & recording options",
    id: 184,
  },

  // Spotlight
  spotlight$show_spotlight_search: {
    category: categories.spotlight,
    text: "Show Spotlight search",
    id: 64,
  },
  spotlight$show_finder_search_window: {
    category: categories.spotlight,
    text: "Show Finder search window",
    id: 65,
  },
} as const satisfies Record<string, Action>;

/**
 * ショートカットキーを無効化する関数
 */
async function disableShortcutKey(id: number): Promise<void> {
  // PlistBuddyで3つのコマンドを一度に実行
  // コマンドは左から右へ順番に実行されます
  await $`/usr/libexec/PlistBuddy \
-c "Delete :AppleSymbolicHotKeys:${id}" \
-c "Add :AppleSymbolicHotKeys:${id} dict" \
-c "Add :AppleSymbolicHotKeys:${id}:enabled bool false" \
"$HOME/Library/Preferences/com.apple.symbolichotkeys.plist"`
    .quiet("stderr")
    .noThrow();

  // 各コマンドの役割:
  //
  // 1. "Delete :AppleSymbolicHotKeys:${id}"
  //    指定IDの辞書をまるごと削除します。まだ存在しない場合はエラーになりますが、
  //    .quiet("stderr").noThrow() メソッドによりエラーを無視し、「初期状態で辞書が無い」
  //    ケースも問題なく処理できます。
  //
  // 2. "Add :AppleSymbolicHotKeys:${id} dict"
  //    先ほど削除した（または元々存在しなかった）場所に空の辞書を新規作成します。
  //    これにより :AppleSymbolicHotKeys:<id> というキーが必ず存在する状態になります。
  //
  // 3. "Add :AppleSymbolicHotKeys:${id}:enabled bool false"
  //    新しく作った辞書に enabled = false を設定します。false にすることで
  //    macOSは該当ショートカットを無視するようになります。値を true に戻すか
  //    エントリごと削除することで再度有効化できます。
}

export default async function keyboardShortcutKeys(): Promise<void> {
  consola.info("キーボードショートカットを設定しています...");

  // 無効化するショートカットキーのリスト
  const disablings = [
    // Launchpad & Dock
    actions.launchpad_dock$turn_dock_hiding_on_off,

    // Mission Control
    actions.mission_control$mission_control$move_left_a_space,
    actions.mission_control$mission_control$move_right_a_space,

    // Windows
    actions.windows$general$minimize,

    // Input Sources
    actions.input_sources$select_previous_input_source,
    actions.input_sources$select_next_source_in_input_menu,

    // Screenshots
    actions.screenshots$save_picture_of_screen_as_a_file,
    actions.screenshots$copy_picture_of_screen_to_the_clipboard,
    actions.screenshots$save_picture_of_selected_area_as_a_file,
    actions.screenshots$copy_picture_of_selected_area_to_the_clipboard,
    actions.screenshots$screenshot_and_recording_options,

    // Spotlight
    actions.spotlight$show_spotlight_search,
    actions.spotlight$show_finder_search_window,
  ];

  // ショートカットキーを無効化
  for (const action of disablings) {
    const text = (action as Action).group
      ? `${(action as Action).group} › ${action.text}`
      : action.text;
    consola.info(
      `「${action.category.text}」の「${text}」(ID: ${action.id})を無効化しています...`,
    );
    await disableShortcutKey(action.id);
  }

  consola.success("キーボードショートカットの設定が完了しました。");
  consola.warn(
    "設定を完全に反映するにはmacOSの再起動が必要です。ログアウトだけでは反映されない場合があります。",
  );
}

if (import.meta.path === Bun.main) {
  $.setPrintCommand(true);
  await keyboardShortcutKeys();
}
