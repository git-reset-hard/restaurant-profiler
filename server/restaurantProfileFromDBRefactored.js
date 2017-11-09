var db = require('./dbQueryFunctions.js');
var Promise = require('bluebird');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});



var restaurantProfileMakerFromDBRefactored = function() {
  var restaurantProfiles = [];
  db.restaurants.getRefactored(0, 1000)
    .then(data => {
      var restaurantIds = [];

      data.forEach(function(restaurant) {
        var restaurant = restaurant.dataValues;
        restaurantProfile = {};
        restaurantProfile.id = restaurant.id;
        restaurantProfile.yelpId = restaurant.yelpId;
        restaurantProfile.name = restaurant.yelpId.split('-').join(' ');
        restaurantProfile.is_closed = restaurant.is_closed;
        restaurantProfile.rating = restaurant.rating;
        restaurantProfile.city = restaurant.city;
        restaurantProfile.zipcode = restaurant.zipcode;
        restaurantProfile.country = restaurant.country;
        restaurantProfile.state = restaurant.state;
        restaurantProfile.latitude = restaurant.latitude;
        restaurantProfile.longitude = restaurant.longitude;
        restaurantProfile.price = restaurant.price;
        restaurantProfile.phone = restaurant.phone;
        restaurantProfile.categories = [restaurant.categoryOne, restaurant.categoryTwo, restaurant.categoryThree];

        let querySQSTwo = {
          DelaySeconds: 10,
          MessageBody: JSON.stringify(restaurantProfile),
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
      });
    });
};

restaurantProfileMakerFromDBRefactored();

