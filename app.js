const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
  console.log('새로운 사용자가 연결되었습니다.');

  const identifier = Math.random().toString(36).substring(7); // 식별 코드 생성

  socket.on('chat message', (data) => {
    const { name, message } = data;
    console.log('받은 메시지:', name, message);
    const chatMessage = { name, message, identifier };
    io.emit('chat message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log('사용자가 연결을 해제했습니다.');
  });
});

const port = 3000;
http.listen(port, () => {
  const serverURL = `http://localhost:${port}`;
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
  console.log(`채팅창에 접속하려면 다음 링크를 Ctrl + 클릭!: ${serverURL}`);
});
