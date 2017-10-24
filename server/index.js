var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var fetcher = require('../helpers/apiFetcher.js');

//


var categories = [
  'Mexican',
  'seafood',
  'Meatballs',
];

app.get('/', (req, res) => {
  var dummyData = categories.map(category => {
    return fetcher.fetchAll(category).then(data => {
      return {data: data};
    });
  });

  Promise.all(dummyData)
    .then(data => {
      console.log('data received', data);
      res.end('hello world');
    })
    .catch(err => {
      console.log('There was an error', err);
    });

});

// app.get('/', function (req, res) {
//   var url = 'https://www.yelp.com/biz/el-toro-taqueria-san-francisco';
//   request.get(url, function (err, response, body) {
//     if (err) {
//       console.log('there was an error', err);
//     } else {
//       var reviews = [];
//       var $ = cheerio.load(body);
//       var reviewContainer = $('.review-content p');
//       // var userNames = $('li.user-name');
//       // var userNames = $('.user-name');
      
//       // the following code gets each review and puts it all in an array called reviews
//       for (var i in reviewContainer) {
//         var reviewText = [];
//         if (reviewContainer[i].children) {
//           var reviewChunks = [];
//           for (var j = 0; j < reviewContainer[i].children.length; j++) {
//             if (reviewContainer[i].children[j]) {
//               if (reviewContainer[i].children[j].data) {
//                 reviewChunks.push(reviewContainer[i].children[j].data);
//               }
//             }
//           }
//           reviewText.push(reviewChunks.join(' '));
//         }
//         reviews.push(reviewText);
//       }
//       console.log('TEXT!!!!!!!!!!', reviews);

//       // console.log('userNames', userNames[0].children);



//     }
//   });

//   res.send('Hello world');
// });



app.listen(3000, function () {
  console.log('listening on port 3000!');
});