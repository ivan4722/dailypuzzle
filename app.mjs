import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import expressSession from 'express-session';
import { postTweet } from './twitter.mjs';
import argon2 from 'argon2';

// Example: Post a tweet
const tweetText = 'Hello, Twitter! This is my first tweet using the Twitter API and JavaScript. #TwitterAPI';

postTweet(tweetText);

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
questions.set('112023', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('112123', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all star players from last year Chris and Andrew are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('112223', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally are in the same lab group this week? Enter your answer as a simplfied fraction.");
questions.set('112323', "My friend and I are hoping to meet for lunch. We each arrive at the restaurant at a random time between 12pm and 1pm, stay for 15 minutes, and leave (if we don't see each other). What is the probability we will meet each other while at the restaurant? For example, If I show up at 12:10 and my friend shows up at 12:19, we will meet. However, if I arrive at 12:50 and my friend shows up at 12:20, we will not meet. Enter your answer as a simplified fraction.");
questions.set('112423', "What is the probability that a random rearrangement of the letters in the word \"MATHEMATICS\" will begin with the letters \"MATH\"? Enter your answer as a simplified fraction.");
questions.set('112523', "A bag has 4 red and 6 blue marbles. A marble is selected and not replaced, then a second is selected. What is the probability that both are the same color? Enter your answer as a simplified fraction.");
questions.set('112623', "6 points are placed evenly around a circle labeled A,B,C,D,E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('112723', "8+8");
questions.set('112823', "9+9");
questions.set('112923', "10+10");
questions.set('113023', "11+11");
questions.set('120123', "12+12");

const answers = new Map();

answers.set('112023', "12");
answers.set('112123', "120");
answers.set('112223', "1/91");
answers.set('112323', "7/16");
answers.set('112423', "1/990");
answers.set('112523', "7/15");
answers.set('112623', "3/10");
answers.set('112723', "16");
answers.set('112823', "18");
answers.set('112923', "20");
answers.set('113023', "22");
answers.set('113123', "24");

// set up express static
import url from 'url';
import path from 'path';
import { ppid } from 'process';
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
    let leaderboard = await User.find().sort({ totalSolved: -1 });
    leaderboard = leaderboard.map(user => ({ //higher order function 1
        username: user.username,
        totalSolved: user.totalSolved,
      }));
    leaderboard = leaderboard.filter(user => user.totalSolved > 0); //higher order function 2
    console.log(leaderboard);
    if(req.query.name)
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

    console.log(d);
    //console.log(d);
    let today = questions.get(d);
    //-------------------------------------------------------------------//
    if(req.query.solution == answers.get(d))
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
    const {suggestion,name}=req.body;
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