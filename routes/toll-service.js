'use strict';

var dbconfig = require('./config.js');
var mongoose = require("mongoose");


var TollService = {};
TollService.init = function () {
    mongoose.connect(dbconfig.dev.url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("connected successfully");
        TollService.createSchema();
        TollService.importTollGates();
    });
};
TollService.createSchema = function () {

    TollService.tollGateSchema = mongoose.Schema({
        road: String,
        gates: [{name: String, longtitude: String, latitude: String}]
    });
    TollService.TollGate = mongoose.model("TollGate", TollService.tollGateSchema);
};

TollService.importTollGates = function () {

    var harbourBridge = new TollService.TollGate({
        road: 'Sydney Harbour Bridge',
        gates: [{name: 'Milsons Point', longtitude: '151.212707', latitude: '-33.848882'}]
    });
    harbourBridge.save(function (err, harbourBridge) {
        if (err) return console.error(err);
        console.log("Saved harbour bridge successfully"+harbourBridge);
    });
};

module.exports = TollService;
