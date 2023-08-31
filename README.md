# 住活FLEX Backend

## 開発環境

- Node.js < v18

事前にFirebaseのアカウント及びプロジェクトのアクセス権限が必要です。

## セットアップ

```bash
npm install -g firebase-tools
firebase login
cd functions
npm install
npm run serve # firebase emulators:start --only functions
```

## トラブルシューティング

### `firebase init`　などでエラーとなる

```bash
firebase logout
firebase login
```