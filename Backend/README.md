# User Registration Endpoint

## Endpoint
POST /users/register

## Description
This endpoint allows a new user to register by providing their email, first name, last name, and password. Upon successful registration, a JSON Web Token (JWT) is generated and returned for authentication.

## Request Body
The request body must be in JSON format and include the following fields:

- `email` (string, required): The email address of the user. Must be a valid email format.
- `fullname` (object, required): An object containing the user's name.
  - `firstname` (string, required): The first name of the user. Must be at least 3 characters long.
  - `lastname` (string, required): The last name of the user. Must be at least 3 characters long.
- `password` (string, required): The password for the user account. Must be at least 6 characters long.

### Example Request
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "securepassword"
}

## Responses
- **201 Created**: User successfully registered. Returns the generated token and user information.
  - Example Response:
  {
    "token": "jwt_token_here",
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "user@example.com"
    }
  }

- **400 Bad Request**: If the request body is invalid or if the user already exists.
  - Example Response:
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email"
      }
    ]
  }

## Status Codes
- `201`: User created successfully.
- `400`: Bad request due to validation errors or existing user.