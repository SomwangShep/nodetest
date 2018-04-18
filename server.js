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
var qs = [];

var qu0 = [];//array varible from jav return
var qu1 = [];//array varible from jav return
var qu2 = [];//array varible from jav return
var qu3 = [];//array varible from jav return
var qu4 = [];//array varible from jav return
var qu5 = [];//array varible from jav return
var qu6 = [];//array varible from jav return
var qu7 = [];//array varible from jav return
var qu8 = [];//array varible from jav return
var qu9 = [];//array varible from jav return

var prt = [];//system.out.print ((length-2)
var ansJava = [];//last one is ans (length-1)
var ansUsr = [];//user answer
var corr = [];//correct msg
var incorr = [];//incorect msg

var totalScore = 0.0;//running totalScore
// var numberOfTest = 0.0;
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
  var promise = spawn('java', ['-jar',fn]);
  var childProcess = promise.childProcess;

  var limit = 8;//max of number varible in java return (need ask with Mike)
  var bears = 0;

  console.log(`****************************************************************`);
  childProcess.stdout.on('data', function (data)
  {
    bears += 1;
    console.log(`------- ${bears} -------`);
    var qr = data.toString();
    qr = qr.substring(50);
    console.log(qr);
    qs[bears-1] = qr;
  });

  childProcess.stderr.on('data', function (data)
  {
    console.log('[spawn] stderr: ', data.toString());
  });
  promise.then(function ()
  {
    // ------- Start get data from childProcess --------------
    for (var i = 0; i < 10; i++)
    {
      qu0[i] = "";
      qu1[i] = "";
      qu2[i] = "";
      qu3[i] = "";
      qu4[i] = "";
      qu5[i] = "";
      qu6[i] = "";
      qu7[i] = "";
      qu8[i] = "";
      qu9[i] = "";
    }
    var q = "";//return from java

    for (var j = 0; j < 10; j ++)
    {
      q = qs[j].split(";")
      //I only set max of varible to 8, the last 2 are print and answer
      if (q.length <= 10)
      {
        for (var i = 0; i < q.length-2;i++)
        {
          if (j == 0)  qu0[i] = q[i] + ";";
          if (j == 1)  qu1[i] = q[i] + ";";
          if (j == 2)  qu2[i] = q[i] + ";";
          if (j == 3)  qu3[i] = q[i] + ";";
          if (j == 4)  qu4[i] = q[i] + ";";
          if (j == 5)  qu5[i] = q[i] + ";";
          if (j == 6)  qu6[i] = q[i] + ";";
          if (j == 7)  qu7[i] = q[i] + ";";
          if (j == 8)  qu8[i] = q[i] + ";";
          if (j == 9)  qu9[i] = q[i] + ";";
        }
        var t = q[q.length-1].trim();
        // console.log(`answer java: ${t}`);
        ansJava[j] = t.substring(1,t.length-1);
        prt[j] = q[q.length-2].trim();
      }
    }
    // -------- End getting data -------------------------
    // ----------- Start Render form -------------------------------
      res.render('home.hbs',
      {
        pageTitle: 'Java Chapter1 Quiz',
        v0_0: `${qu0[0]}`,
        v0_1: `${qu0[1]}`,
        v0_2: `${qu0[2]}`,
        v0_3: `${qu0[3]}`,
        v0_4: `${qu0[4]}`,
        v0_5: `${qu0[5]}`,
        v0_6: `${qu0[6]}`,
        v0_7: `${qu0[7]}`,
        prt0: `${prt[0]}`,
        ansJava0: `${ansJava[0]}`,
        v1_0: `${qu1[0]}`,
        v1_1: `${qu1[1]}`,
        v1_2: `${qu1[2]}`,
        v1_3: `${qu1[3]}`,
        v1_4: `${qu1[4]}`,
        v1_5: `${qu1[5]}`,
        v1_6: `${qu1[6]}`,
        v1_7: `${qu1[7]}`,
        prt1: `${prt[1]}`,
        ansJava1: `${ansJava[1]}`,
        v2_0: `${qu2[0]}`,
        v2_1: `${qu2[1]}`,
        v2_2: `${qu2[2]}`,
        v2_3: `${qu2[3]}`,
        v2_4: `${qu2[4]}`,
        v2_5: `${qu2[5]}`,
        v2_6: `${qu2[6]}`,
        v2_7: `${qu2[7]}`,
        prt2: `${prt[2]}`,
        ansJava2: `${ansJava[2]}`,
        v3_0: `${qu3[0]}`,
        v3_1: `${qu3[1]}`,
        v3_2: `${qu3[2]}`,
        v3_3: `${qu3[3]}`,
        v3_4: `${qu3[4]}`,
        v3_5: `${qu3[5]}`,
        v3_6: `${qu3[6]}`,
        v3_7: `${qu3[7]}`,
        prt3: `${prt[3]}`,
        ansJava3: `${ansJava[3]}`,
        v4_0: `${qu4[0]}`,
        v4_1: `${qu4[1]}`,
        v4_2: `${qu4[2]}`,
        v4_3: `${qu4[3]}`,
        v4_4: `${qu4[4]}`,
        v4_5: `${qu4[5]}`,
        v4_6: `${qu4[6]}`,
        v4_7: `${qu4[7]}`,
        prt4: `${prt[4]}`,
        ansJava4: `${ansJava[4]}`,
        v5_0: `${qu5[0]}`,
        v5_1: `${qu5[1]}`,
        v5_2: `${qu5[2]}`,
        v5_3: `${qu5[3]}`,
        v5_4: `${qu5[4]}`,
        v5_5: `${qu5[5]}`,
        v5_6: `${qu5[6]}`,
        v5_7: `${qu5[7]}`,
        prt5: `${prt[5]}`,
        ansJava5: `${ansJava[5]}`,
        v6_0: `${qu6[0]}`,
        v6_1: `${qu6[1]}`,
        v6_2: `${qu6[2]}`,
        v6_3: `${qu6[3]}`,
        v6_4: `${qu6[4]}`,
        v6_5: `${qu6[5]}`,
        v6_6: `${qu6[6]}`,
        v6_7: `${qu6[7]}`,
        prt6: `${prt[6]}`,
        ansJava6: `${ansJava[6]}`,
        v7_0: `${qu7[0]}`,
        v7_1: `${qu7[1]}`,
        v7_2: `${qu7[2]}`,
        v7_3: `${qu7[3]}`,
        v7_4: `${qu7[4]}`,
        v7_5: `${qu7[5]}`,
        v7_6: `${qu7[6]}`,
        v7_7: `${qu7[7]}`,
        prt7: `${prt[7]}`,
        ansJava7: `${ansJava[7]}`,
        v8_0: `${qu8[0]}`,
        v8_1: `${qu8[1]}`,
        v8_2: `${qu8[2]}`,
        v8_3: `${qu8[3]}`,
        v8_4: `${qu8[4]}`,
        v8_5: `${qu8[5]}`,
        v8_6: `${qu8[6]}`,
        v8_7: `${qu8[7]}`,
        prt8: `${prt[8]}`,
        ansJava8: `${ansJava[8]}`,
        v9_0: `${qu9[0]}`,
        v9_1: `${qu9[1]}`,
        v9_2: `${qu9[2]}`,
        v9_3: `${qu9[3]}`,
        v9_4: `${qu9[4]}`,
        v9_5: `${qu9[5]}`,
        v9_6: `${qu9[6]}`,
        v9_7: `${qu9[7]}`,
        prt9: `${prt[9]}`,
        ansJava9: `${ansJava[9]}`
      });
    // ----------- End Render form -------------------------------
    console.log("Complete!");
  })
  .catch(function (err)
  {
    console.error('[spawn] ERROR: ', err);
  });
});
// =============== End app.get('/' =========================//

