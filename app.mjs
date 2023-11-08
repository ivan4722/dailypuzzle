import './config.mjs';
import express from 'express';
import './db.mjs';
import mongoose from 'mongoose';

const user = mongoose.model('user');

const app = express();

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

// configure templating to hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/', (req,res)=>
{
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
    if(req.query.solution == answers.get(d))
    {
        const ans = req.query.solution;
        res.render('correct',{ans});
    }
    else if(req.query.solution && req.query.solution != answers.get(d))
    {
        const wrong = "wrong answer";
        res.render('home',{today,wrong});
    }
    else
    {
        const wrong = ''
        res.render('home',{today,wrong});
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
app.listen(process.env.PORT);
