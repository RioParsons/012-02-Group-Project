INSERT INTO users ( display_name, username, password)
VALUES 
('admin', 'admin@funny.com', 'password'),
('ethan', 'ethan@gmail.com', 'password123');

INSERT INTO owners (owner_id) VALUES 
(0);

INSERT INTO restaurants (restaurant_id, name, image_url, owner_id) VALUES
(0, 'Admins cool empty place', 'nowhere.com', 0);

INSERT INTO ratings (rating_id, restaurant_id, user_id, last_updated, uploaded, rating_number, review) VALUES 
(0, 0, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.5, 'I went to this place, and I did not have permision to read the menu...staff were helpful at least.');