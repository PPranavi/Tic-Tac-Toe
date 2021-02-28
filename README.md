# Project 2
This is a live multiplayer game in the browser - Tic Tac Toe! The goal of this project is to build a complex web app with more client-server 
interaction and database persistence. I am using Flask and React to build this game and display consistent information to all users.

## Heroku App Link
[Click here to play the game!](https://peaceful-tor-81462.herokuapp.com/)

## Copy this repo
1. On your GitHub account, create a new repository
2. In the terminal of your home directory, clone this repo: `git clone https://github.com/NJIT-CS490-SP21/project2-pp668.git`
3. Change the current working directory into the cloned directory and you should see all of these project files
4. Connect this cloned repo to your GitHub repo from Step 1: `git remote set-url origin https://www.github.com/{your-username}/{your-repo-name}`
5. Push the local repo to the remote repo: `git push origin main`

## Requirements
In your terminal:
1. `pip install python-dotenv`
2. `pip install requests`
3. `pip install -U Flask`
4. `npm install -g heroku`
5. `pip install -U flask-cors`
6. `pip install flask-socketio`
7. `npm install`
8. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Heroku Deployment
1. Create an account on Heroku: [Sign up for a free account](https://signup.heroku.com/login)
2. Create a `Procfile` in your main directory and add the commands that Heroku needs to use to run your app: `python app.py`
3. Add and commit all of the files using git
4. Login got your Herohu account on your terminal: `heroku login -i`
5. Create a Heroku app: `heroku create --buildpack heroku/python`
6. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
7. Push all code to Heroku: `git push heroku main`
8. Go to your [Heroku dashboard](https://dashboard.heroku.com/apps) and open your application's settings
9. Run your application in you terminal: `heroku open`

## Known Problems
1. When a player restarts a game, the board is cleared only for that user but not all other users viewing/playing on the website. I attempted to solve this problem but I have yet to figure out a way to emit the board to the server and send it back to the client to display the empty board across all users. This problem still persists because of the way I setup the restartGame function in my code. If I had more time, I would rewrite my function to render the restart button after I emit the empty board to the server side.
2. If users who are interested in viewing a game or playing the game are not on the borwser by the time the first user enters his/her username, the game will not work as expected. If I had more time, I would emit the users who have already logged on from the client to the server and have the server emit the logged users list to the client for new users who connect to the game.

## Technical Issues
1. I had a hard time working with React because I was running into "too many re-render" errors while working on the code. This error came up often because I had code outside of function blocks in my main export function. I still don't really understand why I could not have code (like if statements, for loops) outside of my helper function code blocks, but after doing some research on stackoverflow and looking at Slack for help, I understood why the error kept coming up. I modified my code so that all of the code was in either helper functions or the return statement and that seemed to fix my problem. 
2. Socket IO was super interesting when we first learned it in class but it slowly became a pain to use with this game app. Since I didn't know that state variable take a bit of time to update, I attempted to send state variables through the socket and expected all updated data to show up on all browsers. However, this was not the case when I first started working on my code. I worked around this issue by debugging very aggressively. I entered console.log() statements everywhere in my code to see the status of my state variables as well as the server side variables. After debugging this way, I relaized that the state variables were not being updated by the time the code reached the socket emit line. I realized that i had to emit only constant information and that did the trick. At the end of the day, debugging using developer tools and console.log() statements helped me get through the issues I was facing.