/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require("firebase-admin");


// Admin SDKでfireStoreを使う
admin.initializeApp(functions.config().firebase);
// データベースの参照を取得する
const fireStore = admin.firestore();

exports.estimate = onRequest(async (req, res) => {
  // パラメータを取得
  const params = req.body;
  const collRef = fireStore.collection('fix_part');
  const fixpart = params.fixpart.split(',');

  var fix_days = 0;
  var price = 0;
  var urls = [];

  for( let i = 0 ; i < fixpart.length; i++) {
    collRef.doc(fixpart[i]).get().then((doc) => {
      console.log( "loop " + i )
      if (doc.exists) {
          fix_days += Number(doc.get("estimate_fix_time"));
          console.log( doc.get("estimate_fix_time") );
          console.log( fix_days);

          price += doc.get("estimate_price");
          urls.push( doc.get("youtube_URL"));
          console.log( doc.get("youtube_URL") );
      } else {
//        res.status(200).send("error 200:document not found");
          console.log( "data not found");
      }
    });
  };

  console.log( fix_days );
  console.log( price );
  console.log( urls );
  res.json({fix_days: fix_days, price: price, urls: urls}) // fix_days, price, urls[]を返却するコードを書く

});

exports.getFirestore = functions.https.onRequest((req, res) => {
  // パラメータを取得
  const params = req.body;
  // パラメータから任意のdocument IDを取得する
  const documentId = params.documentId;

  if (documentId) {
    // 'test'というcollectionの中の任意のdocumentに格納されているデータを取得する
    const testRef = fireStore.collection('test');
    testRef.doc(documentId).get().then((doc) => {
      if (doc.exists) {
        res.status(200).send(doc.data());
      } else {
        res.status(200).send("error 200:document not found");
      }
    });
  } else {
    res.status(400).send({errorMessaage: 'error 400:document id not found'});
  }
});

// 渡されたパラメータのスキーマをチェックする
const validateParamsSchema = (params) => {
  const hasId = 'id' in params;
  const hasName = 'name' in params;
  const hasDocumentId = 'documentId' in params;

  return hasId && hasName && hasDocumentId;
};

// firestoreに任意のデータを保存する
exports.saveFirestore = functions.https.onRequest((req, res) => {
  const params = req.body;
  // パラメータのスキーマのチェック
  if (!validateParamsSchema(params)) {
    res.status(400).send({errorMessaage: 'パラメータが不正です'});
  } else {
    const db = fireStore;
    // 'test'というcollectionがある前提で任意のドキュメントIDのdocumentを生成する
    db.doc(`test/${params.documentId}`).set({
      id: params.id,
      name: params.name,
    });

    // 非同期的に保存したデータを参照する
    db.collection('test')
        .doc(params.documentId)
        .onSnapshot((doc) => {
	  // 取得したデータをレスポンスとして返す
          res.status(200).send(doc.data());
        });
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!!!");

});
