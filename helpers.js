module.exports = {
  // parseHotKey will look for a hotkey and break down any arguments after it
  // returns object with properties command and arguments
  parseHotKey (hotKeys) {
    if (!hotKeys || hotKeys && Object.keys(hotKeys).length < 1) {
      console.log('hotkeys are required!');

      return;
    }

    return (msg) => {
      if (!msg || typeof msg !== 'string') {
        return;
      }

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
  }
};