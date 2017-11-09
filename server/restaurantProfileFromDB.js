var db = require('./dbQueryFunctions.js');
var Promise = require('bluebird');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});


var restaurantProfileMakerFromDB = function(id) {
  var restaurantProfile = {};

  db.restaurants.get(id)
    .then(data => {
      var dbData = data[0].dataValues;
      restaurantProfile.id = dbData.id;
      restaurantProfile.yelpId = dbData.yelpId;
      restaurantProfile.name = dbData.yelpId.split('-').join(' ');
      restaurantProfile.is_closed = dbData.is_closed;
      restaurantProfile.rating = dbData.rating;
      restaurantProfile.city = dbData.city;
      restaurantProfile.zipcode = dbData.zipcode;
      restaurantProfile.country = dbData.country;
      restaurantProfile.state = dbData.state;
      restaurantProfile.latitude = dbData.latitude;
      restaurantProfile.longitude = dbData.longitude;
      restaurantProfile.price = dbData.price;

      db.restaurantCategories.get(id)
        .then(categories => {
          var categoriesArray = [];
          categories.forEach(function(cat, i) {
            // console.log(cat.dataValues.categoryId);
            categoriesArray.push(cat.dataValues.categoryId);
          });
          var categoryNames = [];




          var getCategories = categoriesArray.map(category => {
            return db.categories.get(category).then(data => {
              data.forEach(function(cat) {
                categoryNames.push(cat.dataValues.category);
              });
            });
          });







          Promise.all(getCategories)
            .then(data => {
              restaurantProfile.categories = [];
              categoryNames.forEach(function(cat) {
                restaurantProfile.categories.push(cat);
              });
//___________________________________________
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
//___________________________________________
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
//___________________________________________
     
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
//___________________________________________              

            })
            .catch(function(err) {
              console.log('there was an error getting category names to the database', err.message);
            });

        })
        .catch(function(err) {
          console.log('there was an error saving restaurantCategories1 to the database', err.message);
        });
    })
    .catch(function(err) {
      console.log('there was an error saving restaurantCategories2 to the database', err.message);
    });
};



for (var i = 1; i < 250; i++) {
  restaurantProfileMakerFromDB(i);
}















