# 要件定義書（MVP→スケール）

## 目的

「不良在庫の一番くじ」と「それを今すぐ欲しい人」を、位置情報と在庫データで最短接続する。  
在庫は罪ではない。情報の孤独だ。

## 1. プロダクトビジョン & 成功指標

**ビジョン**：全国の「眠るくじ」を“秒で見つかる資産”に変える。

**主要KPI（MVP）**

1. 掲載店舗数（週次）
2. 在庫登録点数（週次）
3. マッチング成立率＝予約/問合せ ÷ 在庫閲覧
4. ノーショー率（来店/発送不履行）
5. 在庫滞留日数の短縮（Before→After）

## 2. ペルソナ（2面市場）

- **店舗側**：ホビー/コンビニ/書店等。棚が圧迫、回転率を上げたい。写真撮影ならできる、複雑な操作はイヤ。
- **ユーザー側**：推し景品のA賞/ラストワン狙い。遠征も辞さず。ただし確実性（取り置き/発送）が命。

## 3. 価値仮説（メリット/デメリット）

- **店舗メリット**：無料集客、在庫現金化、棚スペース回復。
- **店舗デメリット**：撮影/登録の手間、ノーショーリスク。→超簡単登録＋予約デポジットで緩和。
- **ユーザーメリット**：欲しい景品を最短発見、取り置き/発送の確実性。
- **ユーザーデメリット**：送料・移動コスト。→距離×価格×在庫希少度の提示で意思決定支援。

## 4. コア体験（ユーザーストーリー & 受入条件）

### U1：欲しい景品のアラート

- 条件：タイトル名/賞種/距離/価格上限を登録すると、在庫が出た瞬間にプッシュ通知。
- 受入：通知到達 < 1分、在庫詳細画面へ1タップ。

### U2：在庫一覧→予約

- 条件：近い順・安い順・希少順の並び替え。写真3枚/賞種タグ/残数/取り置き可否を表示。
- 受入：3秒以内にリスト表示、予約フロー3画面以内（選択→支払/デポ→完了）。

### S1：店舗の“爆速”在庫登録

- 条件：タイトル選択（サジェスト）→賞種&残数→写真→受け渡し方法（来店/発送/どちらも）→公開。
- 受入：登録開始から公開まで90秒以内、必須項目未入力はガード。

### S2：予約管理

- 条件：○時間取り置き、デポジット徴収、期限切れ自動解放。
- 受入：状態が「公開・予約中・受渡完了・期限切れ」に正しく遷移、ノーショー時はワンタップで復活公開。

## 5. 機能要件（MVP→拡張）

### MUST（MVP）

- 位置情報検索（半径/都道府県）
- タイトル/賞種検索、在庫カード（写真・残数・価格/条件）
- 取り置き予約（有効期限・デポジット）
- 店舗ダッシュボード（在庫登録・予約一覧・チャット）
- プッシュ通知（新規在庫/予約状態）
- 通報/ブロック、基本レビュー（星＋コメント）

### SHOULD（次）

- 発送対応（送料テンプレ、伝票番号入力）
- ウィッシュリストの自動マッチング
- 在庫一括CSV/写真まとめ登録
- プロモーション枠（上位表示）

### LATER

- 公式API/提携、POS連携、価格推奨AI、需要予測、在庫自動撮影認識（OCR/画像分類）

## 6. 非機能要件

- パフォーマンス：主要クエリ P95 < 500ms、画像はCDN
- 可用性：99.5%（MVP）
- セキュリティ：JWT、行レベルセキュリティ、決済は外部（Stripe）
- 監査：在庫変更/予約ログを保持 90日+

## 7. マッチング仕様（初期アルゴリズム）

スコア = w1 * 距離スコア + w2 * 希少度 + w3 * 価格スコア + w4 * 在庫鮮度 + w5 * レビュー

- 距離スコア：0–1（近いほど高）
- 希少度：A賞・ラストワン > 下位賞、残数が少ないほど高
- 価格スコア：設定上限以下で線形↑
- 鮮度：登録からの経過時間が短いほど高
- レビュー：店舗星平均（閾値以下は減点）

※ 重みは A/B テストで学習。初期値は w1 = 0.35, w2 = 0.25, w3 = 0.2, w4 = 0.15, w5 = 0.05。

## 8. データモデル（ER 概要）

- `users(id, role[user|store|admin], name, phone, geo_point, push_token, …)`
- `stores(id, owner_user_id, name, address, geo_point, verified, shipping_supported, …)`
- `titles(id, name, series, release_date, official_code)`
- `prizes(id, title_id, grade[A…], label, msrp)`
- `inventories(id, store_id, prize_id, qty, price, photos[], status[public|reserved|sold], hold_policy{hours})`
- `wishlists(id, user_id, prize_id, radius_km, price_cap)`
- `reservations(id, inventory_id, user_id, status[pending|paid|picked|expired|noshow], expires_at, deposit_amount, handover[visit|ship], tracking_no)`
- `messages(id, reservation_id, sender_id, body, created_at)`
- `reviews(id, target_store_id, user_id, stars, comment)`
- `reports(id, target_type, target_id, reason, status)`

地理検索は PostGIS（Supabase）で ST_DWithin。画像は Supabase Storage or S3。

## 9. API 設計（REST）

