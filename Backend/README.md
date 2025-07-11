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

---

## Captain Registration & Login Endpoints

## POST /captains/register

### Description
Registers a new captain by providing personal and vehicle details. Returns a JWT token and captain information upon success.

### Request Body
The request body must be in JSON format and include:
- `email` (string, required): Captain's email address.
- `fullname` (object, required):
  - `firstname` (string, required): First name (min 3 characters).
  - `lastname` (string, required): Last name (min 3 characters).
- `password` (string, required): Password (min 6 characters).
- `vehicle` (object, required):
  - `color` (string, required): Vehicle color (min 3 characters).
  - `plate` (string, required): Vehicle plate (min 3 characters).
  - `capacity` (integer, required): Vehicle capacity (min 1).
  - `vehicleType` (string, required): One of `car`, `motorcycle`, `auto`.

#### Example Request
```json
{
  "email": "captain@example.com",
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "password": "securepassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses
- **201 Created**: Captain registered successfully.
  ```json
  {
    "token": "jwt_token_here",
    "captain": {
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **400 Bad Request**: Validation errors or captain already exists.
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email address",
        "param": "email"
      }
    ]
  }
  ```
  or
  ```json
  {
    "message": "Captain already exists"
  }
  ```

### Status Codes
- `201`: Captain created successfully.
- `400`: Bad request due to validation errors or existing captain.

---

## POST /captains/login

### Description
Authenticates a captain using email and password. Returns a JWT token and captain information if successful.

### Request Body
- `email` (string, required): Captain's email.
- `password` (string, required): Captain's password.

#### Example Request
```json
{
  "email": "captain@example.com",
  "password": "securepassword"
}
```

### Responses
- **200 OK**: Login successful.
  ```json
  {
    "token": "jwt_token_here",
    "captain": {
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **400 Bad Request**: Validation errors.
  ```json
  {
    "errors": [
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password"
      }
    ]
  }
  ```
- **401 Unauthorized**: Invalid email or password.
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

## GET /captains/profile

### Description
Returns the authenticated captain's profile information.

### Authentication
- Requires authentication (JWT token in cookie or `Authorization: Bearer <token>` header).

### Responses
- **200 OK**: Returns captain profile.
  ```json
  {
    "captain": {
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- **401 Unauthorized**: Missing or invalid token.
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Status Codes
- `200`: Profile fetched successfully.
- `401`: Unauthorized, invalid or missing token.

---

## GET /captains/logout

### Description
Logs out the authenticated captain by clearing the authentication token and blacklisting it.

### Authentication
- Requires authentication (JWT token in cookie or `Authorization: Bearer <token>` header).

### Responses
- **200 OK**: Logout successful.
  ```json
  {
    "message": "Logout successfully"
  }
  ```
- **401 Unauthorized**: Missing or invalid token.
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Status Codes
- `200`: Logout successful.
- `401`: Unauthorized, invalid or missing token.