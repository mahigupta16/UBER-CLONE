# Captain Registration & Login Endpoints

## POST /captains/register

### Description
Registers a new captain by providing personal and vehicle details. Returns a JWT token and captain information upon success.

### Request Body
JSON object with the following fields:
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

---

## GET /captains/profile

### Description
Returns the authenticated captain's profile information.

### Authentication
- Requires JWT token (cookie or `Authorization: Bearer <token>` header).

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

---

## GET /captains/logout

### Description
Logs out the authenticated captain by clearing the authentication token and blacklisting it.

### Authentication
- Requires JWT token (cookie or `Authorization: Bearer <token>` header).

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