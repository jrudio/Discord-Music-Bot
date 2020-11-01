const shelljs = require('shelljs');
const Discord = require('discord.js');
const client = new Discord.Client();
const secretPath = './shh';
const dummyPath = 'Mad Caddies - She [Green Day] (Official Audio) (128 kbps).mp3';

let myDiscordID = null;

class Bot {
    constructor () {
        this.connection = null;

        return this;
    }
    
    leaveChannel () {
        this.connection && this.connection.disconnect();
    }

    async play (msgObject, args) {
        if (msgObject.member.voice.channel) {
            const connection = await msgObject.member.voice.channel.join();
            
            const dispatcher = connection.play(dummyPath);

            dispatcher.setVolume(0.5); // half the volume

            dispatcher.on('finish', () => {
                console.log('Finished playing!');

                // this.leaveChannel();
            });

            dispatcher.destroy();
        } else {
            msgObject.reply('You need to join a voice channel first!');
        }
    }
}

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

function readShh (fileName) {
    let secretString = shelljs.cat(fileName);
    return secretString.toString();
}

// parseHotKey will look for a hotkey and break down any arguments after it
// returns object with properties command and arguments
function parseHotKey (msg) {
    let parsedHotKey = {
        command: null,
        arguments: []
    };

    // #play the weekend call out my name
    for (var keyword in hotKeys) {
        if (msg.indexOf(keyword) > -1) {
            parsedHotKey.command = keyword;

            parsedHotKey.arguments = msg.split(' ').splice(0, 1);
        }
    }

    return parsedHotKey;
}

function isBot (userID) {
    return userID === myDiscordID;
}

const token = readShh(secretPath);

client.on('ready' , () => {
    console.log('You are logged in');

    myDiscordID = client.user.id;
});

client.on('message', msg => {
    const parsedHotKey = parseHotKey(msg.content);

    if (!msg.guild || isBot(msg.author.id)) {
        return;
    }

    if (parsedHotKey.command !== null) {
        // msg.reply(parsedHotKey.command);
        bot.play(msg, parsedHotKey.arguments);
    }
});

client.login(token);

