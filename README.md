

# Daily Puzzle

## Overview

Similarly to wordle, whoever visits the website will be prompted with a daily puzzle, and a new puzzle will be posted every day at 12 am (est, probably).

The site will let users sign in to track their scores, with total puzzles solved, and best streak. There is also a leaderboard with current best streak and most problems solved. Inspiration was taken from https://www.janestreet.com/puzzles/current-puzzle/, however I want to make the puzzle more solvable and quickly to solve, while having it posted every day rather than every month. 

There will also be a page to see past puzzles for each day, along with the solutions. 


## Data Model

The application will store Users, best streak, and a list of all problems that have been solved by that user (array of string items, of dates)

An Example User:

```javascript
{
  username: "funusername",
  hash: // a password hash,
  bestStreak: // an integer storing the user's best streak
  solved: // a String array storing dates of which puzzles that this user has solved
}
```

Example list: 
```javascript
["10-30-2023","10-31-2023", "11-2-2023"]
```


## [Link to Commented First Draft Schema](db.mjs) 

https://github.com/nyu-csci-ua-0467-001-002-fall-2023/final-project-ivan4722/blob/master/db.mjs

## Wireframes

![alt text](https://cdn.discordapp.com/attachments/1017249935562903612/1168638306473480345/IMG_2322.jpg?ex=65527e3c&is=6540093c&hm=be75cdfe575bc6d29e96c897d017c45be4126d74384a6055f5d1d0b34b05d598&)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

