

# Daily Puzzle

## Overview

Similarly to wordle, whoever visits the website will be prompted with a daily puzzle, and a new puzzle will be posted every day at the same time.

Check out the website here: http://4722hq.com:4000/
Upon solving a question, you will be congragulated with a tweet here: https://twitter.com/ivan4722 (if signed in)

The site will let users sign in to track their scores, with total puzzles solved, and best streak. There is also a leaderboard with current best streak and most problems solved. Inspiration was taken from wordle and https://www.janestreet.com/puzzles/current-puzzle/, however I want to make the puzzle more solvable and quickly to solve, while having it posted every day rather than every month. 

There will also be a page to see past puzzles for each day, along with the solutions. 


## Data Model

The application will store Users, best streak, and a list of all problems that have been solved by that user (array of string items, of dates)

An Example User:

```javascript
{
  username: "funusername",
  password: password123
  totalSolved: // an integer storing the user's best streak
  solved: // a String array storing dates of which puzzles that this user has solved
}
```

Example list: 
```javascript
["10-30-2023","10-31-2023", "11-2-2023"]
```
## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as non-registered and registered user, I can view the leaderboard
3. as non-registered and registered user, I can answer the question
4. as a user, I can log in to the site
5. as a user, I can see my name on the leaderboard
6. as a non-registered and registered user, I can suggest a question

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (3 points) Twitter API
    * I'm going to use the twitter API to post when a user solves a puzzle.
* (1 point) Luxon API 
    * I'm also going to use Luxon so that the puzzle is posted at the same time everyday (EST Time)
* (2 points) SemanticUI
    * I want my website to be aesthetically pleasing, so I will use semantic UI custom css to do so.
* (3 points) Perform client side form validation using custom JavaScript or JavaScript library
    * I dont want users to just make their password like "a" or something redundant, so I will ensure users submit passwords with constraints through the registration form and display error messages through dom manipulation.
* (1 points) Lodash
    * I was exploring array operations and stumbled upon the Lodash library, and thought it was interesting how many operations there were, although I might not implement any of the special operations 

10 points total out of 10 required points (___TODO__: addtional points will __not__ count for extra credit)

## [Link to Initial Main Project File](app.mjs) 

https://github.com/nyu-csci-ua-0467-001-002-fall-2023/final-project-ivan4722/blob/master/app.mjs

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [semanticUI docs](https://semantic-ui.com/)
2. [reactjs examples](https://legacy.reactjs.org/community/examples.html)
3. [form verification through the dom](https://www.w3schools.com/jsref/dom_obj_form.asp)
4. [twitter API](https://developer.twitter.com/en/docs/twitter-api)
5. [semantic UI css](https://cdnjs.com/libraries/semantic-ui)
6. [lodash docs](https://lodash.com/docs/)
7. [luxon docs](https://moment.github.io/luxon/api-docs/index.html)
