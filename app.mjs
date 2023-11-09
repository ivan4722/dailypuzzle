import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';
import expressSession from 'express-session';

const User = mongoose.model('user');

const app = express();
app.use(expressSession({
    secret: 'a',
    resave: false,
    saveUninitialized: true
  }));

const questions = new Map();

questions.set('110223', "1+1");
questions.set('110323', "2+2");
questions.set('110423', "3+3");
questions.set('110523', "4+4");
questions.set('110623', "5+5");
questions.set('110723', "6+6");
questions.set('110823', "7+7");
questions.set('110923', "8+8");
questions.set('111023', "9+9");
questions.set('111123', "10+10");
questions.set('111223', "11+11");
questions.set('111323', "12+12");

const answers = new Map();

answers.set('110223', "2");
answers.set('110323', "4");
answers.set('110423', "6");
answers.set('110523', "8");
answers.set('110623', "10");
answers.set('110723', "12");
answers.set('110823', "14");
answers.set('110923', "16");
answers.set('111023', "18");
answers.set('111123', "20");
answers.set('111223', "22");
answers.set('111323', "24");

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


app.get('/', (req,res)=>
{
    console.log("user:",req.session.user);
    let user = req.session.user;
    //-------------------------------------------------------------------//
    const date = new Date();
    let month = date.getMonth()+1; //month starts from 0 
    let day = date.getDate();
    const year = date.getFullYear()-2000;
    if(month<10)
    {
        month = '0'+month;
    }
    if(day<10)
    {
        day = '0'+day;
    }
    
    const d = ''+month+day+year;
    //console.log(d);
    const today = questions.get(d);
    //-------------------------------------------------------------------//
    if(req.query.solution == answers.get(d))
    {
        const ans = req.query.solution;
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
    const user = new User({ username, password, bestStreak: 0, solved: [] });
  
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
app.listen(process.env.PORT);
