const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let reviews = mongoose.Schema({
  latitude: String,
  longitude: String,
  zipcode: Number,
  userId: Number,
  rating: Number,
  restaurantId: Number,
  date: Date
});

let restaurants = mongoose.Schema({
  yelpId: String,
  phone: String,
  rating: Number,
  city: String,
  zipcode: String,
  country: String,
  state: String,
  latitude: String,
  longitude: String,
  price: String
});

let categories = mongoose.Schema({
  category: String
});

let restaurantCategories = mongoose.Schema({
  restaurantId: Number,
  categoryId: Number
});

let users = mongoose.Schema({
  user: Number
});



let Review = mongoose.model('Review', reviews);
let Restaurant = mongoose.model('Restaurant', restaurants);
let Category = mongoose.model('Category', categories);
let RestaurantCategory = mongoose.model('RestaurantCategory', restaurantCategories);
let User = mongoose.model('User', users);

let saveReview = (data) => {
  var newReview = new Review({ latitude: data.latitude, longitude: data.longitude, zipcode: data.zipcode, userId: data.userId, rating: data.rating, restaurantId: data.restaurantId, date: data.date });
  newReview.save(function(err, result) {
    if (err) {
      console.log('saving failed', err);
    } else {
      console.log('saved');
      return result;
    }
  });
};

saveRestaurant = (data) => {
  var newRestaurant = new Restaurant({ yelpId: data.yelpId, phone: data.phone, rating: data.rating, city: data.city, zipcode: data.zip_code, country: data.country, state: data.state, latitude: data.latitude, longitude: data.longitude, price: data.price });
  newRestaurant.save(function(err, result) {
    if (err) {
      console.log('saving failed', err);
    } else {
      console.log('saved');
      return result;
    }
  });
};

saveRestaurantCategories = (restaurantId, categoryId) => {
  var newJoin = new RestaurantCategory({ restaurantId: restaurantId, categoryId: categoryId });
  newJoin.save(function(err, result) {
    if (err) {
      console.log('saving failed', err);
    } else {
      console.log('saved');
      return result;
    }
  });
};

saveCategories = (data) => {
  var CategoryOne = new Category({ category: data.categories[0] });
  var CategoryTwo = new Category({ category: data.categories[1] });
  var CategoryThree = new Category({ category: data.categories[2] });

  Category.find({ category: data.categories[0] }, function(err, docs) {
    if (docs.length) {
      console.log('category was already stored');
    } else {
      CategoryOne.save(function(err, result) {
        if (err) {
          console.log('saving failed', err);
        } else {
          console.log('saved');
          return result;
        }
      });
    }
  });

  Category.find({ category: data.categories[1] }, function(err, docs) {
    if (docs.length) {
      console.log('category was already stored');
    } else {
      CategoryTwo.save(function(err, result) {
        if (err) {
          console.log('saving failed', err);
        } else {
          console.log('saved');
          return result;
        }
      });
    }
  });

  Category.find({ category: data.categories[2] }, function(err, docs) {
    if (docs.length) {
      console.log('category was already stored');
    } else {
      CategoryThree.save(function(err, result) {
        if (err) {
          console.log('saving failed', err);
        } else {
          console.log('saved');
          return result;
        }
      });
    }
  });
};

var saveUsers = (data) => {
  var newUser = new User({ user: data.userId });
  newUser.save(function(err, result) {
    if (err) {
      console.log('saving failed', err);
    } else {
      console.log('saved');
      return result;
    }
  });
};





































