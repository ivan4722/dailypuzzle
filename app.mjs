import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import { postTweet } from './twitter.mjs';

// Example: Post a tweet
const tweetText = 'Hello, Twitter! This is my first tweet using the Twitter API and JavaScript. #TwitterAPI';

postTweet(tweetText);

const User = mongoose.model('user');

const app = express();
app.use(expressSession({
    secret: 'a',
    resave: false,
    saveUninitialized: true
  }));


const questions = new Map();
//questions from Introduction to Counting & Probability by David Patrick
questions.set('110923', "In how many ways can a President and a Vice-President be chosen from a group of 4 people? (assuming that the president and the vice president cannot be the same person)");
questions.set('111023', "Coach is preparing a 5 person starting line up for his team. There are 12 total players, and 2 all star players from last year Chris and Andrew are guaranteed a spot on the team. How many starting lineups are possible?");
questions.set('111123', "15 students in a chemistry class have lab every week. Each week, they are randomly divided into 5 groups of 3 students each. What is the probability that 3 students, Bob, Andrew, and Sally are in the same lab group this week? Enter your answer as a simplfied fraction.");
questions.set('111223', "4+4");
questions.set('111323', "5+5");
questions.set('111423', "6+6");
questions.set('111523', "6 points are placed evenly around a circle labeled A,B,C,D,E, and F at random. What is the probability that two triangles ABC and DEF do not overlap? Enter your answer as a simplified fraction.");
questions.set('111623', "8+8");
questions.set('111723', "9+9");
questions.set('111823', "10+10");
questions.set('111923', "11+11");
questions.set('112023', "12+12");

const answers = new Map();

answers.set('110923', "12");
answers.set('111023', "120");
answers.set('111123', "1/91");
answers.set('111223', "8");
answers.set('111323', "10");
answers.set('111423', "12");
answers.set('111523', "3/10");
answers.set('111623', "16");
answers.set('111723', "18");
answers.set('111823', "20");
answers.set('111923', "22");
answers.set('112023', "24");

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
    let leaderboard = await User.find().sort({ totalSolved: -1 });
    leaderboard = leaderboard.map(user => ({
        username: user.username,
        totalSolved: user.totalSolved,
      }));
      console.log(leaderboard);
      res.render('leaderboard', {leaderboard})
})
app.get('/', async (req,res)=>
{
    //console.log("user:",req.session.user);
    let user = req.session.user;
    //-------------------------------------------------------------------//
    let date = new Date();
    let month = date.getMonth()+1; //month starts from 0 
    let day = date.getDate();
    let year = date.getFullYear()-2000;
    if(month<10)
    {
        month = '0'+month;
    }
    if(day<10)
    {
        day = '0'+day;
    }
    
    let d = ''+month+day+year;
    //console.log(d);
    let today = questions.get(d);
    //-------------------------------------------------------------------//
    if(req.query.solution == answers.get(d))
    {
        let ans = req.query.solution;
        if(user)
        {
            console.log("aa");
            let name = user.user;
            const filter = { username: name }
            const update = {$push: { solved: today}};
            const update2 = {$inc: {totalSolved: 1}};
            await User.updateOne(filter, update);
            await User.updateOne(filter, update2);
            postTweet("congrats to "+name+" for solving today's puzzle!");
            
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
    res.render('login')
})
app.get('/register', (req,res)=>
{
    res.render('register')
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
  })
app.listen(process.env.PORT ?? 3000);