app.post('/ansChk',(req,res) => {
  //reset correct and incorrect
  for (var i = 0; i < 10; i++)
  {
      corr[i] = "";
      incorr[i] = "";
  }
  ansUsr[0] = req.body.ans0;
  ansUsr[1] = req.body.ans1;
  ansUsr[2] = req.body.ans2;
  ansUsr[3] = req.body.ans3;
  ansUsr[4] = req.body.ans4;
  ansUsr[5] = req.body.ans5;
  ansUsr[6] = req.body.ans6;
  ansUsr[7] = req.body.ans7;
  ansUsr[8] = req.body.ans8;
  ansUsr[9] = req.body.ans9;

  for (var k = 0; k < 10; k++)
  {
    if (ansUsr[k] == ansJava[k])
    {
      totalScore = totalScore+1;
      corr[k] = "Great Job!";
    }
    else {
      // incorr[k] = `Incorrect! The correct answer is '${ansJava[k]}', your and ${ansUsr[k]}`;
      incorr[k] = `Incorrect!`;
    }
  }
  // res.redirect('back');
  res.render('ans.hbs',
  {
    pageTitle: 'Java Chapter1 Quiz',
    v0_0: `${qu0[0]}`,
    v0_1: `${qu0[1]}`,
    v0_2: `${qu0[2]}`,
    v0_3: `${qu0[3]}`,
    v0_4: `${qu0[4]}`,
    v0_5: `${qu0[5]}`,
    v0_6: `${qu0[6]}`,
    v0_7: `${qu0[7]}`,
    prt0: `${prt[0]}`,
    ansJava0: `${ansJava[0]}`,
    ansUsr0: `${ansUsr[0]}`,
    corr0: `${corr[0]}`,
    incorr0: `${incorr[0]}`,
    v1_0: `${qu1[0]}`,
    v1_1: `${qu1[1]}`,
    v1_2: `${qu1[2]}`,
    v1_3: `${qu1[3]}`,
    v1_4: `${qu1[4]}`,
    v1_5: `${qu1[5]}`,
    v1_6: `${qu1[6]}`,
    v1_7: `${qu1[7]}`,
    prt1: `${prt[1]}`,
    ansJava1: `${ansJava[1]}`,
    ansUsr1: `${ansUsr[1]}`,
    corr1: `${corr[1]}`,
    incorr1: `${incorr[1]}`,
    v2_0: `${qu2[0]}`,
    v2_1: `${qu2[1]}`,
    v2_2: `${qu2[2]}`,
    v2_3: `${qu2[3]}`,
    v2_4: `${qu2[4]}`,
    v2_5: `${qu2[5]}`,
    v2_6: `${qu2[6]}`,
    v2_7: `${qu2[7]}`,
    prt2: `${prt[2]}`,
    ansJava2: `${ansJava[2]}`,
    ansUsr2: `${ansUsr[2]}`,
    corr2: `${corr[2]}`,
    incorr2: `${incorr[2]}`,
    v3_0: `${qu3[0]}`,
    v3_1: `${qu3[1]}`,
    v3_2: `${qu3[2]}`,
    v3_3: `${qu3[3]}`,
    v3_4: `${qu3[4]}`,
    v3_5: `${qu3[5]}`,
    v3_6: `${qu3[6]}`,
    v3_7: `${qu3[7]}`,
    prt3: `${prt[3]}`,
    ansJava3: `${ansJava[3]}`,
    ansUsr3: `${ansUsr[3]}`,
    corr3: `${corr[3]}`,
    incorr3: `${incorr[3]}`,
    v4_0: `${qu4[0]}`,
    v4_1: `${qu4[1]}`,
    v4_2: `${qu4[2]}`,
    v4_3: `${qu4[3]}`,
    v4_4: `${qu4[4]}`,
    v4_5: `${qu4[5]}`,
    v4_6: `${qu4[6]}`,
    v4_7: `${qu4[7]}`,
    prt4: `${prt[4]}`,
    ansJava4: `${ansJava[4]}`,
    ansUsr4: `${ansUsr[4]}`,
    corr4: `${corr[4]}`,
    incorr4: `${incorr[4]}`,
    v5_0: `${qu5[0]}`,
    v5_1: `${qu5[1]}`,
    v5_2: `${qu5[2]}`,
    v5_3: `${qu5[3]}`,
    v5_4: `${qu5[4]}`,
    v5_5: `${qu5[5]}`,
    v5_6: `${qu5[6]}`,
    v5_7: `${qu5[7]}`,
    prt5: `${prt[5]}`,
    ansJava5: `${ansJava[5]}`,
    ansUsr5: `${ansUsr[5]}`,
    corr5: `${corr[5]}`,
    incorr5: `${incorr[5]}`,
    v6_0: `${qu6[0]}`,
    v6_1: `${qu6[1]}`,
    v6_2: `${qu6[2]}`,
    v6_3: `${qu6[3]}`,
    v6_4: `${qu6[4]}`,
    v6_5: `${qu6[5]}`,
    v6_6: `${qu6[6]}`,
    v6_7: `${qu6[7]}`,
    prt6: `${prt[6]}`,
    ansJava6: `${ansJava[6]}`,
    ansUsr6: `${ansUsr[6]}`,
    corr6: `${corr[6]}`,
    incorr6: `${incorr[6]}`,
    v7_0: `${qu7[0]}`,
    v7_1: `${qu7[1]}`,
    v7_2: `${qu7[2]}`,
    v7_3: `${qu7[3]}`,
    v7_4: `${qu7[4]}`,
    v7_5: `${qu7[5]}`,
    v7_6: `${qu7[6]}`,
    v7_7: `${qu7[7]}`,
    prt7: `${prt[7]}`,
    ansJava7: `${ansJava[7]}`,
    ansUsr7: `${ansUsr[7]}`,
    corr7: `${corr[7]}`,
    incorr7: `${incorr[7]}`,
    v8_0: `${qu8[0]}`,
    v8_1: `${qu8[1]}`,
    v8_2: `${qu8[2]}`,
    v8_3: `${qu8[3]}`,
    v8_4: `${qu8[4]}`,
    v8_5: `${qu8[5]}`,
    v8_6: `${qu8[6]}`,
    v8_7: `${qu8[7]}`,
    prt8: `${prt[8]}`,
    ansJava8: `${ansJava[8]}`,
    ansUsr8: `${ansUsr[8]}`,
    corr8: `${corr[8]}`,
    incorr8: `${incorr[8]}`,
    v9_0: `${qu9[0]}`,
    v9_1: `${qu9[1]}`,
    v9_2: `${qu9[2]}`,
    v9_3: `${qu9[3]}`,
    v9_4: `${qu9[4]}`,
    v9_5: `${qu9[5]}`,
    v9_6: `${qu9[6]}`,
    v9_7: `${qu9[7]}`,
    prt9: `${prt[9]}`,
    ansJava9: `${ansJava[9]}`,
    ansUsr9: `${ansUsr[9]}`,
    corr9: `${corr[9]}`,
    incorr9: `${incorr[9]}`,
    tscore: `${totalScore}`
  });
});

app.get('/about',(req,res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page2',
  });
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`)
});
