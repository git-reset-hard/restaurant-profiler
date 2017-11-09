var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var connection = new Sequelize('yelp', 'root', '', {
  dialect: 'mysql',
  logging: false,
  pool: {
    maxConnections: 5000,
    minConnections: 1,
    maxIdleTime: 3600000,
    acquire: 20000
  }
});

var User = connection.define('user', {
  userId: Sequelize.TEXT,
  latitude: Sequelize.TEXT,
  longitude: Sequelize.TEXT,
  zipcode: Sequelize.INTEGER
});
 
var Review = connection.define('review', {
  rating: Sequelize.INTEGER,
  dates: Sequelize.DATE,
  body: Sequelize.TEXT,
  userId: Sequelize.INTEGER,
  restaurantId: Sequelize.INTEGER
  // userId and restaurantId are foreign keys
});

var Restaurant = connection.define('restaurant', {
  yelpId: Sequelize.TEXT,
  latitude: Sequelize.TEXT,
  longitude: Sequelize.TEXT,
  rating: Sequelize.INTEGER,
  city: Sequelize.TEXT,
  zipcode: Sequelize.TEXT,
  country: Sequelize.TEXT,
  state: Sequelize.TEXT,
  price: Sequelize.TEXT,
  is_closed: Sequelize.BOOLEAN,
  categoryOne: Sequelize.TEXT,
  categoryTwo: Sequelize.TEXT,
  categoryThree: Sequelize.TEXT,
  phone: Sequelize.TEXT
});
 
var Categories = connection.define('categories', {
  category: Sequelize.TEXT
});
 
var RestaurantCategories = connection.define('restaurantCategories', {
  restaurantId: Sequelize.INTEGER,
  categoryId: Sequelize.INTEGER
});


 
// User.hasMany(Review, { foreignKey: 'userId' });
// Review.belongsTo(User, { foreignKey: 'userId' });

Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId' });




connection.sync();

//make 100k restaurants
//save restaurants - get back restaurant id
//make 40K user 
//save users 
//make 100 reviews per restaurant
//save categories
//save restaurantCategories



exports.User = User;
exports.Review = Review;
exports.Restaurant = Restaurant;
exports.Categories = Categories;
exports.RestaurantCategories = RestaurantCategories;







// var mysql = require('mysql');

// // Create a database connection and export it from this file.
// // You will need to connect with the user "root", no password,
// // and to the database "chat".


// var connection = mysql.createConnection({
//   database: 'yelp',
//   user: 'root',
//   password: ''
// });
 
// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('connected as id ' + connection.threadId);
// });

// exports.connection = connection;