erDiagram
    USER {
        integer user_id PK "serial, not null"
        varchar(32) display_name "not null"
        varchar(64) username "not null"
        varchar(256) display_name "not null"
    }
    OWNER {
        integer owner_id PK, FK
    }
    RESTAURANT {
        integer restaurant_id PK "serial, not null"
        varchar(256) name "NOT NULL"
        varchar(1024) image_url "NOT NULL"
        integer owner_id fk
    }
    RATING {
        integer rating_id PK "serial, not null"
        integer restaurant_id FK "NOT NULL"
        integer user_id FK "NOT NULL"
        timestamp last_updated "NOT NULL"
        timestamp created "NOT NULL"
        decimal rating_number
        varchar(1024) review
    }

    DEALS{
        integer deal_id PK "SERIAL, NOT NULL"
        varchar(64) deal_title "NOT NULL"
        varchar(256) event_description "NOT NULL"
        varchar(64) restaurant "NOT NULL"
        varchar(64) day "NOT NULL"
        varchar(64) time "NOT NULL"
    }


    EVENTS{
        integer event_id PK "SERIAL, NOT NULL"
        varchar(64) event_title "NOT NULL"
        varchar(256) event_description "NOT NULL"
        varchar(64) restaurant "NOT NULL"
        varchar(64) day "NOT NULL"
        varchar(64) time "NOT NULL"
    }

    USER ||--|| OWNER : ""
    USER ||--|{ RATING : ""
    OWNER ||--|{ RESTAURANT : ""
    RESTAURANT ||--o{ RATING : ""
    RESTAURANT }o--o| EVENTS : ""
    RESTAURANT }o--o| DEALS : ""