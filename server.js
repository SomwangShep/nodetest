const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const yargs = require('yargs');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var ans = "";//last one is ans (length-1)
var ans1 = "";//user answer
var totalScore = 0.0;//running totalScore
var numberOfTest = 0.0;
var corr = "";
var incorr = "";

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// ============== Create the log file =================
app.use((req,res,next)=>
{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  // console.log(log);
  fs.appendFile('server.log',log + '\n', (err)=>
  {
    if (err)
    {
      console.log('Unable to append to server.log')
    }
  });
  next();
});
// ============== End Create the log file ===============

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () =>
{
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt',(text)=>
{
  return text.toUpperCase();
});

app.get('/', (req, res)=>
{
  // =============== Start execute java file =========================//
  var fn = __dirname + '/public/GenerateQuiz1Question.jar';
  var spawn = require('child-process-promise').spawn;
  var promise = spawn('java', ['-jar',fn]);
  var childProcess = promise.childProcess;

  var q = "";//return from java
  var err = "";//error from childProcess
  var status = "";//results frpom promise

  var limit = 8;//max of number varible in java return (need ask with Mike)
  var q0,q1,q2,q3,q4,q5,q6,q7 = "";//to store varibles
  var prt = "";//system.out.print ((length-2)

  childProcess.stdout.on('data', function (data)
  {
    var qtest = data.toString();
    q = data.toString().substring(50);//remove 'Given the information below, what will be printed?'
    q = q.split(";")
    console.log(qtest);

    // ----------------------- set varibles -----------------------
    ans = q[q.length-1].substring(1);
    prt = q[q.length-2].trim();
    // --------------- for varibles will be use in questions ------
    if (q.length == 10)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = q[3] + ";";
      q4 = q[4] + ";";
      q5 = q[5] + ";";
      q6 = q[6] + ";";
      q7 = q[7] + ";";
    } else if (q.length == 9)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = q[3] + ";";
      q4 = q[4] + ";";
      q5 = q[5] + ";";
      q6 = q[6] + ";";
      q7 = "";
    } else if (q.length == 8)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = q[3] + ";";
      q4 = q[4] + ";";
      q5 = q[5] + ";";
      q6 = "";
      q7 = "";
    } else if (q.length == 7)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = q[3] + ";";
      q4 = q[4] + ";";
      q5 = "";
      q6 = "";
      q7 = "";
    } else if (q.length == 6)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = q[3] + ";";
      q4 = "";
      q5 = "";
      q6 = "";
      q7 = "";
    }else if (q.length == 5)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = q[2] + ";";
      q3 = "";
      q4 = "";
      q5 = "";
      q6 = "";
      q7 = "";
    }else if (q.length == 4)
    {
      q0 = q[0] + ";";
      q1 = q[1] + ";";
      q2 = ""
      q3 = "";
      q4 = "";
      q5 = "";
      q6 = "";
      q7 = "";
    }else if (q.length == 3)
    {
      q0 = q[0] + ";";
      q1 = "";
      q2 = "";
      q3 = "";
      q4 = "";
      q5 = "";
      q6 = "";
      q7 = "";
    }else if (q.length == 2)
    {
      q0 = "";
      q1 = "";
      q2 = "";
      q3 = "";
      q4 = "";
      q5 = "";
      q6 = "";
      q7 = "";
    }

    res.render('home.hbs',
    {
      pageTitle: 'Java Chapter1 Quiz',
      quetion0: `${q0}`,
      quetion1: `${q1}`,
      quetion2: `${q2}`,
      quetion3: `${q3}`,
      quetion4: `${q4}`,
      quetion5: `${q5}`,
      quetion6: `${q6}`,
      quetion7: `${q7}`,
      prt: `${prt}`,
      ans: `${ans}`,
      ans1: `${ans1}`,
      ntest: `${numberOfTest}`,
      tscore: `${totalScore}`,
      corr: `${corr}`,
      incorr: `${incorr}`,
      error: `${err}`,
      status: `${status}`
    });
  });

  childProcess.stderr.on('data', function (data)
  {
    err = data.toString();
    console.log('[spawn] stderr: ', err);
  });

  promise.then(function ()
  {
    status = "Complete!";
    console.log(status);
  })
  .catch(function (err)
  {
    status = err;
    console.error('[spawn] ERROR: ', err);
  });
  // =============== End execute java file =========================//
});

app.post('/ansChk',(req,res) => {
  corr = "";
  incorr = "";
  numberOfTest = numberOfTest +1;
  ans1 = req.body.ans;

  console.log(`user input ${ans1}, the answer: ${ans}`);
  if (ans1 == ans){
    totalScore = totalScore+1;
    corr = "Great Job!";
  }
  else {
    incorr = `Incorrect! The correct answer is '${ans}'`;
  }
  res.redirect('back');
});

app.get('/about',(req,res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page2',
  });
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`)
});
