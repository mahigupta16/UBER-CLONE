# User Registration & Login Endpoints

## POST /users/register

### Description
This endpoint allows a new user to register by providing their email, first name, last name, and password. Upon successful registration, a JSON Web Token (JWT) is generated and returned for authentication.

### Request Body
The request body must be in JSON format and include the following fields:

- `email` (string, required): The email address of the user. Must be a valid email format.
- `fullname` (object, required): An object containing the user's name.
  - `firstname` (string, required): The first name of the user. Must be at least 3 characters long.
  - `lastname` (string, required): The last name of the user. Must be at least 3 characters long.
- `password` (string, required): The password for the user account. Must be at least 6 characters long.

#### Example Request
```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "securepassword"
}
```

### Responses
- **201 Created**: User successfully registered. Returns the generated token and user information.
  ```json
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
  ```
- **400 Bad Request**: If the request body is invalid or if the user already exists.
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email"
      }
    ]
  }
  ```

### Status Codes
- `201`: User created successfully.
- `400`: Bad request due to validation errors or existing user.

---

## POST /users/login

### Description
This endpoint allows an existing user to log in using their email and password. If the credentials are valid, a JWT token and user information are returned.

### Request Body
The request body must be in JSON format and include the following fields:

- `email` (string, required): The user's email address. Must be a valid email format.
- `password` (string, required): The user's password. Must be at least 6 characters long.

#### Example Request
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Responses
- **200 OK**: Login successful. Returns the generated token and user information.
  ```json
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
  ```
- **400 Bad Request**: If the request body is invalid.
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email"
      }
    ]
  }
  ```
- **401 Unauthorized**: If the email or password is incorrect.
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Status Codes
- `200`: Login successful.
- `400`: Bad request due to validation errors.
- `401`: Unauthorized, invalid credentials.

---

## GET /users/profile

### Description
This endpoint returns the authenticated user's profile information. The request must include a valid JWT token (sent via cookie or Authorization header).

### Authentication
- Requires authentication (JWT token in cookie or `Authorization: Bearer <token>` header).

### Responses
- **200 OK**: Returns the user's profile information.
  ```json
  {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "user@example.com"
  }
  ```
- **401 Unauthorized**: If the token is missing or invalid.
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Status Codes
- `200`: Profile fetched successfully.
- `401`: Unauthorized, invalid or missing token.

---

## GET /users/logout

### Description
This endpoint logs out the authenticated user by clearing the authentication token cookie and blacklisting the token.

### Authentication
- Requires authentication (JWT token in cookie or `Authorization: Bearer <token>` header).

### Responses
- **200 OK**: Logout successful.
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **401 Unauthorized**: If the token is missing or invalid.
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Status Codes
- `200`: Logout successful.
- `401`: Unauthorized, invalid or missing token.