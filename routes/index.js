var app = require('express')();
var bodyParser = require('body-parser');
var tollService = require('./toll-service');
tollService.init();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

//allow cors headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//allow all options request to be 200
app.options("*", function (req, res) {
    res.send(200)
});



/* GET home page. */
app.get('/', function (req, res, next) {
    console.log(app);
    res.render('index', {title: 'Etoll Mobile Api'});
});


app.get('/entry', function (req, res, next) {
    res.json({id: '1234', message: 'Entry recorded'})
});

app.get('/exit', function (req, res, next) {
    res.json({id: '1234', message: 'Exit recorded'})
});

app.post('/add-entry',function(req,res){
  console.log('POST:Adding entry' + req.body);
  tollService.addEntry(req.body, function(usage) {
      res.json(usage);
  });
});

app.post('/add-exit',function(req,res){
  console.log('POST:Adding exit info' + req.body);
  try {
      tollService.addExit(req.body, function(usage) {
          res.json(usage);
      });
  } catch(e) {
      console.log('POST:ERROR Adding exit info' );
  }

});


app.get('/toll-gates/', function (req, res) {
    console.log('Getting tollgate locations');

//    var params = {
//        ExclusiveStartTableName: 'TOLL_MASTER',
//        Limit: 10
//    };

//  db.listTables(params, function(err, data) {
//      if (err) console.log(err, err.stack);
//      else console.log(data.TableNames);
//  });


//    db.describeTable({TableName: 'TOLL_MASTER'}, function(err, data) {
//        if (err) console.log(err, err.stack); // an error occurred
//        else     console.log(data);           // successful response
//    });

    tollService.findAllGates(function (tollgates) {
        res.json(tollgates);
    });


//  res.json({ tollgates: [ {road: 'Sydney Harbour Bridge', gates: [{name: 'Milsons Point', longtitude: '151.212707', latitude: '-33.848882'}]},
//                          {road: 'Sydney Harbour Tunnel', gates: [{name: 'Milsons Point', longtitude: '151.212707', latitude: '-33.848882'}]},
//                          {road: 'M7', gates: [{name: 'Winston Hills', longtitude: '150.963061', latitude: '-33.764937'},
//                          {name: 'Bella Vista', longtitude: '150.945895', latitude: '-33.74881'},
//                          {name: 'Eastern Creek', longtitude: '150.945895', latitude: '-33.74881'},
//                          {name: 'Casula', longtitude: '150.868882', latitude: '-33.932898'}]}
//          ]})
});

app.get('/toll-usage/:userid', function (req, res) {
    console.log('GET:Toll usage query for user:' + req.params.userid);
    res.json({
        tollusage: [{uerId: '1234', road: 'Sydney Harbour Bridge', entryPoint: 'Milsons Point', entryTime: '14:34:12 06/12/2014'},
            {
                userId: '1234',
                road: 'M7',
                entryPoint: 'Winston Hill',
                exitPoint: 'Eastern Creek',
                entryTime: '14:34:12 12/12/2014',
                exitTime: '14:58:10 12/12/2014'
            }
        ]
    })
});

module.exports = app;
