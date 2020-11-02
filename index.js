const shelljs = require('shelljs');
const ytdl = require('discord-ytdl-core');
const Discord = require('discord.js');
const client = new Discord.Client();
const secretPath = './shh';

let myDiscordID = null;

class Bot {
    constructor () {
        this.connection = null;
        this.dispatcher = null;

        return this;
    }
    
    async leaveChannel () {
        if (this.dispatcher) {
            this.dispatcher = null;
        }
        
        this.connection && this.connection.disconnect();
    }

    async joinChannel(msgObject, cb) {
        this.connection = await msgObject.member.voice.channel.join();

        if (cb) {
            cb();
        }
    }

    isYoutubeLink (url) {
        let isYoutube = false;

        const whitelist = [
            'youtube',
            'youtu.be',
        ];
        
        whitelist.forEach((word) => {
            if (url.indexOf(word)) {
                isYoutube = true;
            }
        })

        return isYoutube;
    }

    async play (msgObject, args) {
        let youtubeLink = undefined;

        if (!this.connection) {
            console.log('we are not in a voice channel!');
            return;
        }

        // handle links
        if (this.isYoutubeLink(args[0])) {
            youtubeLink = args[0];
            console.log(`playing youtube link: ${youtubeLink}`);
        } else {
            // handle search query
            console.log('cannot handle youtube search query yet');
            return;
        }

        let stream = ytdl(youtubeLink, {
            filter: 'audioonly',
            opusEncoded: false,
            fmt: 'mp3'
        });
        
        this.dispatcher = this.connection.play(stream, { type: 'unknown' });

        this.dispatcher.on('finish', () => {
            console.log('Finished playing!');

            // this.leaveChannel();
        });
        
        this.dispatcher.setVolume(0.095);
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

            msg = msg.split(' ');
            if (msg.length > 0) {
                msg = msg.splice(1, 1);
                parsedHotKey.arguments = msg;
            }
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
        if (msg.member.voice.channel) {
            // msg.reply(parsedHotKey.command);
            // const cb = () => {

            // };
            bot.joinChannel(msg, () => {
                bot.play(msg, parsedHotKey.arguments);
            });
        } else {
            msg.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);

