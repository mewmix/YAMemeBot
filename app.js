var Bot = require('node-telegram-bot'),
    request = require('request'),
    fs = require('fs'),
    md5 = require('md5');

var send_message = function(bot, message, text) {
    // sends a text message
    bot.sendMessage({
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
        text: text
    });
}

var send_photo = function(bot, message, file_location) {
    // sends a photo, with the chat action "Sending photo >>>"
    bot.sendChatAction({
        chat_id: message.chat.id,
        action: 'upload_photo'
    });

    bot.sendPhoto({
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
        files: {
            photo: file_location
        }
    }, function (err, msg) {
        console.log("error:", err);
        console.log(msg);
    });
}

var escape_message = function(msg) {
    msg = msg.trim();
    console.log(msg);
    msg = msg.replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\"/g, "''");
    msg = msg.replace(/\_/g, '__').replace(/\-/g, '--').replace(/\ /g, '-');
    return msg;
}

var meme_names = [
    "aag", "afraid", "alwaysonbeat", "ants", "awesome", "awkward", "bad",
    "badchoice", "biw", "blb", "boat", "both", "bs", "buzz", "captain",
    "cbg", "ch", "chosen", "crazypills", "doge", "dsm", "elf", "ermg",
    "fa", "fetch", "fry", "fwp", "ggg", "hipster", "icanhas", "interesting",
    "ive", "iw", "jetpack", "joker", "jw", "keanu", "kermit", "live",
    "ll", "mmm", "mordor", "morpheus", "officespace", "older", "oprah",
    "philosoraptor", "red", "regret", "remembers", "sad", "sarcasticbear",
    "sb", "sf", "ski", "sohappy", "sohot", "ss", "success", "tenguy",
    "toohigh", "tried", "wonka", "xy", "yallgot", "yodawg", "yuno"
];

var bot = new Bot({
    token: process.env.YAMEMEBOT_TOKEN
})
.on('start', function (message) {
    send_message(bot, message, "List of memenames: " + meme_names.join(', ') + '. More details at http://memegen.link/overview');
    send_message(bot, message, "Follow this format: [/meme memename line1, line2] or [/meme memename line2] (comma works as line separator)");
})
.on('help', function (message) {
    send_message(bot, message, "List of memenames: " + meme_names.join(', ') + '. More details at http://memegen.link/overview');
    send_message(bot, message, "Follow this format: [/meme memename line1, line2] or [/meme memename line2] (comma works as line separator)");
})
.on('meme', function (message) {
    console.log(message);

    var message_text = message.text.toLowerCase();

    // if the message starts with /meme command, ignore it
    if (message_text.lastIndexOf('/meme', 0) === 0) {
        message_text = message_text.replace('/meme', '').trim()
    }

    if (!message_text) {
        // if the message was only "/meme"
        return;
    }

    var message_text_parts = message_text.split(' ');

    var keyword = message_text_parts[0],
        message_rest = message_text_parts.splice(1, message_text_parts.length-1).join(' '),
        message_rest_parts = message_rest.split(','),
        upper_line = '_',
        lower_line = '_';

    if (meme_names.indexOf(keyword) == -1) {
        send_message(bot, message, "Don't know that meme, sorry.");
        return;
    }

    if (message_rest_parts.length === 1) {
        lower_line = message_rest_parts[0];
    } else {
        upper_line = escape_message(message_rest_parts[0]);
        lower_line = escape_message(message_rest_parts.splice(1, message_rest_parts.length-1).join(','));
    }

    var meme_url = ["http://memegen.link", keyword, upper_line, lower_line].join("/") + ".jpg";
    console.log(meme_url);

    // generate file name and location
    var hash = md5(meme_url);
    var file_location = './memes/' + hash + '.jpg';

    // If a screenshot already exists for the given url's hash, return it
    if (fs.existsSync(file_location)) {
        send_photo(bot, message, file_location);
        return;
    }

    // fetch meme, save it and return
    request(meme_url).pipe(fs.createWriteStream(file_location)).on('close', function(e) {
        // send_photo(bot, message, file_location);
        send_photo(bot, message, file_location);
    });
})
.start();
