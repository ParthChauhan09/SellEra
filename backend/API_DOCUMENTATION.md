# SellEra API Documentation

This document provides information about the SellEra API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3002/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. 

- For protected endpoints, include the token in the Authorization header:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

- Alternatively, the token can be sent as a cookie named `token`.

## Error Responses

All API errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## API Endpoints

### Authentication

#### Register User

- **URL**: `/users/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "user": {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "name": "User Name",
      "email": "user@example.com",
      "_id": "user_id",
      "cart": [],
      "orderHistory": [],
      "review": []
    }
  }
  ```

#### Login User

- **URL**: `/users/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "name": "User Name",
      "email": "user@example.com",
      "_id": "user_id",
      "cart": [],
      "orderHistory": [],
      "review": []
    }
  }
  ```

#### Register Vendor

- **URL**: `/vendors/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "vendor": {
      "name": "Vendor Name",
      "email": "vendor@example.com",
      "password": "password123",
      "description": "Vendor description here"
    }
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "name": "Vendor Name",
      "email": "vendor@example.com",
      "_id": "vendor_id",
      "description": "Vendor description here",
      "productList": []
    }
  }
  ```

#### Login Vendor

- **URL**: `/vendors/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "vendor@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "data": {
      "name": "Vendor Name",
      "email": "vendor@example.com",
      "_id": "vendor_id",
      "description": "Vendor description here",
      "productList": []
    }
  }
  ```

### Products

#### Get All Products

- **URL**: `/products`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "category": "Electronics",
        "vendorName": "vendor_id",
        "image": { /* image data */ }
      }
    ]
  }
  ```

#### Get Products by Category

- **URL**: `/products/category/:category`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `category` - One of: Electronics, Clothing, Accessories
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "category": "Electronics",
        "vendorName": "vendor_id",
        "image": { /* image data */ }
      }
    ]
  }
  ```

#### Get Product by ID

- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `id` - Product ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "vendorName": {
        "_id": "vendor_id",
        "name": "Vendor Name",
        "email": "vendor@example.com",
        "description": "Vendor description"
      },
      "image": { /* image data */ },
      "review": [
        {
          "_id": "review_id",
          "star": 5,
          "review": "Great product!",
          "user": {
            "_id": "user_id",
            "name": "User Name",
            "email": "user@example.com"
          }
        }
      ]
    }
  }
  ```

#### Create Product (Vendor Only)

- **URL**: `/products`
- **Method**: `POST`
- **Auth Required**: Yes (Vendor)
- **Request Body**: Form data with the following fields:
  - `product[name]`: Product name
  - `product[description]`: Product description
  - `product[price]`: Product price
  - `product[category]`: Product category
  - `product[qty]`: Product quantity
  - `product[image]`: Product image file
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "vendorName": "vendor_id",
      "image": { /* image data */ }
    }
  }
  ```

#### Update Product (Vendor Only)

- **URL**: `/products/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Vendor)
- **URL Parameters**: `id` - Product ID
- **Request Body**: Form data with the following fields:
  - `product[name]`: Product name
  - `product[description]`: Product description
  - `product[price]`: Product price
  - `product[category]`: Product category
  - `product[qty]`: Product quantity
  - `product[image]`: Product image file (optional)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "product_id",
      "name": "Updated Product Name",
      "description": "Updated product description",
      "price": 89.99,
      "category": "Electronics",
      "vendorName": "vendor_id",
      "image": { /* image data */ }
    }
  }
  ```

#### Delete Product (Vendor Only)

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Vendor)
- **URL Parameters**: `id` - Product ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### User

#### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes (User)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "cart": [/* product IDs */],
      "orderHistory": [/* order objects */],
      "review": [/* review objects */]
    }
  }
  ```

#### Add to Cart

- **URL**: `/users/cart/:id`
- **Method**: `POST`
- **Auth Required**: Yes (User)
- **URL Parameters**: `id` - Product ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Product added to cart",
    "data": {
      "cart": [/* product IDs */],
      "sessionCart": [/* cart items */]
    }
  }
  ```

#### Get Cart

- **URL**: `/users/cart`
- **Method**: `GET`
- **Auth Required**: Yes (User)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "products": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "price": 99.99,
            /* other product fields */
          },
          "quantity": 1
        }
      ],
      "total": 99.99
    }
  }
  ```

### Vendor

#### Get Vendor Profile

- **URL**: `/vendors/profile`
- **Method**: `GET`
- **Auth Required**: Yes (Vendor)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "vendor_id",
      "name": "Vendor Name",
      "email": "vendor@example.com",
      "description": "Vendor description",
      "productList": [/* product objects */]
    }
  }
  ```

