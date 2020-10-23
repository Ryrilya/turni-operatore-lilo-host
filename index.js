var TelegramBot = require("node-telegram-bot-api");
var token = "1227389072:AAF-q2RAW3Olys91OU9s43wCtNhO2d7I2D4";
var bot = new TelegramBot(token, { polling: true });

const TURNI = ["Mattina", "Notte", "Pomeriggio"];
var deadline = new Date();
var todayTurn = undefined;

bot.onText(/\echo (.+)/, (msg, match) => {
  let chatId = msg.chat.id;
  let echo = match[1];
  bot.sendMessage(chatId, echo);
});

bot.onText(/\/routine/, (msg, match) => {
  let chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `I turni dell'operatore Lilo sono:\n• ${TURNI[0]}\n• ${TURNI[1]}\n• ${TURNI[2]}`
  );
});

bot.onText(
  /\/setTurno ((m|M)attina|(p|P)omeriggio|(n|N)otte)/,
  (msg, match) => {
    let chatId = msg.chat.id;
    todayTurn = match[1].toLowerCase();
    todayTurn = todayTurn.charAt(0).toUpperCase() + todayTurn.slice(1);

    let now = new Date();

    // Search until next monday...
    for (let i = 7; i > 0; i--) {
      deadline.setDate(now.getDate() + i);
      if (deadline.getDay() == 1) break;
    }

    deadline.setHours(0, 0, 1);

    bot.sendMessage(
      chatId,
      `Turno impostato: ${todayTurn}\n\nQuesto turno durerà fino: ${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString()}`
    );
  }
);

bot.onText(/\/turno/, (msg, match) => {
  let chatId = msg.chat.id;

  // Se il countdown è arrivato a 0
  if (isFinished())
    // Metti il turno successivo
    nextTurn();

  bot.sendMessage(
    chatId,
    `Il turno di oggi dell'operatore Lilo è:\t${todayTurn}`
  );
});

bot.onText(/\/prossimoTurno/, (msg, match) => {
  let chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Il prossimo turno sarà di: ${TURNI[TURNI.indexOf(todayTurn) + 1]}`
  );
});

function isFinished() {
  let now = new Date().getTime();
  let countDownDate = deadline.getTime();

  let distance = countDownDate - now;

  if (distance < 0) return true;
  else return false;
}

function nextTurn() {
  let i = TURNI.indexOf(todayTurn);
  if (i == 2) todayTurn = TURNI[0];
  todayTurn = TURNI[i++];
}
