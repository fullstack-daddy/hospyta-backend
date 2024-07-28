# Hospyta Backend API

This is the backend API for the Hospyta mobile application, built using Node.js, Express, and MongoDB. The API provides endpoints for user authentication, post management, and interactions such as upvoting, downvoting, and commenting on posts.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Posts](#posts)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.x or later)
- [npm](https://www.npmjs.com/get-npm) (v6.x or later) or [yarn](https://yarnpkg.com/getting-started/install) (v1.x or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/fullstack-daddy/hospyta-backend.git
cd hospyta-backend
```

2. Install the dependencies:

```bash
npm install
```

or

```bash
yarn install
```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

2. Update the values with your MongoDB URI, JWT secret, and Cloudinary credentials.

## Running the Application

To start the application in development mode:

```bash
npm run dev
```

or

```bash
yarn dev
```

The server will start on `http://localhost:5000`.

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

#### Register a New User

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60c72b2f9b1d8b0015e8c8f9",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2021-06-14T15:34:23.879Z",
      "updatedAt": "2021-06-14T15:34:23.879Z"
    },
    "token": "jwt_token"
  }
}
```

#### Login User

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60c72b2f9b1d8b0015e8c8f9",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

### Posts

#### Create a Post

```
POST /posts
```

**Headers:**
```
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "content": "This is a new post",
  "category": "General",
  "file": "image_file" // This is an actual file upload
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "This is a new post",
    "category": "General",
    "image": "image_url",
    "user": "60c72b2f9b1d8b0015e8c8f9",
    "upvotes": [],
    "downvotes": [],
    "comments": [],
    "createdAt": "2021-06-14T15:34:23.879Z",
    "updatedAt": "2021-06-14T15:34:23.879Z"
  }
}
```

#### Get All Posts

```
GET /posts
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60c72b2f9b1d8b0015e8c8fa",
      "content": "This is a new post",
      "category": "General",
      "image": "image_url",
      "user": "60c72b2f9b1d8b0015e8c8f9",
      "upvotes": [],
      "downvotes": [],
      "comments": [],
      "createdAt": "2021-06-14T15:34:23.879Z",
      "updatedAt": "2021-06-14T15:34:23.879Z"
    }
  ]
}
```

#### Update a Post

```
PUT /posts/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "content": "Updated content",
  "category": "Updated category",
  "file": "new_image_file" // Optional, this is an actual file upload
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60c72b2f9b1d8b0015e8c8fa",
    "content": "Updated content",
    "category": "Updated category",
    "image": "new_image_url",
    "user": "60c72b2f9b1d8b0015e8c8f9",
    "upvotes": [],
    "downvotes": [],
    "comments": [],
    "createdAt": "2021-06-14T15:34:23.879Z",
    "updatedAt": "2021-06-14T15:45:10.879Z"
  }
}
```

#### Delete a Post

```
DELETE /posts/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "message": "Post removed"
}
```

#### Upvote a Post

```
PUT /posts/:id/upvote
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60c72b2f9b1d8b0015e8c8fa",
    "content": "This is a new post",
    "category": "General",
    "image": "image_url",
    "user": "60c72b2f9b1d8b0015e8c8f9",
    "upvotes": ["60c72b2f9b1d8b0015e8c8f9"],
    "downvotes": [],
    "comments": [],
    "createdAt": "2021-06-14T15:34:23.879Z",
    "updatedAt": "2021-06-14T15:45:10.879Z"
  }
}
```

#### Downvote a Post

```
PUT /posts/:id/downvote
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60c72b2f9b1d8b0015e8c8fa",
    "content": "This is a new post",
    "category": "General",
    "image": "image_url",
    "user": "60c72b2f9b1d8b0015e8c8f9",
    "upvotes": [],
    "downvotes": ["60c72b2f9b1d8b0015e8c8f9"],
    "comments": [],
    "createdAt": "2021-06-14T15:34:23.879Z",
    "updatedAt": "2021-06-14T15:45:10.879Z"
  }
}
```

#### Add a Comment to a Post

```
POST /posts/:id/comments
```

**Headers:**
```
Authorization: Bearer jwt_token
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "This is a comment"
}
```

**Response:**
```json
{
  "success": true

,
  "data": {
    "id": "60c72b2f9b1d8b0015e8c8fa",
    "content": "This is a new post",
    "category": "General",
    "image": "image_url",
    "user": "60c72b2f9b1d8b0015e8c8f9",
    "upvotes": [],
    "downvotes": [],
    "comments": [
      {
        "user": "60c72b2f9b1d8b0015e8c8f9",
        "text": "This is a comment",
        "_id": "60c72b2f9b1d8b0015e8c8fb"
      }
    ],
    "createdAt": "2021-06-14T15:34:23.879Z",
    "updatedAt": "2021-06-14T15:45:10.879Z"
  }
}
```

#### Get Comments for a Post

```
GET /posts/:id/comments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "id": "60c72b2f9b1d8b0015e8c8f9",
        "name": "John Doe"
      },
      "text": "This is a comment",
      "_id": "60c72b2f9b1d8b0015e8c8fb"
    }
  ]
}
```

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message"
}
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

This `README.md` provides a comprehensive guide for setting up and running the project, as well as detailed documentation for each API endpoint. It should serve as a helpful resource for developers working on or using your backend API.
