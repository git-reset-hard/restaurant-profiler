//to do
// fix restaurant profile maker
//add text to reviews
//add an is open property to restaurant




var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
var fetcher = require('../helpers/apiFetcher.js');
var faker = require('faker');
var fs = require('fs');
var location = require('./fakeLocationData.txt');
var db = require('./dbQueryFunctions.js');
var Promise = require('bluebird');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// todays objectives
//set up and start loading database
//start about elastic search, kibana, and AWS.



// console.log(fakeLocationData[0].split('\tpumpkins\t'));
// console.log(fakeLocationData.length);

// var saveRestaurantTable = Promise.promisify(db.restaurants.save);
// var saveUserTable = Promise.promisify(db.users.save);
// var saveReviewTable = Promise.promisify(db.reviews.save);

// var makeUserId = function() {
//   var text = '';
//   var possible = '0123456789';
//   for (var i = 0; i < 22; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };
     
// var saveUsers = () => {
//   console.log('its in save users');
//   var users = [];
//   for (var i = 0; i < 4000; i++) {
//     // console.log(i);
//     var user = fetcher.makeuser();
//     users.push(user);
//   }
//   console.log('finished the loop');
//   db.users.save(users)
//     .then(data => {
//       console.log('users saved', data);
//     })
//     .catch(function(err) {
//       // Will catch any promise rejections or thrown errors in the chain!
//       console.log('there was an error saving to the database', err.message);
//     });
// };

// saveUsers(); 


  
// // simple CLI
// // [usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
// if (process.argv.length > 2) {
//   const cmd = process.argv[2];
//   const parsedNumberCmd = parseInt(cmd, 10);
//   if (Number.isInteger(parsedNumberCmd) && parsedNumberCmd > 0) {

//     var repeat = (repeatAmount) => {
//       for (var i = 0; i < repeatAmount; i++) {
//         restaurantProfileMaker();
//         // console.log('hello');
//       }
//     };

//     repeat(parsedNumberCmd);
//   }
// } else {
//   // console.log(`
//   //   Utility script used to generate initial User data to populate a dataset.

//   //   Results are placed in an '${DEFAULT.OUTPUT_FILE}' file.

//   //     [usage] node ${path.basename(__filename)} <NUMBER_OF_USERS_TO_GENERATE>
//   //   `);
// }




var chooseRandomUser = () => {
  return Math.floor(Math.random() * 40000);
  //math.random should be multiplied by however many users there are plus 1
};



// app.get('/', (req, res) => {


  //_______________________________ uncomment from here _____________________

 
