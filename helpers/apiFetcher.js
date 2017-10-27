// const axios = require('axios');
var request = require('request');
var rp = require('request-promise');
var faker = require('faker');
var location = require('../server/fakeLocationData.txt');


// const fetchRestaurantList = (terms) => {
//   let options = {
//     url: `https://api.yelp.com/v3/businesses/search?term=${terms}&location=34746`,
//     auth: {
//       'bearer': 'VIbYemNYt5Ovsg5HgnB9eWuQznMb9Om1CbYboaZLE3jsq8xRYcTHrlO30DRFXXtZtiVAmL6WPN3MV98WXAft5l4sXydQfrtIJeYidoKI9IFTXmNFJbasKIX881vdWXYx'
//     },
//   };
//   return rp(options);
// };

// const fetchAllRestaurantDetails = (restaurantId) => {
//   let options = {
//     url: `https://api.yelp.com/v3/businesses/${restaurantId}`,
//     auth: {
//       'bearer': 'VIbYemNYt5Ovsg5HgnB9eWuQznMb9Om1CbYboaZLE3jsq8xRYcTHrlO30DRFXXtZtiVAmL6WPN3MV98WXAft5l4sXydQfrtIJeYidoKI9IFTXmNFJbasKIX881vdWXYx'
//     },
//   };
//   return rp(options);
// };

// const fetchAllReviews = (restaurantId) => {
//   let options = {
//     url: `https://www.yelp.com/biz/${restaurantId}`,
//   };
//   return rp(options);
// };

var makeUserId = function() {
  var text = '';
  var possible = '0123456789';
  for (var i = 0; i < 22; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// var makeReviewId = function() {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789';
//   for (var i = 0; i < 10; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// var makeid = function() {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789';
//   for (var i = 0; i < 6; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

const generateDetailedRestaurantsObject = () => {

  faker.locale = 'en_US';


  var makeYelpId = function(name) {
    return name.split(' ').join('-');
  };

  var randomPriceMaker = function() {
    var price = ['0.2', '0.4', '0.6', '0.8'];
    var randomIndex = Math.floor(Math.random() * 5);
    return price[randomIndex];
  };

  var fakeLocationData = location.location;
  fakeLocationData = fakeLocationData.split('\t\t\n');
  var randomAliasOne = faker.random.word();
  var randomAliasTwo = faker.random.word();
  var randomAliasThree = faker.random.word();
  var name = faker.name.findName();
  var rating = Math.floor(Math.random() * 6);
  var randomLocationIndex = Math.floor(Math.random() * 81256);
  var randomLocation = fakeLocationData[randomLocationIndex].split('\tpumpkins\t');


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

  return yelpObject;

};

var makeRestaurantReviews = (restaurantId) => {
  var reviews = [];
  const randomDate = function(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  for (var i = 0; i < 101; i++) {
    var fakeLocationData = location.location;
    fakeLocationData = fakeLocationData.split('\t\t\n');
    var rating = Math.floor(Math.random() * 6);
    var randomLocationIndex = Math.floor(Math.random() * 81257);
    var randomLocation = fakeLocationData[randomLocationIndex].split('\tpumpkins\t');
    var date = randomDate(new Date(2017, 6, 1), new Date());

    var review = {
      latitude: randomLocation[3], 
      longitude: randomLocation[4],
      zipcode: randomLocation[0],
      userId: makeUserId(),
      rating: rating || 5,
      restaurantId: restaurantId,
      date: date
    };
    reviews.push(review);
  }
  return reviews;
};

var makeRestaurantProfile = (restaurant) => {
  var restaurantProfile = {
    name: restaurant.name,
    phone: restaurant.phone,
    yelpId: restaurant.id,
    categories: [
      restaurant.categories[0].title,
      restaurant.categories[1].title,
      restaurant.categories[2].title
    ],
    'rating': restaurant.rating, 
    'city': restaurant.location.city, 
    'zip_code': restaurant.location.zip_code, 
    'country': restaurant.location.country, 
    'state': restaurant.location.state, 
    'latitude': restaurant.coordinates.latitude, 
    'longitude': restaurant.coordinates.longitude,
    'price': restaurant.price,
    reviews: makeRestaurantReviews(restaurantProfile.id)
  };

  return restaurantProfile;
};

var makeRestaurantProfileWithoutReviews = (restaurant) => {
  var restaurantProfile = {
    name: restaurant.name,
    phone: restaurant.phone,
    yelpId: restaurant.id,
    categories: [
      restaurant.categories[0].title,
      restaurant.categories[1].title,
      restaurant.categories[2].title
    ],
    'rating': restaurant.rating, 
    'city': restaurant.location.city, 
    'zip_code': restaurant.location.zip_code, 
    'country': restaurant.location.country, 
    'state': restaurant.location.state, 
    'latitude': restaurant.coordinates.latitude, 
    'longitude': restaurant.coordinates.longitude,
    'price': restaurant.price,
  };

  return restaurantProfile;
};



module.exports = {
  // fetchRestaurantList,
  // fetchAllRestaurantDetails,
  // fetchAllReviews,
  generateDetailedRestaurantsObject,
  makeRestaurantReviews,
  makeRestaurantProfile,
  makeRestaurantProfileWithoutReviews
};
