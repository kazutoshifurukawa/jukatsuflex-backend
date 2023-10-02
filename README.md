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

## cURL examples

### getFIrestore

```bash
curl -XGET -d 'documentId=test1' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/getFirestore
```

```json
{"name":"test1","id":"10"}
```

### getFirestoreById

```bash
curl -XGET -d 'collectionId=house&documentId=FvViAl8JuG6pqZrnER50' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/getFirestoreById
```

```json
{"fix_part_id":"1","address":"〒220-0005 神奈川県横浜市西区南幸２丁目１８","name":"横浜市西区建物１"}
```

```bash
curl -XGET -d 'collectionId=partner&documentId=kyWq7mnewVnD3V63pl4R' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/getFirestoreById
```

```json
{"contact_person":"Taro  Suzuki","company_name":"Suzuki company","acceptable_area":["tokyo","saitama","chiba"],"Company_address":"東京都千代田区大手町2丁目6番2号","tel_number":"0312345678"}
```

### saveFirestore

```bash
curl -XGET -d 'id=10&name=test1&documentId=test1' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/saveFirestore
```

返り値は省略。

### estimate

```bash
curl -d 'fixpart=door,floor' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/estimate
```

```json
{"fix_days":6,"price":13,"urls":["https://www.youtube.com/watch?v=BdB2G4iz430","https://www.youtube.com/watch?v=Z6OTBJ2oM-s"]}
```
