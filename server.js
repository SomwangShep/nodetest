const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const yargs = require('yargs');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// -------- global varible for quiz ----------------------//
var ans = "";//last one is ans (length-1)
var ans1 = "";//user answer

var totalScore = 0.0;//running totalScore
var numberOfTest = 0.0;
var corr = "";
var incorr = "";
// -------- End global varible for quiz ----------------------//

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
  var spawn = require('child-process-promise').spawn;
  var fn = __dirname + '/public/GenerateQuiz1Question.jar';//GenerateQuiz1Question
  var fn2 = __dirname + '/public/Quiz1Tester.jar';//Quiz1Tester

  var promise = spawn('java', ['-jar',fn]);
  var promise2 = spawn('java', ['-jar',fn2]);
  var childProcess = promise.childProcess;
  var childProcess2 = promise2.childProcess;

  var q = "";//return from java
  var err = "";//error from childProcess
  var status = "";//results frpom promise

  var limit = 8;//max of number varible in java return (need ask with Mike)
  var prt = "";//system.out.print ((length-2)
  var qu1 = [];//array varible from jav return

  childProcess2.stdout.on('data', function (data)
  {
    var qtest = data.toString();
    // q = data.toString().substring(50);//remove 'Given the information below, what will be printed?'
    var q = qtest.split("Given the information below, what will be printed?")
    // console.log("---------------------------------");
    console.log(qtest);
    console.log(`-------somwang:------ ${q.length}`);
    // ----------------------- set varibles -----------------------
    // ans = q[q.length-1];
    // prt = q[q.length-2];
  });
// ============== End testing ================================
  childProcess.stdout.on('data', function (data)
  {
    var qtest = data.toString();
    console.log(qtest);

    q = qtest.substring(50);
    q = q.split(";")
    // ----------------------- set varibles -----------------------
    ans = q[q.length-1].substring(1);
    prt = q[q.length-2].trim();
    // --------------- for varibles will be use in questions ------
    // initiallize qu1 array with empty toString
    for (var i = 0; i < 10; i++)
    {
      qu1[i] = "";
    }
    for (var i = 0; i < q.length-2;i++)
    {
        qu1[i] = q[i];
    }

    res.render('home.hbs',
    {
      pageTitle: 'Java Chapter1 Quiz',
      quetion0: `${qu1[0]}`,
      quetion1: `${qu1[1]}`,
      quetion2: `${qu1[2]}`,
      quetion3: `${qu1[3]}`,
      quetion4: `${qu1[4]}`,
      quetion5: `${qu1[5]}`,
      quetion6: `${qu1[6]}`,
      quetion7: `${qu1[7]}`,
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
    // console.log('[spawn] stderr: ', err);
  });

  promise.then(function ()
  {
    status = "Complete!";
    // console.log(status);
  })
  .catch(function (err)
  {
    status = err;
    // console.error('[spawn] ERROR: ', err);
  });
  // =============== End execute java file =========================//
});

app.post('/ansChk',(req,res) => {
  corr = "";
  incorr = "";
  numberOfTest = numberOfTest +1;
  ans1 = req.body.ans;

  console.log(`'${ans1}' user input`);
  console.log(`'${ans}' from java`);
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
