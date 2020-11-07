"use strict";
exports.__esModule = true;
var TelegramBot = require("node-telegram-bot-api");
var token = "1227389072:AAF-q2RAW3Olys91OU9s43wCtNhO2d7I2D4";
var bot = new TelegramBot(token, { polling: true });
var TURNI = ["Mattina", "Notte", "Pomeriggio"];
var TIMES = ["06:00 - 14.00", "22:00 - 06:00", "14:00 - 22:00"];
var deadline = new Date();
var todayTurn = undefined;
var isSet = false;
bot.onText(/\/routine/, function (msg, match) {
    var chatId = msg.chat.id;
    var random = Math.floor(Math.random() * 12);
    bot.sendPhoto(chatId, "./monkes/" + random + ".jpg", {
        caption: "<b>I turni dell'operatore Lilo sono:</b>\n\u2022 " + TURNI[0] + ": <code>[" + TIMES[0] + "]</code>\n\u2022 " + TURNI[1] + ": - <code>[" + TIMES[1] + "]</code>\n\u2022 " + TURNI[2] + ": - <code>[" + TIMES[2] + "]</code>",
        parse_mode: "HTML"
    });
});
bot.onText(/\/setTurno ((m|M)attina|(p|P)omeriggio|(n|N)otte)/, function (msg, match) {
    var chatId = msg.chat.id;
    todayTurn = match[1].toLowerCase();
    todayTurn = todayTurn.charAt(0).toUpperCase() + todayTurn.slice(1);
    var now = new Date();
    // Search until next monday...
    for (var i = 7; i > 0; i--) {
        deadline.setDate(now.getDate() + i);
        if (deadline.getDay() == 1)
            break;
    }
    deadline.setHours(0, 0, 1);
    var d = deadline.getDate();
    var dd = '';
    var m = deadline.getMonth() + 1;
    var mm = '';
    var yyyy = deadline.getFullYear();
    (d < 10) ? dd = '0' + d : dd = d.toFixed();
    (m < 10) ? mm = '0' + m : mm = m.toFixed();
    bot.sendMessage(chatId, "<b>Turno impostato:</b> <i>" + todayTurn + "</i>\n\n<b>Questo turno durer\u00E0 fino:  </b><code>" + dd + "/" + mm + "/" + yyyy + " " + deadline.toLocaleTimeString() + "</code>", {
        parse_mode: "HTML"
    });
    isSet = true;
});
bot.onText(/\/turno/, function (msg, match) {
    var chatId = msg.chat.id;
    if (!isSet) {
        bot.sendMessage(chatId, "Il turno non è stato ancora impostato. Usare il comando <code>/setTurno [Mattina | Pomeriggio | Notte]</code>.", {
            parse_mode: "HTML"
        });
        return;
    }
    var turnTime = TIMES[TURNI.indexOf(todayTurn)];
    // Se il countdown è arrivato a 0
    if (isFinished())
        // Metti il turno successivo
        nextTurn();
    var random = Math.floor(Math.random() * 12);
    bot.sendPhoto(chatId, "./monkes/" + random + ".jpg", {
        caption: "Il turno di oggi dell'operatore Lilo \u00E8:  <code>" + todayTurn + " (" + turnTime + ")</code>",
        parse_mode: "HTML"
    });
});
bot.onText(/\/prossimoTurno/, function (msg, match) {
    var chatId = msg.chat.id;
    var random = Math.floor(Math.random() * 12);
    if (!isSet) {
        bot.sendMessage(chatId, "Il turno non è stato ancora impostato. Usare il comando <code>/setTurno [Mattina | Pomeriggio | Notte]</code>.", {
            parse_mode: "HTML"
        });
        return;
    }
    var prossimoTurno = '';
    if (TURNI.indexOf(todayTurn) + 1 > 2)
        prossimoTurno = TURNI[0];
    else
        prossimoTurno = TURNI[TURNI.indexOf(todayTurn) + 1];
    bot.sendPhoto(chatId, "./monkes/" + random + ".jpg", {
        caption: "<b>Il prossimo turno sar\u00E0 di:</b>  <code>" + prossimoTurno + "</code>",
        parse_mode: "HTML"
    });
});
function isFinished() {
    var now = new Date().getTime();
    var countDownDate = deadline.getTime();
    var distance = countDownDate - now;
    if (distance < 0)
        return true;
    else
        return false;
}
function nextTurn() {
    var i = TURNI.indexOf(todayTurn);
    if (i == 2) {
        todayTurn = TURNI[0];
        return;
    }
    todayTurn = TURNI[i++];
}
