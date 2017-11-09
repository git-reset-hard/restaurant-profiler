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


var chooseRandomUser = () => {
  return Math.floor(Math.random() * 40000);
};


 
var restaurantProfileMaker = function() {
  var yelp = fetcher.generateDetailedRestaurantsObject();
  var restaurantProfile = fetcher.makeRestaurantProfile(yelp);
  var allReviews = [];
  var allCategories = [];
  var allRestaurantCategories = [];
  var userId = {};
  db.restaurants.save(restaurantProfile)
    .then((data) => {
      var restaurantId = data.dataValues.id;
      restaurantProfile.id = restaurantId;
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
        })
        .catch(function(err) {
          console.log('there was an error saving reviews to the database', err.message);
        });
       
    })
    .catch(function(err) {
      console.log('there was an error saving to the database', err.message);
    });
};

if (process.argv.length > 2) {
  const cmd = process.argv[2];
  const parsedNumberCmd = parseInt(cmd, 10);
  if (Number.isInteger(parsedNumberCmd) && parsedNumberCmd > 0) {

    var repeat = (repeatAmount) => {
      for (var i = 0; i < repeatAmount; i++) {
        restaurantProfileMaker();

      }
    };

    repeat(parsedNumberCmd);
  }
} else {

}