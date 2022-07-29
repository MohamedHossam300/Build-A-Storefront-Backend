# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

-   Index
-   Show
-   Create

#### Users

-   Index
-   Show
-   Create
-   authenticate

#### Orders

-   Index
-   Show
-   Create

## Data Shapes

#### Product

-   id SERIAL PRIMARY KEY
-   name VARCHAR(100) NOT NULL
-   description TEXT
-   price integer NOT NULL
-   category VARCHAR(50) NOT NULL

#### User

-   id SERIAL PRIMARY KEY
-   firstName VARCHAR(60) NOT NULL
-   lastName VARCHAR(60) NOT NULL
-   password VARCHAR(200) NOT NULL

#### Orders

-   id SERIAL PRIMARY KEY
-   status VARCHAR(64)
-   user_id bigint REFERENCES users(id)

#### order_product

-   id SERIAL PRIMARY KEY
-   quantity integer
-   order_id bigint REFERENCES orders(id)
-   product_id bigint REFERENCES product(id)

### this project has 3 tables `product`, `users`, `orders`, `order_poduct`

with `postman`
1. product

    `(create)`

    in link 

    `http://localhost:3000/product`

    with http method `post`

    ```
    {
        "name": "name for product",
        "description": "description for product",
        "price": "price of product",
        "category": "the category for product",
        "token": "jwt for user"
    }
    ```

    (`index`)

    in link 

    `http://localhost:3000/product`

    with http method `get`
    
    ```
    {
        "token": "jwt for user"
    }
    ```

    (`show`)
    in link 

    `http://localhost:3000/product/:id`

    with http method `get`
    
    ```
    {
        "token": "jwt for user"
    }
    ```


2. users

    `(create)`

    in link 

    `http://localhost:3000/user`

    with http method `post`

    ```
    {
        "firstName": "firstName for user",
        "lastName": "lastName for user",
        "password": "password for user"
    }
    ```

    (`index`)

    in link 

    `http://localhost:3000/user`

    with http method `get`

    (`show`)
    in link 

    `http://localhost:3000/user/:id`

    with http method `get`


2. order

    `(create)`

    in link 

    `http://localhost:3000/order`

    with http method `post`

    ```
    {
        "userId": 1,
        "quantity": 3000,
        "orderId": 1,
        "productId": 1
    }
    ```

    (`index`)

    in link 

    `http://localhost:3000/order`

    with http method `get`

    (`show`)

    in link

    `http://localhost:3000/order/:id`

    with http method `get`