DROP DATABASE IF EXISTS yelp;

CREATE DATABASE yelp;

USE yelp;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user varchar(1000) NOT NULL
);

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  latitude varchar(1000) NOT NULL,
  longitude varchar(1000) NOT NULL,
  zipcode int NOT NULL,
  userId int NOT NULL,
  rating int NOT NULL,
  restaurantId int NOT NULL,
  dates datetime NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

DROP TABLE IF EXISTS restaurants;

CREATE TABLE restaurants (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  yelpId varchar(1000) NOT NULL,
  phone varchar(1000) NOT NULL,
  rating int NOT NULL,
  city varchar(1000) NOT NULL,
  zipcode varchar(1000) NOT NULL,
  country varchar(1000) NOT NULL,
  state varchar(1000) NOT NULL,
  latitude varchar(1000) NOT NULL,
  longitude varchar(1000) NOT NULL,
  price varchar(1000) NOT NULL
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  category varchar(1000) NOT NULL
);


DROP TABLE IF EXISTS restaurantCategories;

CREATE TABLE restaurantCategories (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  restaurantId int NOT NULL,
  categoryId int NOT NULL,                 
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);





/* Create other tables and define schemas for them here! */

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/