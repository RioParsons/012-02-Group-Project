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

INSERT INTO deals (deal_title, deal_description, restaurant, day, time) VALUES
('Happy Hour', '$1.50 Off House Pints and $1.50 Off House Margaritas', 'Mountain Sun Pub and Brewery', 'Monday, Tuesday, Wednesday, Thursday, Friday', '3-5pm'),
('Happy Hour', '$6 Glasses of wine and pitcher of beer', 'Postino Boulder', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', 'Until 5pm'),
('Happy Hour', '$25 bottle of wine and bruschetta board', 'Postino Boulder', 'Tuesday, Wednesday', 'After 8pm'),
('Happy Hour', 'Deals on food and drinks, $3 Estrella, $28 sangria pitchers', 'Gemini', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-5pm'),
('Meal Combo', 'Margherita pizza, Antica salad and drink for $17 from 11:30a to 3:30p', 'Pizzeria Alberico', 'Monday, Tuesday, Wednesday, Thursday, Friday', '11:30am-3:30pm'),
('Happy Hour', 'Free chips and salsa after ordering from the bar, $1 off all House and Coin Margaritas, $1 off all house cocktails, $20 party Margs, $1 off all draft beers', 'Illegal Pete’s', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', 'Reduced prices on select sushi and various food items', 'Sushi Zanmai', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', 'All day'),
('Happy Hour', '$5 beer, $9 wine, $10 spritz', 'Mateo', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '4-6pm'),
('Happy Hour', 'Food specials for $10, $5 alcoholic slushies, $5 draft beer', 'ND streetBAR', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', '$5 gaku buns, $4 sake bombs, etc.', 'Gaku Ramen', 'Monday, Tuesday, Wednesday, Thursday, Friday', '3-6pm'),
('Happy Hour', 'Food specials, $8 classic Rio Margs, $3 draft beers and cans, $5 wine', 'Rio Grande Mexican Restaurant', 'Monday, Tuesday, Wednesday, Thursday, Friday', '3-6pm'),
('Happy Hour', '$3-$11 small plates, $8-$10 cocktails, $6-$10 wine, $4 draft beer', 'Spruce Farm & Fish', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy hour', '$3 street tacos, $4 draft beer, $5 house marg', 'T/ACO', 'Monday, Wednesday, Thursday, Friday, Saturday, Sunday', '2-5pm'),
('Happy Hour', 'Food specials, $2 off all special rolls, $5 Avery Seasonal Draft, $8 House Wine & Well Cocktails, $6/$9 Hot Sake (S/L), $9 Cold Sake (L), $9 bartender’s choice cocktail and sangria', 'Japango', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', 'All day'),
('Happy Hour', 'Food specials, $4 Hapa beer, $6.50 hot sake, $7.50 fresh fruit infused sake, $8 sake cocktails, $8 well drinks, $12 sake bombs, $13.50 sake drop', 'Hapa Sushi Grill and Sake Bar', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday', '2-4:30pm'),
('Happy Hour', 'Food specials, $4 well cocktails, drafts and wines, $5 fat alberts', 'The Attic Bar and Bistro', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', 'Food specials, under $6 cocktails, $7 house wine, $1 off all draft beers', 'Jax Fish House', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3:30-5pm'),
('Happy Hour', '6 for $10 chicken wings, $5 wine and beer, $8 house margarita', 'The Post Chicken & Beer', 'Monday, Tuesday, Wednesday, Thursday, Friday', '3:30-5pm'),
('Happy Hour', 'Food specials, $1 off beers, $8 house wines, $10 specialty cocktails', 'Sforno Trattoria Romana', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', '$6 wine, $8 Saturn, $8 pina colada, $6 strawberry daiquiri, $8 blue Hawaii, $4 Locals Light', 'Jungle', 'Monday, Tuesday, Wednesday, Friday, Saturday, Sunday', '4-6pm'),
('Happy Hour', '$5 to $9 food specials, $8 to $10 cocktails, $4 draft beers, under $11 wine', 'The Corner Bar', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', '$7 cocktails', 'The Bitter Bar', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '5-7pm'),
('Happy Hour', '$8 guacamole deluxe, $6 coin style margarita, $4 post beer cans, and more.', 'Centro Mexican Kitchen', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '2-4pm'),
('Happy Hour', 'Under $15 food specials, $6 draft beers, $10 cocktails, $9 house wines', 'Jills Restaurant at the St. Julien Hotel and Spa', 'Monday, Tuesday, Wednesday, Thursday, Friday', '3-6pm'),
('Happy Hour', '$6 house margarita, $7 specialty margaritas and cocktails, $3 cans, $4 drafts, $6 wine, $20-$22 56oz margaritas to share', 'My Neighbor Felix', 'Monday, Wednesday, Thursday, Friday', '3-6pm'),
('Happy Hour', '$5.50 beer, wine and sake, $4 nigiri and sashimi, $9 sushi rolls', 'Blofish', 'Monday, Tuesday, Wednesday, Thursday, Saturday, Sunday', '4-5:30pm'),
('Happy Hour', "Screamin' deals on local craft brews, inventive cocktails, and patio pounders", 'Avanti Boulder', 'Monday, Tuesday, Wednesday, Thursday, Friday, Sunday', 'all day'),
('Happy Hour', 'Half-price apps and cheese plates, $2 off wine by the glass, $2 off draft beer, $2 off all wine cocktails', 'Wine Bar @ R Gallery', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm'),
('Happy Hour', 'Discounted wines, cocktails, and beers, food specials', 'Rosetta Hall', 'Monday, Tuesday, Wednesday, Friday, Saturday, Sunday', '4-6pm'),
('Happy Hour', '$7.50 wines and cocktails', 'The Kitchen', 'Monday, Tuesday, Wednesday, Friday, Saturday, Sunday', '3-5pm'),
('Happy Hour', '$2 off all cocktails', 'Chicken on the Hill', 'Monday', '8-10pm'),
('Happy Hour', 'BOGO 50% off all pitchers', 'Chicken on the Hill', 'Tuesday', '9-11pm'),
('Happy Hour', '50% off all boneless wings', 'Chicken on the Hill', 'Wednesday', 'all day'),
('Meal Combo', '$9.95 for 7” Creamy Club or Portobello Boomer, chips, and drink', 'Half-Fast Subs', 'Monday', 'until 5pm'),
('Meal Combo', '$9.95 for 7” Classic Roast Beef or the Caprese, chips, and drink', 'Half-Fast Subs', 'Tuesday', 'until 5pm'),
('Meal Combo', '$9.95 for 7” Half-Fast Sub or Roasted Eggplant, chips, and drink', 'Half-Fast Subs', 'Wednesday', 'until 5pm'),
('Meal Combo', '$9.95 for 7” santa fe cheesesteak or thai tempeh, chips, and drink', 'Half-Fast Subs', 'Thursday', 'until 5pm'),
('Meal Combo', '$9.95 for 7” Creamy crab or tempeh reuben, chips, and drink', 'Half-Fast Subs', 'Friday', 'until 5pm'),
('Happy Hour', '$1.50 off every sandwich, $7.50 strongo and margarita pitchers, specials on pints of craft beer', 'Half-Fast Subs', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', '3-6pm');