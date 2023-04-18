INSERT INTO users (user_id, display_name, username, password)
VALUES 
(0, 'admin', 'admin@funny.com', 'password'),
(1, 'ethan', 'ethan@gmail.com', 'password123');
-- (2, 'testing', 'testingtesting123@yahoo.com', 'unencrypted password');

INSERT INTO owners (owner_id) VALUES 
(0);

INSERT INTO restaurants (restaurant_id, name, image_url, owner_id) VALUES
(0, 'Admins cool empty place', 'nowhere.com', 0);
