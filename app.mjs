import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import expressSession from 'express-session';
import { postTweet } from './twitter.mjs';
import argon2 from 'argon2';
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

questions.set('113023', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('120123', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all star players from last year Chris and Andrew are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('120223', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally are in the same lab group this week? Enter your answer as a simplfied fraction.");
questions.set('120323', "My friend and I are hoping to meet for lunch. We each arrive at the restaurant at a random time between 12pm and 1pm, stay for 15 minutes, and leave (if we don't see each other). What is the probability we will meet each other while at the restaurant? For example, If I show up at 12:10 and my friend shows up at 12:19, we will meet. However, if I arrive at 12:50 and my friend shows up at 12:20, we will not meet. Enter your answer as a simplified fraction.");
questions.set('120423', "What is the probability that a random rearrangement of the letters in the word \"MATHEMATICS\" will begin with the letters \"MATH\"? Enter your answer as a simplified fraction.");
questions.set('120523', "A bag has 4 red and 6 blue marbles. A marble is selected and not replaced, then a second is selected. What is the probability that both are the same color? Enter your answer as a simplified fraction.");
questions.set('120623', "6 points are placed evenly around a circle labeled A,B,C,D,E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('120723', "How many distinct arrangements are there for the word TATTER?");
questions.set('120823', "How many distinct arrangements are there for the word PAPA?");
questions.set('120923', "How many 4-digit numbers have only odd digits?");
questions.set('121023', "A certain two-digit number is equal to twice the sum of its digits. What is the product of its digits?");

//repeating the questions until end of semester for grading

questions.set('121123', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('121223', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all-star players from last year, Chris and Andrew, are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('121323', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally, are in the same lab group this week? Enter your answer as a simplified fraction.");
questions.set('121423', "My friend and I are hoping to meet for lunch. We each arrive at the restaurant at a random time between 12 pm and 1 pm, stay for 15 minutes, and leave (if we don't see each other). What is the probability we will meet each other while at the restaurant? For example, if I show up at 12:10 and my friend shows up at 12:19, we will meet. However, if I arrive at 12:50 and my friend shows up at 12:20, we will not meet. Enter your answer as a simplified fraction.");
questions.set('121523', "What is the probability that a random rearrangement of the letters in the word 'MATHEMATICS' will begin with the letters 'MATH'? Enter your answer as a simplified fraction.");
questions.set('121623', "A bag has 4 red and 6 blue marbles. A marble is selected and not replaced, then a second is selected. What is the probability that both are the same color? Enter your answer as a simplified fraction.");
questions.set('121723', "6 points are placed evenly around a circle labeled A, B, C, D, E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('121823', "How many distinct arrangements are there for the word 'TATTER'?");
questions.set('121923', "How many distinct arrangements are there for the word 'PAPA'?");
questions.set('122023', "How many 4-digit numbers have only odd digits?");
questions.set('122123', "A certain two-digit number is equal to twice the sum of its digits. What is the product of its digits?");

questions.set('122223', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('122323', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all-star players from last year, Chris and Andrew, are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('122423', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally, are in the same lab group this week? Enter your answer as a simplified fraction.");
questions.set('122523', "My friend and I are hoping to meet for lunch. We each arrive at the restaurant at a random time between 12 pm and 1 pm, stay for 15 minutes, and leave (if we don't see each other). What is the probability we will meet each other while at the restaurant? For example, if I show up at 12:10 and my friend shows up at 12:19, we will meet. However, if I arrive at 12:50 and my friend shows up at 12:20, we will not meet. Enter your answer as a simplified fraction.");
questions.set('122623', "What is the probability that a random rearrangement of the letters in the word 'MATHEMATICS' will begin with the letters 'MATH'? Enter your answer as a simplified fraction.");
questions.set('122723', "A bag has 4 red and 6 blue marbles. A marble is selected and not replaced, then a second is selected. What is the probability that both are the same color? Enter your answer as a simplified fraction.");
questions.set('122823', "6 points are placed evenly around a circle labeled A, B, C, D, E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('122923', "How many distinct arrangements are there for the word 'TATTER'?");
questions.set('123023', "How many distinct arrangements are there for the word 'PAPA'?");
questions.set('123123', "How many 4-digit numbers have only odd digits?");
questions.set('010124', "A certain two-digit number is equal to twice the sum of its digits. What is the product of its digits?");



const answers = new Map();

answers.set('113023', "12");
answers.set('120123', "120");
answers.set('120223', "1/91");
answers.set('120323', "7/16");
answers.set('120423', "1/990");
answers.set('120523', "7/15");
answers.set('120623', "3/10");
answers.set('120723', "120");
answers.set('120823', "6");
answers.set('120923', "625");
answers.set('121023', "8");

answers.set('121123', "12");
answers.set('121223', "120");
answers.set('121323', "1/91");
answers.set('121423', "7/16");
answers.set('121523', "1/990");
answers.set('121623', "7/15");
answers.set('121723', "3/10");
answers.set('121823', "120");
answers.set('121923', "6");
answers.set('122023', "625");
answers.set('122123', "8");

answers.set('122223', "12");
answers.set('122323', "120");
answers.set('122423', "1/91");
answers.set('122523', "7/16");
answers.set('122623', "1/990");
answers.set('122723', "7/15");
answers.set('122823', "3/10");
answers.set('122923', "120");
answers.set('123023', "6");
answers.set('123123', "625");
answers.set('010124', "8");


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
    try 
    {
        const existingUser = await User.findOne({ username });
        if (existingUser) 
        {
            const wrong = 'Username taken.';
            return res.render('register', { wrong });
        }
        const hashedPassword = await argon2.hash(password);

        const user = new User({ username, password: hashedPassword, totalSolved: 0, solved: [] });
        await user.save();

        res.redirect('/login');
    } catch (err) {
        res.status(400).send('Error registering the user.');
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user) {
            const passwordMatch = await argon2.verify(user.password, password);

            if (passwordMatch) {
                req.session.user = { user: username }; 
                res.redirect('/');
            } else {
                const wrong = 'Incorrect username or password.';
                res.render('login', { wrong });
            }
        } else {
            const wrong = 'Incorrect username or password.';
            res.render('login', { wrong });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in.');
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

app.listen(process.env.PORT ?? 3000);