- `POST /auth/signup | /auth/login`
- `GET /titles?query=`
- `GET /prizes?title_id=`
- `GET /inventories?lat&lng&radius&title_id&prize_grade&sort=`
- `POST /stores/{id}/inventories`（店舗）
- `POST /reservations`
- `PATCH /reservations/{id}`（confirm/cancel/pickup/noshow）
- `POST /reports`
- `POST /reviews`
- `GET /me/notifications`（既読管理）

## 10. 画面一覧（要素のみ）

- **ユーザー**：ホーム（近場在庫）、詳細、予約フロー、ウィッシュ、通知、マイページ
- **店舗**：在庫リスト、在庫登録（カメラ→自動タイトル推定の補助）、予約一覧、チャット
- **管理**：通報・レビュー・店舗承認

## 11. 予約・決済・ノーショー対策

- デポジット（¥300–¥1000可変）→来店時値引き/発送時相殺。未履行は店舗へ一定率分配。
- 予約期限：デフォ 24h（店舗設定可）。期限切れ自動解放。
- ノーショーフラグが閾値超で一時的に予約前支払のみへ移行。
- 店舗は「写真＋手書きメモ（日時/残数）」で掲載信頼スコアを上げる。

## 12. 法務・運用留意

- 「一番くじ」は登録商標。アプリ名は汎称（例：KujiLink/KujiMatch）、表記は“対応タイトル”とする。
- 公式サイトや小売サイトのスクレイピングは TOS/robots 準拠。MVP は店舗自己申告＋写真を主軸。
- 古物営業・転売規制の確認（発送を店舗起点に限定、個人間売買は非対応から開始）。

## 13. 立ち上げ戦略（鶏卵割り）

- 供給先行：在庫が出やすいエリア（例：東海→静岡・愛知）に特化、店舗を手厚くオンボード。
- テンプレ撮影キット（台紙 A4・撮影例）＋初回掲載で上位表示。
- 需要側はアラート機能でコミュニティ流入（X/Discord）。
- 週次で「完売ストーリー」を SNS に回し社会的証明。

## 14. 収益化（MVP は無料→段階課金）

- 予約デポ事務手数料（数％）
- 店舗プレミアム（上位表示・一括登録・スタッフ複数権限）
- プロモ投稿（地域ヘッダー固定）
- 将来：データ洞察（仕入れ最適化レポート）

## 15. 技術スタック

- フロント：Next.js（React）+ TypeScript、Expo（後で RN アプリ化）
- 認証：Supabase Auth（OTP/SMS）
- DB：Supabase（Postgres + PostGIS）+ Prisma
- ストレージ/CDN：Supabase Storage
- 決済：Stripe（PaymentIntent + デポ）
- 通知：Expo Push / OneSignal
- デプロイ：Vercel（API Routes）
- 監視：Sentry, Logflare（SQL 監視）

## 16. 開発計画（4 スプリント / 4–6 週）

1. S1：認証・店舗在庫登録・一覧検索（地理）
2. S2：詳細/予約/デポジット/通知
3. S3：ダッシュボード・通報/レビュー・ノーショー制御
4. S4：UI 磨き・負荷試験・β 公開（静岡/愛知 50 店舗目標）

## 17. Codex 用プロンプト

1. **Prisma スキーマ生成**
   - 「Prisma で Postgres 用 schema を書いて。entities: users, stores, titles, prizes, inventories, wishlists, reservations, messages, reviews, reports。users は role(enum)、geo は PostGIS の geometry(Point,4326) は別カラム lat,lng で。RLS 前提の簡易モデルで。」
2. **地理検索 API（Next.js / api/inventories/search）**
   - 「Next.js API Route で GET /api/inventories/search を実装。params: lat,lng,radius_km,title_id,grade,sort。Prisma で距離計算は earth_distance(ll_to_earth(...)) 拡張を使わず、単純ハバースイン近似で ORDER。P95 < 500ms を目標に LIMIT 50。」
3. **予約フロー**
   - 「POST /api/reservations で Stripe PaymentIntent（deposit）を作成、expires_at を設定、在庫を reserved へ原子的更新（トランザクション）。Webhooks で paid→reserved 確定、expired→public へ戻すハンドラを実装。」
4. **画像アップロード**
   - 「Supabase Storage に署名付 URL を発行し、フロントから直アップ。3 枚まで、1 枚 2MB まで、webp へ変換（フロントで）」
5. **通知**
   - 「在庫作成時、該当ウィッシュリストを半径＆価格で絞り、対象ユーザーの push_token に Expo Push を送る関数 notifyWishlistHit() を実装。」

## 18. 受入テスト（抜粋）

- 在庫登録 90 秒チャレンジ：新規店舗アカウントで、タイトル検索→賞種入力→写真→公開まで 90 秒以内。
- マッチ通知：指定タイトルのウィッシュを登録し、在庫公開から 60 秒以内に端末へ通知。
- ノーショー：期限超過で自動解放・デポ没収ロジックがログで検証できる。
- RLS：他店舗が他人の在庫を更新できないこと。

## 19. リスクと対策

- 商標/権利：名称の中立化、公式への配慮、画像の出典/撮影ルール。
- 虚偽在庫：店舗認証、写真必須、ユーザー通報→非表示、スコア減点。
- ノーショー：デポ必須・履歴に応じて前払い化。
- 鶏卵問題：地域特化 + 店舗支援キット + 上位表示インセンティブ。
- 個人転売化：MVP は店舗アカウント限定で開始。

