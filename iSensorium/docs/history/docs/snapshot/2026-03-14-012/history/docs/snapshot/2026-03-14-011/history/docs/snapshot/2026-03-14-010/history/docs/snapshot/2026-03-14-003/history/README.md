# Documentation Direction History

## Purpose

このディレクトリは、文書体系全体がどの方向へ変化したかを短く残す専用履歴である。
個別ファイル差分の一覧ではなく、変更後の全体傾向を 1 件 1 要約で記録する。

## Recording Rules

- 1 回の文書体系変更につき 1 履歴を作る。
- 履歴は全体スナップショットにしない。
- 履歴は個別差分列挙にしない。
- 変更後に文書体系が何をより強く保証する形へ寄ったかを書く。
- 各履歴は短く保つ。

## File Naming

- `YYYY-MM-DD-XXX.md`
- `XXX` はその変更方向を短く表す英小文字ハイフン区切り
- 対応する全体スナップショットは `docs/snapshots/YYYY-MM-DD-XXX-docs_/` に置く

## Required Template

```md
# Direction History

- date:
- scope:
- trigger:
- resulting direction:
- expected benefit:
```

## Example Meaning

- 役割分離を強めた
- 変更追跡を強めた
- agent 規約化を強めた
- release line 再編耐性を強めた
