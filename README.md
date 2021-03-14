# Project 2

This is a live multiplayer game in the browser - Tic Tac Toe! The goal of this project is to build a complex web app with more client-server
interaction and database persistence. I am using Flask and React to build this game and display consistent information to all users.

## Heroku App Link

[Click here to play the game!](https://immense-woodland-21512.herokuapp.com/)

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
9.

## Setup

1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Database Setup

1. `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`
2. `sudo service postgresql initdb`
3. `sudo service postgresql start`
4. `sudo -u postgres createuser --superuser $USER` If you get an error saying "could not change directory", that's okay! It worked!
5. `sudo -u postgres createdb $USER` If you get an error saying "could not change directory", that's okay! It worked!
6. Make a new user:
   a) `psql` (if you already quit out of psql)
   b) Type this with your username and password (DONT JUST COPY PASTE): `create user some_username_here superuser password 'some_unique_new_password_here'`; e.g. create user pranavi superuser password 'mysecretpassword123';
   c) \q to quit out of sql
7. Save your username and password in a sql.env file with the format SQL_USER= and SQL_PASSWORD=.
8. To use SQL in Python: pip install psycopg2-binary
9. pip install Flask-SQLAlchemy==2.1

## Heroku Setup

1. Create an account on Heroku: [Sign up for a free account](https://signup.heroku.com/login)
2. Login and fill creds: heroku login -i
3. Create a new Heroku app: heroku create
4. Create a new remote DB on your Heroku app: heroku addons:create heroku-postgresql:hobby-dev (If that doesn't work, add a -a {your-app-name} to the end of the command, no braces)
5. See the config vars set by Heroku for you: heroku config. Copy paste the value for `DATABASE_URL`
6. Set the value of `DATABASE_URL` as an environment variable by entering this in the terminal: `export DATABASE_URL='copy-paste-value-in-here'`

## Initialize Database

1. In the terminal, run `python` to open an interactive session
2. One by one, add the following lines:
`from app import DB`
`import models`
`DB.create_all()`
`admin = models.Person(username='admin', rank=100)`
`DB.session.add(admin)`
`DB.session.commit()`
3. To make sure this worked, run the following line in the same interactive session (If you see the admin as a Person entry, then it worked!):
`models.Person.query.all()`
4. To make sure that this user was added to the Heroku database, connect to it using `heroku pg:psql`
5. To see all tables, run the command `\d`; the person table should be in there
6. To query the data in the person table, run the query `SELECT * FROM person;`; the admin user should be in there


## Run Application

1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Heroku Deployment

1. Add and commit all of the files using git
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/python`
4. Push all code to Heroku: `git push heroku main`
5. Go to your [Heroku dashboard](https://dashboard.heroku.com/apps) and open your application's settings
6. Run your application in you terminal: `heroku open`

## Known Problems

1. When there are too many users, the sqlalchemy operation stops working due to too many connections for one user. When I searched the error to this problem, I read that this is an Operational Error that is not neccessarily controlled by the programmer. When SQLAlchemy stops functioning, my leaderboard doesn't work along withe the score update. If I had more time, I would refine my code so that too many retrievals aren't pushed out from the client-server programs, if this is a possible fix to the solution.
2. Sometimes, Heroku does not update board changes or leaderboard changes fast enough. This may be due to too much traffic on the site but I am not sure what the cause of the problem is. In this case, testing whether my app is functional using the Heroku site might not give you the most transparent results. Thus, it would be best to test the code by downloading the files and running it locally.

## Technical Issues

1. I had a really hard time with too many socket emits. In my client side Board.js app, when the winner is idenitfied, I intended to emit the winner's and loser's usernames so tjat the srver could update scores accordingly. However, I saw that the function was emiiting the socket functions repeatedly. I have yet to understand why this was happening, but I did find a solution by adding a flag in my server code. The flag I added ensured that an update ran only once after a winner was identitified in the current game.
2. I struggled with the leaderboard tabel creation as well. I was not sending my database entries properly to the client because I was attempting to create a table using a dictionary. I found this task to be too difficult to do in javascript. So, I worked around this issue by formatting my database dictionary as an 2D array on my server side before emitting it to the client to be formatted into a table. This seemed to fix the problem and my table was being rendered as expected.
