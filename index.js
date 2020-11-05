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
    bot.sendPhoto(chatId, "https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/05/Daily-Routine-1.jpg?auto=format&q=60&w=1860&h=1395&fit=crop&crop=faces", {
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
    bot.sendPhoto(chatId, "http://www.azienda-digitale.it/wp-content/uploads/2016/11/tablet-gestione-turni-1980x1485.jpg", {
        caption: "Il turno di oggi dell'operatore Lilo \u00E8:  <code>" + todayTurn + " (" + turnTime + ")</code>",
        parse_mode: "HTML"
    });
});
bot.onText(/\/prossimoTurno/, function (msg, match) {
    var chatId = msg.chat.id;
    if (!isSet) {
        bot.sendMessage(chatId, "Il turno non è stato ancora impostato. Usare il comando <code>/setTurno [Mattina | Pomeriggio | Notte]</code>.", {
            parse_mode: "HTML"
        });
        return;
    }
    bot.sendPhoto(chatId, "https://media.istockphoto.com/vectors/square-grunge-red-next-week-stamp-vector-id1008396864?k=6&m=1008396864&s=170667a&w=0&h=UZczzAIdxACKfe38iokO0ZWm4oOhnZz1TREC5P4ms_0=", {
        caption: "<b>Il prossimo turno sar\u00E0 di:</b>  <code>" + TURNI[TURNI.indexOf(todayTurn) + 1] + "</code>",
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
