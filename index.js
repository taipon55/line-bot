require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

// 環境変数から読み込み
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

// Webhookのエンドポイント
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// イベント処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  console.log("受信メッセージ:", userMessage);

  // ここでGoogleスプレッドシートに書き込む処理をあとで追加する

  // 返信
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `受け取りました: ${userMessage}`,
  });
}

// ローカルサーバー起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`サーバー起動: http://localhost:${port}`);
});
