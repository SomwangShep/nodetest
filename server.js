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
var ansJava0 = "";//last one is ans (length-1)
var ansUsr0 = "";//user answer

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
  var fn2 = __dirname + '/public/GenerateQuiz1Question.jar';//Quiz1Tester

  var promise = spawn('java', ['-jar',fn]);
  var promise2 = spawn('java', ['-jar',fn2]);
  var childProcess = promise.childProcess;
  var childProcess2 = promise2.childProcess;

  var q = "";//return from java

  var limit = 8;//max of number varible in java return (need ask with Mike)
  var prt = "";//system.out.print ((length-2)
  var qu1 = [];//array varible from jav return

  var qs1 = childProcess2.stdout.on('data', function (data)
  {
    //doing something

    // var originalNoteString = JSON.stringify(originalNote);
    // fs.writeFileSync('notes.json', originalNoteString);
    // console.log(qtest);
  });
  // fs.writeFileSync('notes.json',qs1)
  // var originalNoteString = JSON.stringify(qs1,null,4);
  console.log(`qs1 ${qs1}`);
// ============== End testing ================================
  childProcess.stdout.on('data', function (data)
  {
    var qtest = data.toString();
    console.log(qtest);

    q = qtest.substring(50);
    q = q.split(";")
    // ----------------------- set varibles -----------------------
    ansJava0 = q[q.length-1].substring(1);
    prt = q[q.length-2].trim();
    // initiallize qu1 array with empty String
    for (var i = 0; i < 10; i++)
    {
      qu1[i] = "";
    }
    for (var i = 0; i < q.length-2;i++)
    {
        qu1[i] = q[i] + ";";
    }

    res.render('home.hbs',
    {
      pageTitle: 'Java Chapter1 Quiz',
      v0: `${qu1[0]}`,
      v1: `${qu1[1]}`,
      v2: `${qu1[2]}`,
      v3: `${qu1[3]}`,
      v4: `${qu1[4]}`,
      v5: `${qu1[5]}`,
      v6: `${qu1[6]}`,
      v7: `${qu1[7]}`,
      prt: `${prt}`,
      ansJava0: `${ansJava0}`,
      ansUsr0: `${ansUsr0}`,
      ntest: `${numberOfTest}`,
      tscore: `${totalScore}`,
      corr: `${corr}`,
      incorr: `${incorr}`
    });
  });

  childProcess.stderr.on('data', function (data)
  {
    console.log('[spawn] stderr: ', data.toString());
  });

  promise.then(function ()
  {
    console.log("Complete!");
  })
  .catch(function (err)
  {
    console.error('[spawn] ERROR: ', err);
  });
  // =============== End execute java file =========================//
});

app.post('/ansChk',(req,res) => {
  corr = "";
  incorr = "";
  numberOfTest = numberOfTest +1;
  ansUsr0 = req.body.ans;

  console.log(`'${ansUsr0}' user input`);
  console.log(`'${ansJava0}' from java`);
  if (ansUsr0 == ansJava0){
    totalScore = totalScore+1;
    corr = "Great Job!";
  }
  else {
    incorr = `Incorrect! The correct answer is '${ansJava0}'`;
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
