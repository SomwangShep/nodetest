const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const yargs = require('yargs');
const port = process.env.PORT || 3000;

// const argv = yargs.argv;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// ============== Create the log file =================
app.use((req,res,next)=>
{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
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

  var q = "";//return frim java
  var err = "";//error from childProcess
  var status = "";//results frpom promise

  childProcess.stdout.on('data', function (data)
  {
    q = data.toString();
    // str.replace("Microsoft", "W3Schools");
    // q = q.replace(";","</br>");
    console.log('Yargs', yargs.argv);
    console.log('[spawn] stdout: ', q);
    // console.log('here is questions in stdout:  '+q);
    res.render('home.hbs',
    {
      pageTitle: 'Home Page',
      welcomeMessage: 'Welcome to my website',
      quetion: `${q}`,
      error: `${err}`,
      status: `${status}`
    });
    // quetion: `${q}`,
    // console.log('here is questions in render:  '+q);
  });

  // childProcess.stderr.on('data', function (data)
  // {
  //   err = data.toString();
  //   console.log('[spawn] stderr: ', err);
  //   console.log('here is questions in stderr:  '+q);
  // });

  // promise.then(function ()
  // {
  //   status = "Complete!";
  //   console.log(status);
  // })
  // .catch(function (err)
  // {
  //   status = err;
  //   console.error('[spawn] ERROR: ', err);
  // });

  console.log('here is questions before render:  '+q);
  // =============== End execute java file =========================//

//   res.render('home.hbs',{
//     pageTitle: 'Home Page',
//     welcomeMessage: 'Welcome to my website',
//     quetion: `${q}`,
//     error: `${err}`,
//     status: `${status}`
//   });
//   console.log('here is questions in render:  '+q);
});

app.get('/about',(req,res) => {
  // res.send('About Page');
  res.render('about.hbs',{
    pageTitle: 'About Page2',
    // currentYear: new Date().getFullYear()
  });
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`)
});
