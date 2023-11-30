# Bowling Game Scorekeeper

## Overview
This Node.js application is a backend service designed to manage and score a ten-pin bowling game. It faithfully implements standard bowling scoring rules, including special handling for strikes, spares, and the unique conditions of the tenth frame.

## Features
- **Roll Recording:** Track each roll with validation to ensure the pins knocked down in each frame adhere to bowling rules.
- **Score Calculation:** Automatic and real-time calculation of scores, including frame-by-frame and total scores.
- **Game Completion Check:** Determines when a game is officially completed based on the number of rolls and frames played.
- **Special Tenth Frame Logic:** Handles the special rules for the tenth frame in bowling, allowing for up to three rolls if a strike or spare is scored.

## Technologies Used
- **Node.js:** The core technology used for the backend server.
- **MongoDB:** Utilized for persisting game data and scores.
- **Express.js:** A web application framework for Node.js, used for handling HTTP requests and responses.

## Setup and Running the Application
1. **Clone the Repository:**
git clone https://github.com/DorVaknin/BowlingGameScore.git
2. **Install Dependencies:**
Navigate to the project directory and run:
npm install
3. **Start the Server:**
npm start

4. **Accessing the API:**
The API can be accessed at `http://localhost:3000/`

## API Endpoints
- `POST /api/game/rolls`: Record a new roll.
- `POST /api/game/start`: Creates a new game.

## Testing
Run the test suite using:
npm test


## Author
Dor Vaknin
