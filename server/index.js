var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var fetcher = require('../helpers/apiFetcher.js');
var faker = require('faker');
var fs = require('fs');
var location = require('./fakeLocationData.txt');

// todays objectives
//set up and start loading database
//start about elastic search, kibana, and AWS.



// console.log(fakeLocationData[0].split('\tpumpkins\t'));
// console.log(fakeLocationData.length);




app.get('/', (req, res) => {
  // var yelp = fetcher.generateDetailedRestaurantsObject();
  // var restaurantProfile = fetcher.makeRestaurantProfile(yelp);
  // var restaurantProfileWithoutReviews = fetcher.makeRestaurantProfileWithoutReviews(yelp);
  // console.log(typeof parseFloat(restaurantProfile.price), parseFloat(restaurantProfile.price), restaurantProfile.price);
  // res.send(JSON.stringify(restaurantProfile.coordinates.latitude));

  //make fake yelp response 
  //make restaurant profile
  //save each restaurant
  //save each category
  //save each restaurantCategory
  //  save each user
  //    save each review
  //


});






//remember to store in database first then set id's on each object and finally send objects to teammates





































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