#### Get Vendor Products

- **URL**: `/vendors/products`
- **Method**: `GET`
- **Auth Required**: Yes (Vendor)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "category": "Electronics",
        "vendorName": "vendor_id",
        "image": { /* image data */ }
      }
    ]
  }
  ```

#### Update Vendor Profile

- **URL**: `/vendors/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Vendor)
- **URL Parameters**: `id` - Vendor ID
- **Request Body**: Form data with the following fields:
  - `name`: Vendor name
  - `description`: Vendor description
  - `image`: Vendor image file (optional)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "vendor_id",
      "name": "Updated Vendor Name",
      "email": "vendor@example.com",
      "description": "Updated vendor description",
      "productList": [/* product IDs */]
    }
  }
  ```

#### Delete Vendor Account

- **URL**: `/vendors`
- **Method**: `DELETE`
- **Auth Required**: Yes (Vendor)
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Vendor account deleted successfully"
  }
  ```

#### Get Vendor Reviews

- **URL**: `/vendors/reviews`
- **Method**: `GET`
- **Auth Required**: Yes (Vendor)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "review_id",
        "star": 5,
        "review": "Great product!",
        "user": {
          "_id": "user_id",
          "name": "User Name",
          "email": "user@example.com"
        },
        "product": {
          "_id": "product_id",
          "name": "Product Name"
        }
      }
    ]
  }
  ```

### Reviews

#### Get Product Reviews

- **URL**: `/reviews/product/:productId`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `productId` - Product ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "review_id",
        "star": 5,
        "review": "Great product!",
        "user": {
          "_id": "user_id",
          "name": "User Name",
          "email": "user@example.com"
        },
        "product": {
          "_id": "product_id",
          "name": "Product Name"
        }
      }
    ]
  }
  ```

#### Create Review

- **URL**: `/reviews/product/:productId`
- **Method**: `POST`
- **Auth Required**: Yes (User)
- **URL Parameters**: `productId` - Product ID
- **Request Body**:
  ```json
  {
    "star": 5,
    "review": "Great product!"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "review_id",
      "star": 5,
      "review": "Great product!",
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "product": {
        "_id": "product_id",
        "name": "Product Name"
      }
    }
  }
  ```

#### Update Review

- **URL**: `/reviews/:reviewId`
- **Method**: `PUT`
- **Auth Required**: Yes (User)
- **URL Parameters**: `reviewId` - Review ID
- **Request Body**:
  ```json
  {
    "star": 4,
    "review": "Updated review text"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "review_id",
      "star": 4,
      "review": "Updated review text",
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "product": {
        "_id": "product_id",
        "name": "Product Name"
      }
    }
  }
  ```

#### Delete Review

- **URL**: `/reviews/:reviewId`
- **Method**: `DELETE`
- **Auth Required**: Yes (User)
- **URL Parameters**: `reviewId` - Review ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Review deleted successfully"
  }
  ```

#### Get User Reviews

- **URL**: `/reviews/user`
- **Method**: `GET`
- **Auth Required**: Yes (User)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "review_id",
        "star": 5,
        "review": "Great product!",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": { /* image data */ }
        }
      }
    ]
  }
  ```

### Orders

#### Create Order

- **URL**: `/orders/checkout`
- **Method**: `POST`
- **Auth Required**: Yes (User)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "order_id",
      "orderProducts": [/* product IDs */],
      "customer": "user_id",
      "date": "2023-06-15",
      "total": 99.99
    }
  }
  ```

#### Get User Orders

- **URL**: `/orders/history`
- **Method**: `GET`
- **Auth Required**: Yes (User)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "order_id",
        "orderProducts": [/* product objects */],
        "customer": "user_id",
        "date": "2023-06-15",
        "total": 99.99
      }
    ]
  }
  ```

#### Get Vendor Orders

- **URL**: `/orders/vendor`
- **Method**: `GET`
- **Auth Required**: Yes (Vendor)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "order_id",
        "orderProducts": [/* product objects */],
        "customer": {
          "_id": "user_id",
          "name": "User Name",
          "email": "user@example.com"
        },
        "date": "2023-06-15",
        "total": 99.99
      }
    ]
  }
  ```

#### Get Order by ID

- **URL**: `/orders/:orderId`
- **Method**: `GET`
- **Auth Required**: Yes (User or Vendor)
- **URL Parameters**: `orderId` - Order ID
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "_id": "order_id",
      "orderProducts": [/* product objects */],
      "customer": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "date": "2023-06-15",
      "total": 99.99
    }
  }
  ```
