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

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require('firebase-functions');

// FIrebaseの初期化
initializeApp();

exports.getHouseById = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // パラメータを取得
  const params = req.body;
  // パラメータからidを取得する
  const id = params.id;
  // idが無ければエラーを返す
  if (id === undefined) {
    res.status(400).send({errorMessaage: 'error 400:document id not found'});
    return
  }
  // 'house'というcollectionの中のidのdocumentを取得する
  const houseRef = getFirestore().collection('house').doc(id);
  // curl -XGET -d 'id=FvViAl8JuG6pqZrnER50' http://127.0.0.1:5001/jukatsu-fcfe6/us-central1/getHouseById
  const doc = await houseRef.get();
  if (!doc.exists) {
    res.status(400).send("error 400:document not found");
    return
  } else {
    res.status(200).send(doc.data());
  }
});

exports.estimate = functions.region('asia-northeast1').https.onRequest(async (req, res)=> {
  // パラメータを取得
  const params = req.body;
  const collRef = getFirestore().collection('fix_part');
  const fixpart = params.fixpart.split(',');

  var fix_days = 0;
  var price = 0;
  var urls = [];

  for( let i = 0 ; i < fixpart.length; i++) {
    const doc = await collRef.doc(fixpart[i]).get();
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
  };

  console.log( fix_days );
  console.log( price );
  console.log( urls );
  res.json({fix_days: fix_days, price: price, urls: urls});

});

exports.est = functions.region('asia-northeast1').https.onRequest(async (req, res)=> {
  // パラメータを取得
  const params = req.body;
//  const collRef = getFirestore().collection('fix_part');
//  const args = params.fixpart.split(',');

  const data =  {
        "fix_part":"999",
        "fix_part_name":"abcdef",
        "urls": "[http://aaaa, http://bbbb]",
        "tools":"[abcdef, ghijk]",
        "estimated_fix_time":"999",
        "estimated_learning_time":"999",
        "price":"999999",
        "skills":"[abcdef, ghijk]",
        "partner_company_name":"abcdef",
        "partner_telnumber":"abcdef"
    };

  // JSON形式のデータに変換する
  json_data = JSON.stringify(data);

  console.log( json_data );
  res.send( json_data )

});

exports.getFirestoreById = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // パラメータを取得
  const params = req.body;
  // パラメータから任意のdocument IDを取得する
  const documentId = params.documentId;
  // パラメータから任意のcollection IDを取得する
  const collectionId = params.collectionId;

  if (documentId && collectionId) {
    // 'test'というcollectionの中の任意のdocumentに格納されているデータを取得する
    const testRef = getFirestore().collection(collectionId);
    const doc = await testRef.doc(documentId).get()
    if (doc.exists) {
      res.status(200).send(doc.data());
    } else {
      res.status(200).send("error 200:document not found");
    }
  } else {
    res.status(400).send({errorMessaage: 'error 400:document id not found'});
  }
});

exports.getFirestore = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // パラメータを取得
  const params = req.body;
  // パラメータから任意のdocument IDを取得する
  const documentId = params.documentId;

  if (documentId) {
    // 'test'というcollectionの中の任意のdocumentに格納されているデータを取得する
    const testRef = getFirestore().collection('test');
    const doc = await testRef.doc(documentId).get()
    if (doc.exists) {
      res.status(200).send(doc.data());
    } else {
      res.status(200).send("error 200:document not found");
    }
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
exports.saveFirestore = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const params = req.body;
  // パラメータのスキーマのチェック
  if (!validateParamsSchema(params)) {
    res.status(400).send({errorMessaage: 'パラメータが不正です'});
  } else {
    const db = getFirestore();
    // 'test'というcollectionがある前提で任意のドキュメントIDのdocumentを生成する
    await db.doc(`test/${params.documentId}`).set({
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

exports.helloWorld = functions.region('asia-northeast1').https.onRequest(async (request, response) => {
  response.send("Hello from Firebase!!!");
});
