(function (config) {
  if (document.getElementById("chatContainer")) return;

  let chatStyle = document.createElement("link");
  chatStyle.rel = "stylesheet";
  chatStyle.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
  document.head.appendChild(chatStyle);

  let chatContainer = document.createElement("div");
  chatContainer.id = "chatContainer";
  document.body.appendChild(chatContainer);

  let customStyle = document.createElement("style");
  customStyle.innerHTML = `
    :root {
      --chat--color-primary: #371787;
      --chat--color-primary-shade-50: #371787;
      --chat--color-primary-shade-100: #371787;
      --chat--color-secondary: #23485d;
      --chat--color-secondary-shade-50: #1ca08a;
      --chat--color-white: #ffffff;
      --chat--color-light: #f2f4f8;
      --chat--color-light-shade-50: #e6e9f1;
      --chat--color-light-shade-100: #c2c5cc;
      --chat--color-medium: #d2d4d9;
      --chat--color-dark: #101330;
      --chat--color-disabled: #777980;
      --chat--color-typing: #404040;
      --chat--color-background: rgb(224, 239, 250);
      --chat--border-radius: 10px;
      --chat--transition-duration: 0.15s;
      --chat--spacing--bottom: 1rem;
      --chat--window--width: 400px;
      --chat--window--height: 600px;
      --chat--spacing-bottom: 3rem;
      --chat--header-height: auto;
      --chat--header--padding: var(--chat--spacing--bottom);
      --chat--header--background: var(--chat--color-dark);
      --chat--header--color: var(--chat--color-light);
      --chat--header--border-top: none;
      --chat--header--border-bottom: none;
      --chat--header--color: var(--chat--color-light);
      --chat--subtitle--font-size: inherit;
      --chat--subtitle--line-height: 1.8;
      --chat--textarea--height: 50px;
      --chat--message--font-size: 0.7rem;
      --chat--message--padding: var(--chat--spacing--bottom);
      --chat--message--border-radius: var(--chat--border-radius);
      --chat--message-line-height: 1.8;
      --chat--message--bot--background: var(--chat--color-background);
      --chat--message--bot--color: var(--chat--color-dark);
      --chat--message--bot--border: none;
      --chat--message--user--background: var(--chat--color-secondary);
      --chat--message--user--color: var(--chat--color-white);
      --chat--message--user--border: none;
      --chat--message--pre--background: rgba(0, 0, 0, 0.05);
      --chat--toggle--background: var(--chat--color-primary);
      --chat--toggle--hover--background: var(--chat--color-primary-shade-50);
      --chat--toggle--active--background: var(--chat--color-primary-shade-100);
      --chat--toggle--color: var(--chat--color-white);
      --chat--toggle--size: 64px;
    }
    .chat-window-wrapper {
      bottom: 2.6rem;
    }
    #chatContainer .chat-heading {
      font-size: 9px;
      color: white;
      letter-spacing: 1.5px;
      font-weight: bold;
      padding-right: 190px;
      padding-top: 10px;
    }
    #chatContainer .chat-heading::before {
      content: "🤖";
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background-color: #fff;
      font-size: 35px;
      border-radius: 50%;
    }
    #chatContainer .chat-message {
      width: fit-content;
    }
    #chatContainer .chat-input {
      display: flex;
      align-items: center;
      padding: 0 10px;
      background: var(--chat--color-light);
      border-radius: var(--chat--border-radius);
    }
    #chatContainer .chat-input textarea {
      flex-grow: 1;
      border: none;
      background: transparent;
      resize: none;
      outline: none;
      font-size: 0.9rem;
      padding: 10px 0;
    }
    #chatContainer .chat-input button {
      background: none;
      border: none;
      cursor: pointer;
    }
    #chatContainer .chat-input button[type="submit"] {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0 10px;
    }
    #chatContainer .chat-toggle {
      background-color: var(--chat--toggle--background);
    }
    #chatContainer .chat-toggle:hover {
      background-color: var(--chat--toggle--hover--background);
    }
    #chatContainer .chat-toggle:active {
      background-color: var(--chat--toggle--active--background);
    }
    #voiceBtn {
      cursor: pointer;
      border: none;
      background: none;
      font-size: 22px;
      margin-right: 10px;
      padding: 0;
    }
    .recording {
      color: red !important;
    }
  `;
  document.head.appendChild(customStyle);

  let chatScript = document.createElement("script");
  chatScript.type = "module";
  chatScript.src = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

  chatScript.onload = function () {
    import("https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js").then(({ createChat }) => {
      createChat({
        mode: "window",
        target: "#chatContainer",
        webhookUrl: config.webhookUrl,
        showWelcomeScreen: false,
        loadPreviousSession: false,
        allowFileUploads: false,
        metadata: {
          phoneNumbers: config.phoneNumbers,
          tokens: config.tokens,
          emailAdmin: config.emailAdmin,
          merchantId: config.merchantId,
          secretKey: config.secretKey,
          merchantKey: config.merchantKey,
          userId: config.userId,
          platform: config.platform,
        },
        i18n: {
          en: {
            title: "MembeeBot",
            subtitle: "",
            inputPlaceholder: "Nhập câu hỏi...",
          },
        },
        initialMessages: [config.welcomeBot, config.messageBot],
      });

      const addVoiceButton = setInterval(() => {
        const chatInput = document.querySelector('#chatContainer .chat-input');
        if (chatInput && !document.getElementById('voiceBtn')) {
          clearInterval(addVoiceButton);
          const voiceBtn = document.createElement('button');
          voiceBtn.id = 'voiceBtn';
          voiceBtn.innerHTML = '🎤';
          chatInput.prepend(voiceBtn);

          let recognition;
          let recognizing = false;

          voiceBtn.onclick = () => {
            if (!('webkitSpeechRecognition' in window)) {
              alert('Trình duyệt không hỗ trợ nhận dạng giọng nói. Hãy sử dụng Chrome.');
              return;
            }

            if (!recognition) {
              recognition = new webkitSpeechRecognition();
              recognition.lang = 'vi-VN';
              recognition.interimResults = false;
              recognition.continuous = false;

              recognition.onstart = () => {
                recognizing = true;
                voiceBtn.classList.add("recording");
              };

              recognition.onend = () => {
                recognizing = false;
                voiceBtn.classList.remove("recording");
              };

              recognition.onerror = (event) => {
                console.error(event);
                recognizing = false;
                voiceBtn.classList.remove("recording");
              };

              recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                const textarea = document.querySelector('#chatContainer .chat-input textarea');
                textarea.value = speechResult;

                const sendBtn = document.querySelector('#chatContainer .chat-input button[type="submit"]');
                if (sendBtn) {
                  sendBtn.click();
                }
              };
            }

            if (recognizing) {
              recognition.stop();
            } else {
              recognition.start();
            }
          };
        }
      }, 500);
    });
  };

  document.body.appendChild(chatScript);
})({
  title: "",
  subtitle: "",
  webhookUrl: "",
  welcomeBot: "Bắt đầu trò chuyện cùng Membee. Chatbot hỗ trợ 24/7.",
  messageBot: "",
  phoneNumbers: "",
  tokens: "",
  emailAdmin: "",
  merchantId: "",
  secretKey: "",
  merchantKey: "",
  userId: "",
  platform: "",
});