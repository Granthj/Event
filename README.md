# Event Booking App

An event booking application built with React for the frontend, GraphQL for the API, Mongoose for MongoDB data management, and Razorpay for payment processing.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Features

- User authentication and authorization
- Event creation and management
- Booking events
- Payment processing with Razorpay
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine
- MongoDB installed and running
- Razorpay account for payment processing

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/event-booking-app.git
   cd event-booking-app
## Running the Application
   - npm start [Frontend]
   - node app.js OR nodemon app.js [Backend]
## Usage
   - Open your browser and go to http://localhost:1234 to see the frontend.
   - Use a GraphQL client or http://localhost:7000/graphql to interact with the GraphQL API.
## Project Structure

         event-booking-app/
      │
      ├── backend/
      │   ├── models/
      │   ├── resolvers/
      │   ├── schema/
      |   ├── utils/
      │   ├── app.js
      │   └── ...
      │
      ├── frontend/
      │   ├── components/
      │   ├── utils/
      │   ├── css
      │   ├── app.js
      |   ├── index.html
      │   
      │
      └── README.md

 ## Technologies Used
    Backend
      - Node.js
      - Express.js
      - GraphQL
      - Mongoose (MongoDB)
      - Razorpay
    Frontend
      - React
      - Context API
      - Parcel (Web Bundler)
