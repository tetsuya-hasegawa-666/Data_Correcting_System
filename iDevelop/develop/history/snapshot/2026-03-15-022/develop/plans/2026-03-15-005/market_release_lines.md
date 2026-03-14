# Market Release Line Plan

## Purpose

この plan set は、`iDevelop` を generic read-only dashboard から、ユーザーが文書・データ・コードを材料として Codex に相談できる consultation workspace へ進化させるための execution-oriented release line である。

## Planning Rules

- 変更対象は `iDevelop/` 配下だけに限定する
- MVC を崩さない
- BDD を先に定義し、TDD で slice を進める
- must scope は `document` と `data`
- `code` は phase gate を維持しつつ consultation material として扱う
- write/apply は consultation contract と approval state が固まるまで safety-first で進める
- 各 market release line の成果物には、その時点の機能に対応した `docs/process/UX_check_work_flow.md` 更新を含める
- plan set / release line / micro release は、ユーザー指示がない限り連番を維持する
- active な market release line に入ったら、user block または 6 時間上限に達しない限り、その line の exit criteria を満たすまで継続する

## Market Release Lines

| ID | Name | Delivered Value | Status |
|---|---|---|---|
| MRL-10 | Interaction Contract Line | consultation session、input bundle、response contract、approval state を定義する | completed |
| MRL-11 | Document Consultation Line | 文書を選んで Codex に相談し、根拠付き応答を受け取れる | completed |
| MRL-12 | Data Consultation Line | データを選んで Codex に相談し、要約・確認ポイント・次 action を得られる | active |
| MRL-13 | Shared Conversation Shell Line | document/data を横断する共通 conversation shell を提供する | planned |
| MRL-14 | Code Consultation Phase-Gate Line | code を consultation material として read-only 参照できる | planned |
| MRL-15 | Proposal-To-Action Line | Codex 提案を keep / discard / task 化できる | planned |
| MRL-16 | Safe Apply Line | user approval 付きの限定 apply flow を document/data に導入する | planned |
| MRL-17 | Pilot Interaction Line | 選ぶ -> 相談する -> 判断する -> 記録する の end-to-end UX を閉じる | planned |

## Exit View

- `MRL-17` 完了時に、`iDevelop` は consultation workspace として pilot 可能である
- write/apply は approval と evidence を前提に限定的に扱う
- 次 plan set は export / multi-user / deeper automation のいずれかに進む

## Current Recommendation

- active line は `MRL-12` である。
- `mRL-12-1` を green にしたら、そのまま `mRL-12-2`、`mRL-12-3` へ進み、同一 session で `MRL-12` を閉じることを優先する。
- 停止は user block、追加データ待ち、承認待ち、または 6 時間上限到達時に限定する。
