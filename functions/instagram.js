const bot = require('./../bot.js');
const instagram = require('./../template/instagram.js');
const request = require('request'); //HTTP Request

module.exports = {
  profile: function (replyToken, text, source) {
    var replyText = bot.replyText;
    var client = bot.client;
    var username = text.replace('ig: ', '').toLowerCase();
    request({
      url: 'https://www.instagram.com/' + username + '/?__a=1',
      method: "GET",
      headers: {
        'Host': 'www.instagram.com',
        'Authorization': process.env.DIALOGFLOW_AUTH,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': 'mid=W2nsvAALAAEMzlX4UYrVFxtsvZj1; mcd=3; fbm_124024574287414=base_domain=.instagram.com; datr=DdV-W2zj3nTxs868S6l2pSWw; shbid=2617; rur=PRN; urlgen="{\"103.233.100.251\": 133357}:1g9S5L:4sdvt32LO60w7pJzdjhqcgwtqsc"; fbsr_124024574287414=v6rBVTx5W3g841_gdfZJamL9CxfQlfWWTEIbVSlTW-A.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUN4NWRXZm8tSWNCeUpidEdPSW1Fci05SjI5VWJZMjhJQm1WVTEtbGFzQ0hwZjl5aWtsamxPdGZJV195ZHFSUU8xbWctNk1YalNhSi1nSk84YnloSVRpNzh0M3B3a1hQWjZoUW5nYVd5RHNxaE1DUGN2c2hrbDVFQWtEb1BkeGR1dmFLeWp4alZsU2wzY1BjNDJ0ZFhiaUVxN3R5NDhOVGNHbFlkQVprZ201Rk95S1NlNmo3QVBIYl9LbU1lcnJfUWdOeUlaa0E3ZFhwRk1sdGpLTGlSMTFyU1kwNjBlZE1kdlpjTWs4cGRFUjRQYUhUZmpiZktMb2pNT0NDbXgwR05jY0xNMFpNUm9LeG43Z3BHUG9RTk96VTBINmRqWWg4TW4zWWx2M0o1RVYxMzhiMFNSVmcyNUdQeVgxakRmbFZCLUthQ05tY2diaERiYTlScW1pUkRlV2l0Ui1ma2hWRHo5YUN4djNGVjd6QUEiLCJpc3N1ZWRfYXQiOjE1Mzg5OTE4NDksInVzZXJfaWQiOiIxMDAwMDA2MzQ4MDkwMDcifQ; csrftoken=TLUmsMmtXiXc9jnoS14POutkpLImhzwu; ds_user_id=856071046; sessionid=IGSC274769dbd581c4a699207358d4827b124759c2cdf65b3502133f639188b7f78a%3AT3EVPaE5lU37aMKNoadrgRsk3roQ3f4Y%3A%7B%22_auth_user_id%22%3A856071046%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%22856071046%3AceXgOAkge8N6HVRbpH3mdLLHlnYsdPv6%3A8715bd66fac17af2f86ae948f8f4778026588ad237c05aa1f8e83e03a2b9c320%22%2C%22last_refreshed%22%3A1538991848.1985414028%7D'
      },
      json: true
    }, function (error, response, body){
      var result = body.graphql.user;
      let foto = result.profile_pic_url_hd;
      let followedBy = result.edge_followed_by.count;
      let following = result.edge_follow.count;
      let postCount = result.edge_owner_to_timeline_media.count;
      let fullName = result.full_name;
      let bio = result.biography;
      let url = result.external_url;
      var flex = instagram.profile(foto, username,followedBy, following, postCount, fullName, bio, url);
      var postingan = result.edge_owner_to_timeline_media.edges;
      var limit = 0;
      var baris = 0;
      var arr = [];
      for (var post in postingan) {
        res = postingan[post].node;
        media = res.display_url;
        box = instagram.post(media);
        if (limit >= 3) {
          line = {"type": "box","layout": "horizontal","margin": "xs"}
          line.contents = arr;
          flex.contents.body.contents.push(line)
          limit = 0;
          arr = [];
          arr.push(box);
          baris++;
        } else {
          arr.push(box);
        }
        limit++;
      }
      if (limit < 3) {
        line = {"type": "box","layout": "horizontal","margin": "xs"}
        line.contents = arr;
        flex.contents.body.contents.push(line);
        for (var i = 0; i < 3-limit; i++) {
          flex.contents.body.contents[5+baris].contents.push({"type":"filler"});
        }
      }
      return client.replyMessage(replyToken, flex);
    });
  },
  download: function (replyToken, res, source) {
    var replyText = bot.replyText;
    var client = bot.client;
    var foto = res.url;
    return client.replyMessage(replyToken, {
      "type": "image",
      "originalContentUrl": foto,
      "previewImageUrl": foto
    });

  }
};
