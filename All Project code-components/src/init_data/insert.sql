INSERT INTO users (display_name, username, pswd)
VALUES 
('admin', 'admin@funny.com', 'password'),
('ethan', 'ethan@gmail.com', 'password123');

INSERT INTO owners (owner_id) VALUES 
(1);

INSERT INTO restaurants (name, image_url, owner_id) VALUES
('Admins cool empty place', 'nowhere.com', 1),
('Pizza Palace', 'https://www.pizzapalace.com/images/pizza.jpg', 1),
('Burger Joint', 'https://www.burgerjoint.com/images/burger.jpg', 1),
('Sushi House', 'https://www.sushihouse.com/images/sushi.jpg', 1),
('Taco Truck', 'https://www.tacotruck.com/images/taco.jpg', 1),
('Thai Kitchen', 'https://www.thaikitchen.com/images/thai.jpg', 1);

INSERT INTO ratings (restaurant_id, user_id, last_updated, uploaded, rating_number, review) VALUES 
(1, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.5, 'I went to this place, and I did not have permision to read the menu...staff were helpful at least.'),
(1, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 4.5, 'Great pizza! Definitely recommend.'),
(1, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.5, 'Pizza was good but a bit greasy.'),
(2, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 4.0, 'Amazing burgers, best I ever had!'),
(2, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.0, 'Burgers were decent but nothing special.'),
(2, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 4.5, 'Delicious burgers and great service.'),
(3, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 4.5, 'Excellent sushi, very fresh!'),
(3, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.5, 'Sushi was good but not amazing.'),
(4, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.0, 'Tacos were just okay, nothing special.'),
(4, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 2.5, 'Service was slow and tacos were cold.'),
(5, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 4.0, 'Amazing Thai food, highly recommend!'),
(5, 1, '2023-04-19 13:05:06', '2023-04-19 13:05:06', 3.5, 'Good Thai food, but a bit too spicy for my taste.');