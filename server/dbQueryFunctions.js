var db = require('../database/index.js');
// var db = require('../database/index.js');

module.exports = {
  restaurants: {
    save: function(data) {
      // console.log('its in the restaurant save function');
      return (
        db.Restaurant.create({
          yelpId: data.yelpId,
          latitude: data.latitude,
          longitude: data.longitude,
          zipcode: data.zipcode,
          rating: data.rating,
          city: data.city,
          country: data.country,
          state: data.state,
          price: data.price
        })
      );
    }
  },
  reviews: {
    save: function(reviews) {
      return (
        db.Review.bulkCreate(reviews)
      );
    }
  },
  users: {
    save: function(users) {
      return (
        db.User.bulkCreate(users)
      );
    },
    get: function(userId) {
      return (
        db.User.find({
          where: {
            id: userId
          }
        })
      );
    }
  },
  categories: {
    save: function(categories) {
      return (
        db.Categories.bulkCreate(categories)
      );
    }
  },
  restaurantCategories: {
    save: function(object) {
      return (
        db.RestaurantCategories.bulkCreate(object)
      );   
    }
  }
};



// '${data.yelpId}', '${data.phone}', ${data.rating}, '${data.city}', '${data.zipcode}', '${data.country}', '${data.state}', '${data.latitude}', '${data.longitude}', '${data.price}')












// module.exports = {
//   restaurants: {
//     save: function(data, callback) {
//       console.log('DATA!', data);
//       var query = `INSERT INTO restaurants (yelpId, phone, rating, city, zipcode, country, state, latitude, longitude, price) VALUES ('${data.yelpId}', '${data.phone}', ${data.rating}, '${data.city}', '${data.zipcode}', '${data.country}', '${data.state}', '${data.latitude}', '${data.longitude}', '${data.price}');`;
//       // var query = 'INSERT INTO restaurants VALUES ("Perry-Ortiz", "+14073900703", 1, "SAINTE GENEVIEVE", "63670", "US", "MO", "37.97", "-90.04", "0.4");';
//       console.log('QUERY!', query);
//       db.connection.query(query, function(err, data) {
//         if (err) {
//           callback(err, null);
//           return;
//         } else {
//           callback(null, data);
//         }
//       });
//     }
//   },
//   reviews: {
//     save: function(data, callback) {
//       var query = `INSERT INTO reviews (latitude, longitude, zipcode, userId, rating, restaurantId, dates) VALUES (${data.latitude}, ${data.longitude}, ${data.zipcode}, ${data.userId}, ${data.rating}, ${data.restaurantId}, ${data.date});`;
//       db.connection.query(query, function(err, data) {
//         if (err) {
//           callback(err, null);
//           return;
//         } else {
//           callback(null, data);
//         }
//       });
//     }
//   },
//   categories: {
//     save: function(data, callback) {
//       var query = `INSERT INTO categories VALUES (${data.categories[0]}, ${data.categories[1]}, ${data.categories[2]});`;
//       db.connection.query(query, function(err, data) {
//         if (err) {
//           callback(err, null);
//           return;
//         } else {
//           callback(null, data);
//         }
//       });
//     }
//   },
//   restaurantCategories: {
//     save: function(data, callback) {
//       var query = `INSERT INTO restaurantCategories VALUES (${data.restaurantId}, ${data.categoryId});`;
//       db.connection.query(query, function(err, data) {
//         if (err) {
//           callback(err, null);
//           return;
//         } else {
//           callback(null, data);
//         }
//       });
//     }
//   },
//   users: {
//     save: function(data, callback) {
//       var query = `INSERT INTO users (user) VALUES (${data});`;
//       db.connection.query(query, function(err, data) {
//         if (err) {
//           callback(err, null);
//           return;
//         } else {
//           callback(null, data);
//         }
//       });
//     }
//   }
// };


// if anything isn't working, remember to check the longitude & latitude

