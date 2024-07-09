1. Install nodejs on your system.
2. Install the required dependancies by opening the terminal in Personal_Blog folder and running the following command: 'npm i bcrypt connect-mongo cookie-parser dotenv ejs express express-ejs-layouts express-session jsonwebtoken method-override mongoose'
3. Install nodemon by running 'npm i nodemon --save-dev'
4. Sign In to your account on mongodb.com. Create a new project and get the connection string.
5. Create a .env file with the following content:
    MONGODB_URI = --connection string with the password--
    JWT_SECRET = --a secret word--
6. Run 'npm run dev' in the terminal.
7. Run the website by navigating to 'localhost:5000' in a browser window.
