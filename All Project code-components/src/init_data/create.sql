DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	user_id int SERIAL NOT NULL PRIMARY KEY,
	display_name VARCHAR(32),
    username VARCHAR(64) NOT NULL,
    password CHAR(256) NOT NULL,
);

DROP TABLE IF EXISTS owners CASCADE;
CREATE TABLE owners(
	owner_id int REFERENCES users(user_id),
);

DROP TABLE IF EXISTS restaurants CASCADE;
CREATE TABLE restaurants(
	restaurant_id int SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	image_url VARCHAR(1024),
	owner_id int REFERENCES owners(owner_id)
);

DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings(
	rating_id int SERIAL NOT NULL PRIMARY KEY,
	restaurant_id int REFERENCES restaurants(restaurant_id) NOT NULL,
	user_id int REFERENCES users(user_id) NOT NULL,
	last_updated TIMESTAMP NOT NULL,
	uploaded TIMESTAMP NOT NULL,
	rating_number decimal,
	review VARCHAR(1024)
);