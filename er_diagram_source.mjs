erDiagram
    restaurant {
        integer restaurant_id pk "serial, not null"
        varchar(256) name
        varchar(512) image_url
        integer owner_id fk
    }

    rating {
        integer rating_id pk "serial, not null"
        integer restaurant_id fk "not null"
        integer user_id fk "not null"
        decimal rating_number
        varchar(1024) review
    }

    restaurant_to_rating {
        integer restaurant_id fk "not null"
        integer rating_id fk "not null"
    }

    user {
        integer user_id pk "serial, not null"
        varchar(32) display_name
        varchar(64) username "not null"
        varchar(256) password "not null"
    }

    user_to_rating {
        integer user)id fk "not null"
        integer rating_id fk "not null"
    }

    owner {
        integer owner_user_id fk 
    }

    owner_to_restaurant {
        integer owner_id fk "not null"
        integer restaurant_id fk "not null"
    }

    restaurant }|--|{ restaurant_to_rating :""
    restaurant_to_rating }|--|| rating:""
    user }|--|{ user_to_rating :""
    user_to_rating }|--|| rating:""
    owner }|--|{ owner_to_restaurant:""
    owner_to_restaurant }|--|| restaurant:""
    user ||--|| owner:""