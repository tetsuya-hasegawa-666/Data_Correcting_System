# Direction History

- date: 2026-03-14
- scope: documentation system
- trigger: 履歴フォルダ構成が煩雑になり、文書体系履歴と実開発履歴の見通しが悪くなった
- resulting direction: 履歴管理を `docs/history/docs/{summary,snapshot}` と `docs/history/develop/{summary,snapshot}` の 2 系統 4 レイヤへ単純化した。これにより、履歴の意味分類を保ったまま、保存先の探索コストを下げる構造へ寄せた。
- expected benefit: 文書体系履歴と実開発履歴を迷わず辿れ、今後の追加も同じ型で増やしやすくなる。
