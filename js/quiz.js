var fn = __dirname + '../../public/GenerateQuiz1Question.jar';
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
  module.exports.addNote = () => {
    console.log("startign quiz in export");
    return {
       quetion0: `${q0}`
    }
  };
  // module.exports.addNote = () => {
  //   console.log("startign quiz in export");
  //   return {
  //      quetion0: `${q0}`
  //   }
  // };

  // res.render('home.hbs',
  // {
  //   pageTitle: 'Java Chapter1 Quiz',
  //   quetion0: `${q0}`,
  //   quetion1: `${q1}`,
  //   quetion2: `${q2}`,
  //   quetion3: `${q3}`,
  //   quetion4: `${q4}`,
  //   quetion5: `${q5}`,
  //   quetion6: `${q6}`,
  //   quetion7: `${q7}`,
  //   prt: `${prt}`,
  //   ans: `${ans}`,
  //   ans1: `${ans1}`,
  //   ntest: `${numberOfTest}`,
  //   tscore: `${totalScore}`,
  //   corr: `${corr}`,
  //   incorr: `${incorr}`,
  //   error: `${err}`,
  //   status: `${status}`
  // });// end res
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


// module.exports.addNote = () => {
//   console.log("startign quiz in export");
//   return {
//      quetion0: `${q0}`
//   }
// };
