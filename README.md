# Spotify Backend

This repository contains the backend setup for the Spotify project.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
- You have a running instance of [MongoDB](https://www.mongodb.com/).

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/spotify-backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd spotify-backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    ```

## Running the Application

1. Start the development server:
    ```sh
    npm run dev
    ```
2. The server will start on `http://localhost:5001`.
