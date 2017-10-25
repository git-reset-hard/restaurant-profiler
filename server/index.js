var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var fetcher = require('../helpers/apiFetcher.js');
var faker = require('faker');
var fs = require('fs');
var location = require('./fakeLocationData.txt');

//objectives:
//  create fake data
//  parse fake data into desired object
//  store fake parsed data into db


faker.locale = 'en_US';

var makeid = function() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var makeYelpId = function(name) {
  return name.split(' ').join('-');
};

var randomPriceMaker = function() {
  var result = '';
  var randomNumber = Math.ceil(Math.random() * 4);
  for (var i = 0; i < randomNumber; i++) {
    result += '$';
  }
  return result;
};

var fakeLocationData = location.location;
fakeLocationData = fakeLocationData.split('\t\t\n');
// console.log(fakeLocationData[0].split('\tpumpkins\t'));
// console.log(fakeLocationData.length);





app.get('/', (req, res) => {
  var randomAliasOne = faker.random.word();
  var randomAliasTwo = faker.random.word();
  var randomAliasThree = faker.random.word();
  var name = faker.name.findName();
  var rating = Math.floor(Math.random() * 6);
  var randomLocationIndex = Math.floor(Math.random() * 81257);
  var randomLocation = fakeLocationData[0].split('\tpumpkins\t');
  // console.log(randomLocation);


  var yelpObject = {
    'id': makeYelpId(name), 
    'name': name, 
    'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/SRj2lQJkjLQ-TxccWdw2eQ/o.jpg', 
    'is_claimed': true, 
    'is_closed': false, 
    'url': 'https://www.yelp.com/biz/taqueria-casas-kissimmee?adjust_creative=p5JPLml8YiVq3TUr8ab8hw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=p5JPLml8YiVq3TUr8ab8hw', 
    'phone': '+14073900703', 
    'display_phone': '(407) 390-0703', 
    'review_count': 37, 
    'categories': [
      {
        'alias': randomAliasOne, 
        'title': randomAliasOne
      },
      {
        'alias': randomAliasTwo, 
        'title': randomAliasTwo
      },
      {
        'alias': randomAliasThree, 
        'title': randomAliasThree
      }
    ], 
    'rating': rating || 5, 
    'location': {
      'address1': '4384 W Vine St', 
      'address2': '', 
      'address3': '', 
      'city': randomLocation[1], 
      'zip_code': randomLocation[0], 
      'country': randomLocation[5], 
      'state': randomLocation[2], 
      'display_address': [
        '4384 W Vine St', 
        'Kissimmee, FL 34746'
      ], 
      'cross_streets': ''
    }, 
    'coordinates': {
      'latitude': randomLocation[3], 
      'longitude': randomLocation[4]
    }, 
    'photos': [
      'https://s3-media2.fl.yelpcdn.com/bphoto/SRj2lQJkjLQ-TxccWdw2eQ/o.jpg', 
      'https://s3-media1.fl.yelpcdn.com/bphoto/80JBY2aGcTlBVRgP7CgcKA/o.jpg', 
      'https://s3-media3.fl.yelpcdn.com/bphoto/hdLYkUVF2ZtPQ3aTnUBzbw/o.jpg'
    ], 
    'price': randomPriceMaker(), 
    'hours': [
      {
        'open': [
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 0
          }, 
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 1
          }, 
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 2}, 
          {
            'is_overnight': false,
            'start': '1000', 
            'end': '2200', 
            'day': 3}, 
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 4
          }, 
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 5
          }, 
          {
            'is_overnight': false, 
            'start': '1000', 
            'end': '2200', 
            'day': 6
          }
        ], 
        'hours_type': 'REGULAR', 
        'is_open_now': true
      }
    ], 
    'transactions': []
  };

  console.log(yelpObject);
  res.send(JSON.stringify(yelpObject));
});












































// var categories = [
//   'Mexican',
//   'seafood',
//   'Meatballs',
// ];

// app.get('/', (req, res) => {
//   var restaurants = [];
//   var dummyData = categories.map(category => {
//     return fetcher.fetchRestaurantList(category).then(data => {
//       // console.log('dataset', JSON.parse(data).businesses[0].id);
//       JSON.parse(data).businesses.forEach(function(restaurant) {
//         restaurants.push(restaurant.id);
//       });
//     });
//   });

//   Promise.all(dummyData)
//     .then(data => {
//       // console.log('data received', restaurants);
//       var restaurantsDetails = [];
//       //make a yelp call for every single restaurant
//       var rDetails = restaurants.map(restaurant => {
//         return fetcher.fetchAllRestaurantDetails(restaurant).then(data => {
//           restaurantsDetails.push(data);
//         });
//       });
//       Promise.all(rDetails)
//         .then(data => {
//           // console.log('DETAILS!!!!!!!!!!!!!!!!!!!', restaurantsDetails);
//           var reviews = [];
//           var reviewDetails = restaurants.map(restaurant => {
//             return fetcher.fetchAllReviews(restaurant).then(data => {

//               reviews.push(data);
//             });
//           });
//           Promise.all(reviewDetails)
//             .then(data => {
//               // console.log('REVIEWS!!!!!!!!!!!!!!!!!', Array.isArray(reviews));
//               console.log('arrived');
//               reviews.forEach(review => {
//                 // console.log('!!!!!!!!!!!!!!!', review, '!!!!!!!!!!!!!!!');
//                 var parsedReviews = [];
//                 var $ = cheerio.load(review);
//                 var reviewContainer = $('.review-content p');
// //_________________________

//                 for (var i in reviewContainer) {
//                   var reviewText = [];
//                   if (reviewContainer[i].children) {
//                     var reviewChunks = [];
//                     for (var j = 0; j < reviewContainer[i].children.length; j++) {
//                       if (reviewContainer[i].children[j]) {
//                         if (reviewContainer[i].children[j].data) {
//                           reviewChunks.push(reviewContainer[i].children[j].data);
//                         }
//                       }
//                     }
//                     reviewText.push(reviewChunks.join(' '));
//                   }
//                   reviews.push(reviewText);
//                 }
// // _______________________

//               });


//               res.end('hello world');
//             })
//             .catch(err => {
//               console.log('There was an error', err);
//             });

//         })
//         .catch(err => {
//           console.log('There was an error', err);
//         });
//     })

//     .catch(err => {
//       console.log('There was an error', err);
//     });

// });

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