var restaurantProfileMaker = function() {
  // console.log('a new restaurant is being made');
  var yelp = fetcher.generateDetailedRestaurantsObject();
  var restaurantProfile = fetcher.makeRestaurantProfile(yelp);
  var allReviews = [];
  var allCategories = [];
  var allRestaurantCategories = [];
  var userId = {};
  db.restaurants.save(restaurantProfile)
    .then((data) => {
      // console.log('it passed!!!!!!!!!!!!!!!');
      var restaurantId = data.dataValues.id;
      restaurantProfile.id = restaurantId;
      //makeRestaurantReviews = array of objects
      for (var i = 0; i < 101; i++) {
        var review = fetcher.makeRestaurantReviews(restaurantId);
        userId = review.userId;
        var reviewForDb = {
          rating: review.rating,
          dates: review.date,
          body: review.body,
          userId: review.userId,
          restaurantId: review.restaurantId
        };
        allReviews.push(reviewForDb);
 
      }
      db.reviews.save(allReviews)
        .then((data) => {
          // data.forEach(review => {
          //   console.log('review Data', review.dataValues);
          // });
          restaurantProfile.categories.forEach(category => {
            var categoryForDb = {
              category: category
            };
            allCategories.push(categoryForDb);
          }); 
          db.categories.save(allCategories)
            .then((data) => {
              // console.log('catgories saved', data);
              data.forEach(category => {
                // console.log('category Data', category.dataValues);
                // console.log('category.dataValues.id', category.dataValues.id);
                // console.log('category!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', category.dataValues);
                var categoriesId = category.dataValues.id;
                var restaurantCategoryObj = {
                  restaurantId: restaurantId,
                  categoryId: categoriesId
                };
                allRestaurantCategories.push(restaurantCategoryObj);
              });
              db.restaurantCategories.save(allRestaurantCategories)
                .then((data) => {

                  let querySQSTwo = {
                    DelaySeconds: 10,
                    MessageBody: JSON.stringify(restaurantProfile),
                    //QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantToAppServer'
                    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/appserver'
                  };

                  sqs.sendMessage(querySQSTwo, function(err, data) {
                    if (err) {
                      console.log('Error sending to restaurantToAppServer queue"', err);
                    } else {
                      console.log('Success sending to restaurantToAppServer queue', data.MessageId);
                    }
                  });

                  let querySQS = {
                    DelaySeconds: 10,
                    MessageBody: JSON.stringify(restaurantProfile),
                    // QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/appserver'
                    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantProfileToRecommender'
                  };

                  sqs.sendMessage(querySQS, function(err, data) {
                    if (err) {
                      console.log('Error sending to restaurantProfileToRecommender queue"', err);
                    } else {
                      console.log('Success sending to restaurantProfileToRecommender queue', data.MessageId);
                    }
                  });

                  let querySQSFour = {
                    DelaySeconds: 10,
                    MessageBody: JSON.stringify(restaurantProfile),
                    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantProfileToCustomer'
                  };

                  sqs.sendMessage(querySQSFour, function(err, data) {
                    if (err) {
                      console.log('Error sending to restaurantProfileToCustomer queue"', err);
                    } else {
                      console.log('Success sending to restaurantProfileToCustomer queue', data.MessageId);
                    }
                  });

                  // restaurantProfile.reviews = allReviews;
                  // if (i === (allReviews.length - 1)) {
                  // console.log('restaurant profile', restaurantProfile);  
                  // _____________________________________________________________
                  // let querySQS = {
                  //   DelaySeconds: 10,
                  //   MessageBody: JSON.stringify(restaurantProfile),
                  //   // QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/appserver'
                  //   QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantProfileToRecommender'
                  // };
  
                  // sqs.sendMessage(querySQS, function(err, data) {
                  //   if (err) {
                  //     console.log('Error sending to restaurantProfileToRecommender queue"', err);
                  //   } else {
                  //     console.log('Success sending to restaurantProfileToRecommender queue', data.MessageId);
                  //   }
                  // });


                  // let querySQSTwo = {
                  //   DelaySeconds: 10,
                  //   MessageBody: JSON.stringify(restaurantProfile),
                  //   //QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantToAppServer'
                  //   QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/appserver'
                  // };

                  // sqs.sendMessage(querySQSTwo, function(err, data) {
                  //   if (err) {
                  //     console.log('Error sending to restaurantToAppServer queue"', err);
                  //   } else {
                  //     console.log('Success sending to restaurantToAppServer queue', data.MessageId);
                  //   }
                  // });


                  let querySQSThree = {
                    DelaySeconds: 10,
                    MessageBody: JSON.stringify(allReviews),
                    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/reviewsToCustomerProfile'
                  };

                  sqs.sendMessage(querySQSThree, function(err, data) {
                    if (err) {
                      console.log('Error sending to reviewsToCustomerProfile queue"', err);
                    } else {
                      console.log('Success sending to reviewsToCustomerProfile queue', data.MessageId);
                    }
                  });

                  // let querySQSFour = {
                  //   DelaySeconds: 10,
                  //   MessageBody: JSON.stringify(restaurantProfile),
                  //   QueueUrl: 'https://sqs.us-west-1.amazonaws.com/213354805027/restaurantProfileToCustomer'
                  // };

                  // sqs.sendMessage(querySQSFour, function(err, data) {
                  //   if (err) {
                  //     console.log('Error sending to restaurantProfileToCustomer queue"', err);
                  //   } else {
                  //     console.log('Success sending to restaurantProfileToCustomer queue', data.MessageId);
                  //   }
                  // });
                  // _____________________________________________________________
                  // }
                // })
                // .catch(function(err) {
                //   // Will catch any promise rejections or thrown errors in the chain!
                //   console.log('there was an error saving restaurantCategories1 to the database', err.message);
                // });
                    
                  // });

                //add userId and information to the restaurantProfile
                })
                .catch(function(err) {
                  // Will catch any promise rejections or thrown errors in the chain!
                  console.log('there was an error saving restaurantCategories2 to the database', err.message);
                });
            })
            .catch(function(err) {
              // Will catch any promise rejections or thrown errors in the chain!
              console.log('there was an error saving reviews to the database', err.message);
            });
        })
        .catch(function(err) {
          // Will catch any promise rejections or thrown errors in the chain!
          console.log('there was an error saving reviews to the database', err.message);
        });
       
    })
    .catch(function(err) {
      // Will catch any promise rejections or thrown errors in the chain!
      console.log('there was an error saving to the database', err.message);
    });
};
// });


