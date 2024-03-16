import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import expressSession from 'express-session';
import { postTweet } from './twitter.mjs';
import _ from 'lodash';

const User = mongoose.model('user');
const Suggestion = mongoose.model('suggestion');

const app = express();
app.use(expressSession({
    secret: 'a',
    resave: false,
    saveUninitialized: true
  }));


const questions = new Map();
//questions from Introduction to Counting & Probability by David Patrick
//and https://www.northsouth.org/app11/docs/coaching/docs/Solutions%20to%20Pre-Test_AMC_AIME%20PrepClub.pdf

questions.set('030524', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('030624', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all star players from last year Chris and Andrew are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('030724', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally are in the same lab group this week? Enter your answer as a simplfied fraction.");
questions.set('030824', "My friend and I are hoping to meet for lunch. We each arrive at the restaurant at a random time between 12pm and 1pm, stay for 15 minutes, and leave (if we don't see each other). What is the probability we will meet each other while at the restaurant? For example, If I show up at 12:10 and my friend shows up at 12:19, we will meet. However, if I arrive at 12:50 and my friend shows up at 12:20, we will not meet. Enter your answer as a simplified fraction.");
questions.set('030924', "What is the probability that a random rearrangement of the letters in the word \"MATHEMATICS\" will begin with the letters \"MATH\"? Enter your answer as a simplified fraction.");
questions.set('031024', "A bag has 4 red and 6 blue marbles. A marble is selected and not replaced, then a second is selected. What is the probability that both are the same color? Enter your answer as a simplified fraction.");
questions.set('031124', "6 points are placed evenly around a circle labeled A,B,C,D,E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('031224', "How many distinct arrangements are there for the word TATTER?");
questions.set('031324', "How many distinct arrangements are there for the word PAPA?");
questions.set('031424', "How many 4-digit numbers have only odd digits?");
questions.set('031524', "A certain two-digit number is equal to twice the sum of its digits. What is the product of its digits?");
questions.set('031624', "A police department in a small city consists of 10 officers. If the department policy is to have 5 of the officers patrolling the streets, 2 of the officers working full time at the station, and 3 of the officers on reserve at the station, how many different divisions of the 10 officers into the 3 groups are possible?");
questions.set('031724', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all-star players from last year, Chris and Andrew, are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('031824', "A committee of 3 is to be formed from a group of 20 people. How many different committees are possible?");
questions.set('031924', "How many different 7-place license plates are possible if the first 3 places are to be occupied by letters and the final 4 by numbers?");
questions.set('032024', "Suppose that we have 3 cards that are identical in form, except that both sides of the first card are colored red, both sides of the second card are colored black, and one side of the third card is colored red and the other side black. The 3 cards are mixed up in a hat, and 1 card is randomly selected and put down on the ground. If the upper side of the chosen card is colored red, what is the probability that the other side is colored black?");
questions.set('032124', "A bin contains 3 types of disposable flashlights. The probability that a type 1 flashlight will give more than 100 hours of use is .7, with the corresponding probabilities for type 2 and type 3 flashlights being .4 and .3, respectively. Suppose that 20 percent of the flashlights in the bin are type 1, 30 percent are type 2, and 50 percent are type 3. What is the probability that a randomly chosen flashlight will give more than 100 hours of use? Enter a decimal.");

const answers = new Map();

answers.set('030524', "12");
answers.set('030624', "120");
answers.set('030724', "1/91");
answers.set('030824', "7/16");
answers.set('030924', "1/990");
answers.set('031024', "7/15");
answers.set('031124', "3/10");
answers.set('031224', "120");
answers.set('031324', "6");
answers.set('031424', "625");
answers.set('031524', "8");
answers.set('031624', "2520");
answers.set('031724', "252");
answers.set('031824', "1140");
answers.set('031924', "175760000");
answers.set('032024', "1/3");
answers.set('032124', "0.41");

console.log("running");

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

app.use(express.urlencoded({ extended: false }));
// configure templating to hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/leaderboard', async (req,res)=>
{
    let user = req.session.user;
    let leaderboard = await Promise.resolve(User.find()).then(users => _.sortBy(users, 'totalSolved').reverse());
    leaderboard = leaderboard.map(user => ({ //higher order function 1
        username: user.username,
        totalSolved: user.totalSolved,
      }));
    leaderboard = leaderboard.filter(user => user.totalSolved > 0); //higher order function 2
    if(req.query.name) //form 1
    {
      leaderboard = leaderboard.filter(f => f.username.includes(req.query.name));
    }
    res.render('leaderboard', {leaderboard,user})
})
app.get('/', async (req,res)=>
{
    //console.log("user:",req.session.user);
    let user = req.session.user;
    //--------------------------------time zone config-----------------------------------//
    const dateTime = DateTime.now().setZone('America/New_York');

    const month = dateTime.month.toString().padStart(2, '0');
    const day = dateTime.day.toString().padStart(2, '0');
    const year = dateTime.year.toString().slice(-2);

    const d = `${month}${day}${year}`;
    let today;
    let sol;
    if(questions.has(d))
    {
        today = questions.get(d);
    }
    else
    {
        today = "How many 3 digit numbers are not multiples of 7?";
    }
    if(answers.has(d))
    {
        sol = answers.get(d);
    }
    else
    {
        sol = 772;
    }
    //-------------------------------------------------------------------//
    if(req.query.solution == sol) //form 2
    {

        let ans = req.query.solution;
        if(user)
        {
            let name = user.user;
            const filter = { username: name }
            const a = await User.findOne(filter);
            if(!a.solved.includes(today))
            {
                const update = {$push: { solved: today}};
                const update2 = {$inc: {totalSolved: 1}};
                await User.updateOne(filter, update);
                await User.updateOne(filter, update2);
                postTweet("congrats to "+name+" for solving today's puzzle!");
            }
            
        }
        res.render('correct',{ans,user});
    }
    else if(req.query.solution && req.query.solution != answers.get(d))
    {
        const wrong = "wrong answer";
        res.render('home',{today,wrong,user});
    }
    else
    {
        const wrong = ''
        res.render('home',{today,wrong,user});
    }
})
app.get('/login', (req,res)=>
{
    res.render('login');
})
app.get('/register', (req,res)=>
{
    res.render('register');
})
app.post('/register', async (req, res) => 
{
    const { username, password } = req.body;
    const user = new User({ username, password, totalSolved: 0, solved: [] });
  
    try 
    {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const wrong = 'Username taken.'
            return res.render('register', {wrong});
          }
        await user.save();
        res.redirect('/login');
    } 
    catch (err) 
    {
        res.status(400).send('Error registering the user.');
    }
});
app.post('/login', async (req, res) => 
{
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        // Successful login
        req.session.user = {user: username};
        res.redirect('/');
      } else {
          const wrong = "incorrect username or password"
        res.render('login', {wrong});
      }
    } catch (err) {
      res.status(400).send('Error logging in.');
    }
});
app.get('/logout',(req,res)=>
{
    req.session.user = undefined;
    res.redirect('/');
});
app.get('/suggest',(req,res)=>
{
    res.render('suggest');
});
app.post('/suggest', async (req,res)=>
{
    const {suggestion,name}=req.body; //form 3
    console.log(req.body);
    const s = new Suggestion({suggestion,name});
    await s.save();
    res.redirect('/thankyou');
});
app.get('/thankyou', (req,res)=>
{
    res.render('thankyou');
})
const port12 = process.env.PORT || 3000;

app.listen(port12, () => {
  console.log(`now listening on port ${port12}`);
});

