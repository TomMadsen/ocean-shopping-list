HEROKU DEPLOYMENT

1 - create an empty app
"heroku create ________"   
  // __ = app-name

2 - create a free development database for the app
"heroku addons:create heroku-postgresql:hobby-dev -a ______________"  
  // -a = app, ___ = app-name

3 - login to the database
"heroku pg:psql -a _________"

4 - create tables as per schema - or at once using 'cat' command as follows:
    (not logged in to database, but in the root app directory terminal)
"cat schema.sql | heroku pg:psql -a ocean-shopping-list"

5 - set heroku as a git remote repo
"heroku git:remote -a ocean-shopping-list"

6 - push to heroku
"git push heroku master"