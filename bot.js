const ytdl = require('discord-ytdl-core');

class DiscordBot {
  constructor() {
    this.connection = null;
    this.dispatcher = null;
    this.id = null;
    this.volume = 0.1;

    return this;
  }

  async leaveChannel() {
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

  isYoutubeLink(url) {
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

  async play(msgObject, args) {
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

    const volume = this.volume !== null ? this.volume : 0.5;

    this.dispatcher.setVolume(volume);
  }

  setID (id) {
    this.id = id;

    return this;
  }

  isMe (id) {
    return this.id === id;
  }

  printSettings () {
    console.log(`\tBot id: "${this.id}"\n\tvolume: ${this.volume}`);
  }
}

module.exports = DiscordBot;