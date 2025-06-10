const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORSをインポート

const app = express();

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★ CORS設定：自分のNetlifyのURLからのアクセスを許可する ★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
app.use(cors({
  origin: 'https://cute-biscochitos-74ce5c.netlify.app' 
}));

app.use(bodyParser.json());

// VAPIDキーを設定（これは前に生成したみっちゃんのキーのまま）
const vapidKeys = {
  publicKey: 'BMdUb5H41hCEHAOQiYxcH2bvvNJdmkIrtldYwNtVcjs7mQGkZpHhzfh-9sqioPB_nDbFt4ICIWsjiaz71B1JO48',
  privateKey: 'j74GjYnqXuL4QAAB-Vd7xKo5Q_aIAsHJXFtbMHzQdbg'
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptionStorage;

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptionStorage = subscription; 
  console.log('購読情報を受け取りました:', subscription);
  res.status(201).json({ message: '購読成功' });

  const payload = JSON.stringify({
    title: 'サーバーからのテスト通知！',
    body: 'Renderサーバーの準備ができました！'
  });
  webpush.sendNotification(subscription, payload)
    .catch(error => console.error('テスト通知の送信エラー:', error));
});

// ★★★★★★★★★★★★★★★★★★★★★★
// ★ ポート設定をRender仕様に変更 ★
// ★★★★★★★★★★★★★★★★★★★★★★
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました`);
});