// simple CLI
// [usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
if (process.argv.length > 2) {
  const cmd = process.argv[2];
  const parsedNumberCmd = parseInt(cmd, 10);
  if (Number.isInteger(parsedNumberCmd) && parsedNumberCmd > 0) {

    var repeat = (repeatAmount) => {
      for (var i = 0; i < repeatAmount; i++) {
        restaurantProfileMaker();
        // console.log('hello');
      }
    };

    repeat(parsedNumberCmd);
  }
} else {
  // console.log(`
  //   Utility script used to generate initial User data to populate a dataset.

  //   Results are placed in an '${DEFAULT.OUTPUT_FILE}' file.

  //     [usage] node ${path.basename(__filename)} <NUMBER_OF_USERS_TO_GENERATE>
  //   `);
}


// ______________ uncomment until here __________________________


//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________


// var fetchRestaurantProfile = function(restaurantId) {
//   //get a restaurant
//   db.restaurants.get(restaurantId)
//     .then(data => {
//       console.log('restaurant', data.dataValues);
//     })
//     .catch(function(err) {
//       // Will catch any promise rejections or thrown errors in the chain!
//       console.log('there was an error saving to the database', err.message);
//     });
//   //get all reviews where restaurantId is equal to current restaurant
//   //get all users that belong to each review
//   //get all categoryIds where restaurantId is equal to current restaurant 
//   //get all categories that belong to the restaurant 
// };


// fetchRestaurantProfile(1);




























//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
//______________________________________________________________________________________________
















// var yelp = fetcher.generateDetailedRestaurantsObject();
// var restaurantProfile = fetcher.makeRestaurantProfile(yelp);
// var restaurantProfileWithoutReviews = fetcher.makeRestaurantProfileWithoutReviews(yelp);
// console.log(typeof parseFloat(restaurantProfile.price), parseFloat(restaurantProfile.price), restaurantProfile.price);
// res.send(JSON.stringify(restaurantProfile.coordinates.latitude));

// //make fake yelp response 
// var yelpResponse = fetcher.generateDetailedRestaurantsObject();
// // var yelpResponse = fetcher.generateDetailedRestaurantsObject();
// //make restaurant profile
// var restaurantProfile = fetcher.makeRestaurantProfile(yelpResponse);
// // console.log('restaurantProfile', restaurantProfile);
// //save restaurant in database and get response with restaurant id in it
// saveRestaurantTable(restaurantProfile)
//   .then(data => {
//     console.log('saved', data);
//     for (var i = 0; i < 101; i++) {
//       console.log('i', i);
//       var user = makeUserId();
//       // console.log('typeof', typeof user)
//       saveUserTable(user)
//         .then(data => {
//           console.log('userData', 'i', i, data);
//           var review = fetcher.makeRestaurantReviews(restaurantProfile, data.insertId);
//           saveReviewTable(review)
//             .then(data => {
//               console.log('review was saved!!!!!!hi');
//             })
//             .catch(function(err) {
//               // Will catch any promise rejections or thrown errors in the chain!
//               console.log('there was an error saving to the database', err.message);
//             });
//         })
//         .catch(function(err) {
//           // Will catch any promise rejections or thrown errors in the chain!
//           console.log('there was an error saving to the database', err.message);
//         });
//     }

//   })
//   .catch(function(err) {
//     // Will catch any promise rejections or thrown errors in the chain!
//     console.log('there was an error saving to the database', err.message);
//   });

// make reviews and include new restaurant id
//save each category
//save each restaurantCategory
//  save each user
//    save each review
//




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



// app.listen(3000, function () {
//   console.log('listening on port 3000!');
// });