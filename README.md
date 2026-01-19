# Grok Discord Bot

XのGrokを模倣したDiscord Bot。Groq APIとRenderを使用して構築。

## 機能

### コマンド
- `/about` - Botについて
- `/cmds` - コマンド一覧

### チャット
- `@grok [テキスト]` - 通常の会話
- `@grok ファクトチェック [テキスト]` - ファクトチェック
- `@grok 要約して [テキスト]` - 要約

### 画像分析
- `@grok [指示]` + 画像添付 - 画像を分析

### コンテキストメニュー
メッセージを右クリック → アプリ
- `Grok: Fact Check` - メッセージをファクトチェック
- `Grok: Summarize` - メッセージを要約

### 返信機能
メッセージに返信して `@grok ファクトチェック` や `@grok 要約して` とすると、そのメッセージを処理します。

## セットアップ

### 1. 環境変数
`.env` ファイルを作成:
```
DISCORD_BOT_TOKEN=your_token_here
GROQ_API_KEY=your_key_here
PORT=3000
```

### 2. Discord Developer Portal
1. https://discord.com/developers/applications にアクセス
2. Botを作成
3. `Bot` タブで `MESSAGE CONTENT INTENT` を **OFF** のまま (現在の設定)
4. Bot TokenをコピーしてDISCORD_BOT_TOKENに設定

### 3. Groq API Key
1. https://console.groq.com にアクセス
2. API Keyを作成
3. GROQ_API_KEYに設定

### 4. ローカル実行
```bash
npm install
npm start
```

### 5. Renderデプロイ
1. GitHubにプッシュ
2. Renderで新規Web Serviceを作成
3. リポジトリを接続
4. 環境変数を設定
5. デプロイ

## 技術スタック
- Node.js
- discord.js v14
- Groq API (llama-3.3-70b-versatile, llama-4-scout-17b-16e-instruct)
- Express
- Render

## トラブルシューティング

### 返信機能が動作しない
- 返信先のメッセージに**テキストが含まれているか**確認してください
- 画像のみ、スタンプのみのメッセージには対応していません

### 画像分析が動作しない
- 画像が正しく添付されているか確認してください
- サポートされている画像形式: PNG, JPG, JPEG, GIF, WebP

### Botが応答しない
- Renderのログを確認してください
- 環境変数が正しく設定されているか確認してください
