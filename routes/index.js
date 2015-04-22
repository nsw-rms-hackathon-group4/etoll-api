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

/**
 * Add toll road entry
 */
app.post('/add-entry',function(req,res){
  console.log('POST:Adding entry' + req.body);
  tollService.addEntry(req.body, function(usage) {
      res.json(usage);
  });
});

/**
 * Add toll road exit
 */
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


/**
 * Get all toll roads and gates
 */
app.get('/toll-gates/', function (req, res) {
    console.log('Getting tollgate locations');


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


/**
 * Get all toll usages for userId
 */
app.get('/toll-usage/:userId', function (req, res) {
    console.log('GET:Toll usage query for user:' + req.params.userId);
    tollService.findUsageByUserId(req.params.userId, function (tollUsages) {
        res.json(tollUsages);
    });
//    res.json({
//        tollusage: [{uerId: '1234', road: 'Sydney Harbour Bridge', entryPoint: 'Milsons Point', entryTime: '14:34:12 06/12/2014'},
//            {
//                userId: '1234',
//                road: 'M7',
//                entryPoint: 'Winston Hill',
//                exitPoint: 'Eastern Creek',
//                entryTime: '14:34:12 12/12/2014',
//                exitTime: '14:58:10 12/12/2014'
//            }
//        ]
//    })
});

/**
 * Determine toll charge and update tollUsage record with the charge
 */
app.post('/toll-charge/', function (req, res) {
    console.log('GET:Toll charge for toll usage:' + req.body);
    tollService.charge(req.body, function (usage) {
        res.json(usage);
    });

});

module.exports = app;
