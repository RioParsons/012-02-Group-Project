DROP DATABASE IF EXISTS restaurants_db;
CREATE DATABASE restaurants_db;	
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	user_id SERIAL NOT NULL PRIMARY KEY,
	display_name VARCHAR(32),
    username VARCHAR(64) NOT NULL,
    pswd VARCHAR(256) NOT NULL
);

DROP TABLE IF EXISTS owners CASCADE;
CREATE TABLE owners(
	owner_id INTEGER REFERENCES users(user_id)
);

DROP TABLE IF EXISTS restaurants CASCADE;
CREATE TABLE restaurants(
	restaurant_id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	image_url VARCHAR(1024),
	owner_id INTEGER REFERENCES users(user_id)
);

DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings(
	rating_id SERIAL NOT NULL PRIMARY KEY,
	restaurant_id INTEGER REFERENCES restaurants(restaurant_id) NOT NULL,
	user_id INTEGER REFERENCES users(user_id) NOT NULL,
	last_updated TIMESTAMP NOT NULL,
	uploaded TIMESTAMP NOT NULL,
	rating_number decimal,
	review VARCHAR(1024)
);

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events(
	event_id SERIAL NOT NULL PRIMARY KEY,
	event_title VARCHAR(256) NOT NULL,
	event_description VARCHAR(256) NOT NULL,
	restaurant VARCHAR(256) NOT NULL,
	day VARCHAR(64) NOT NULL,
	time VARCHAR(64) NOT NULL
);

DROP TABLE IF EXISTS deals CASCADE;
CREATE TABLE deals(
	deal_id SERIAL NOT NULL PRIMARY KEY,
	deal_title VARCHAR(256) NOT NULL,
	deal_description VARCHAR(256) NOT NULL,
	restaurant VARCHAR(256) NOT NULL,
	day VARCHAR(64) NOT NULL,
	time VARCHAR(64) NOT NULL
);