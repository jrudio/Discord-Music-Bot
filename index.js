const shelljs = require('shelljs');
const Discord = require('discord.js');
const client = new Discord.Client();
const secretPath = './shh';

function readShh (fileName) {
    let secretString = shelljs.cat(fileName);
    return secretString.toString();
}

const token = readShh(secretPath);

client.on('ready' , () => {
    console.log('You are logged in');
});

client.login(token);

