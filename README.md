

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

![alt text](https://media.discordapp.net/attachments/599673872408772660/1168640655266959370/IMG_2323.jpg?ex=6552806c&is=65400b6c&hm=e3282bb73d34f406358df1286f807f9c747fe8534f063baa85fff0846d28218f&=&width=752&height=1004)
![alt text](https://media.discordapp.net/attachments/599673872408772660/1168640655862530140/IMG_2324.jpg?ex=6552806c&is=65400b6c&hm=19d8bbc56950c417f7b6855ad73d502f0f5f5c7be02d7b16ba6ba019687d6ccc&=&width=752&height=1004)

## Site map

![alt text](https://media.discordapp.net/attachments/599673872408772660/1169322316606480484/IMG_2334.jpg?ex=6554fb45&is=65428645&hm=eddc7857b803586d12777a37b110a14d4e332738c20d85afa8c7f5d7034285de&=&width=752&height=1004)

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as non-registered and registered user, I can view the leaderboard
3. as non-registered and registered user, I can answer the question
4. as non-registered and registered user, I can view past questions and their solutions
5. as a user, I can log in to the site
6. as a user, I can answer and track the questions I have answered correctly
7. as a user, I can see my name on the leaderboard

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

8 points total out of 10 required points (___TODO__: addtional points will __not__ count for extra credit)

I will look into the other topics for other research topics, I decided to not do react. 


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