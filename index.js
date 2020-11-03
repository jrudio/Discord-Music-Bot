const shelljs = require('shelljs');
const Discord = require('discord.js');
const Helpers = require('./helpers');
const Bot = require('./bot');

const secretPath = './shh';
const client = new Discord.Client();
const bot = new Bot();

const hotKeys = {
    '#play': bot.play,
    '#skip': () => {},
    '#search': () => {},
    '#queue': () => {},
    '#stop': () => {},
    '#pause': () => {},
    '#current': () => {},
    '#seek': () => {},
};

const parseHotKey = Helpers.parseHotKey(hotKeys);

function readShh (fileName) {
    let secretString = shelljs.cat(fileName);
    return secretString.toString();
}

const token = readShh(secretPath);

if (!token) {
    console.log('ERROR [TOKEN REQUIRED] - A Discord token is required to run this program');
    process.exit(1);
}

client.on('ready' , () => {
    console.log('You are logged in');

    bot.setID(client.user.id);
    bot.printSettings();
});

client.on('message', msg => {
    const parsedHotKey = parseHotKey(msg.content);

    if (!msg.guild || bot.isMe(msg.author.id)) {
        return;
    }

    if (parsedHotKey.command !== null) {
        if (msg.member.voice.channel) {
            bot.joinChannel(msg, () => {
            bot.play(msg, parsedHotKey.arguments);
          });
        } else {
            msg.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);

