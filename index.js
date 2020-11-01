const shelljs = require('shelljs');
const Discord = require('discord.js');
const client = new Discord.Client();
const secretPath = './shh';

let myDiscordID = null;

const hotKeys = {
    '#play': () => {}, 
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

    if (isBot(msg.author.id)) {
        return;
    }

    if (parsedHotKey.command !== null) {
        msg.reply(parsedHotKey.command);
    }
});

client.login(token);

