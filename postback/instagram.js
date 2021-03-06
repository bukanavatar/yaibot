const bot = require('./../bot.js');
const instagram = require('./../functions/instagram.js');

module.exports = {
  response: function (replyToken, res, source) {
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var url = res.url;
    switch (type) {
      case 'photo':
      case 'video':
      return instagram.download(replyToken, type, url, source);
      break;
      case 'page':
      return instagram.pagination(replyToken, res.username, res.page, res.id, url, source);
      break;
      case 'stories':
      return instagram.stories(replyToken, res.id, source);
      break;
      case 'story':
      return instagram.story(replyToken, res.order, res.id, source);
      break;
    }
  }
};
