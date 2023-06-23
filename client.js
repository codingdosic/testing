const socket = io();

const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const emojiButton = document.getElementById('emoji-button');
const emojiPanel = document.getElementById('emoji-panel');


// 사용자 이름 입력
const userName = prompt('사용자 이름을 입력하세요:');
nameInput.value = userName;

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

emojiButton.addEventListener('click', () => {
  emojiPanel.classList.toggle('show');
});

const emojiList = document.querySelectorAll('.emoji');
emojiList.forEach((emoji) => {
  emoji.addEventListener('click', () => {
    const emojiCode = emoji.dataset.code;
    messageInput.value += emojiCode;
    messageInput.focus();
  });
});


function sendMessage() {
  const name = nameInput.value.trim();
  let message = messageInput.value.trim();

  // 이모티콘 코드 변환
  message = message.replace(/:\)/g, '😊');
  message = message.replace(/:\(/g, '😢');
  // 추가적인 이모티콘 코드 변환 작업을 여기에 추가할 수 있습니다.

  if (name !== '' && message !== '') {
    const data = { name, message };
    socket.emit('chat message', data);

    messageInput.value = '';
  }
}

socket.on('chat message', (data) => {
  data.timestamp = new Date().getTime(); // 현재 시간을 타임스탬프로 설정
  displayMessage(data);
});

function displayMessage(data) {
  const { name, message, timestamp } = data;

  const messageElement = document.createElement('div');
  messageElement.className = 'chat-message';

  const nameElement = document.createElement('span');
  nameElement.className = 'chat-name';
  nameElement.textContent = name;

  const contentElement = document.createElement('span');
  contentElement.className = 'chat-message-content';
  contentElement.textContent = message;

  const timeElement = document.createElement('span');
  timeElement.className = 'chat-message-time';
  timeElement.textContent = formatTime(timestamp);

  const contentWrapperElement = document.createElement('div');
  contentWrapperElement.className = 'chat-message-content-wrapper';
  contentWrapperElement.appendChild(timeElement);
  contentWrapperElement.appendChild(contentElement);

  if (name === nameInput.value.trim()) {
    messageElement.classList.add('self');
    messageElement.appendChild(nameElement);
    messageElement.appendChild(contentWrapperElement);
  } else {
    messageElement.classList.add('other');
    messageElement.appendChild(nameElement);
    contentWrapperElement.removeChild(timeElement);
    contentWrapperElement.appendChild(timeElement);
    messageElement.appendChild(contentWrapperElement);
  }

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chat-container');

  const adjustChatContainerSize = () => {
    chatContainer.style.height = window.innerHeight + 'px';
  };

  adjustChatContainerSize(); // 페이지 로드 시 초기 크기 조정

  window.addEventListener('resize', adjustChatContainerSize); // 창 크기 조정 시 크기 조정
});

chatMessages.addEventListener('wheel', (event) => {
  event.preventDefault();
  chatMessages.scrollTop += event.deltaY;
});

function formatTime(timestamp) {
  const messageDate = new Date(timestamp);

  const hours = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  const period = hours >= 12 ? '오후' : '오전';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${period} ${formattedHours}:${formattedMinutes}`;

  return formattedTime;
}
