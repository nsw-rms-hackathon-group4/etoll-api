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
//        TollService.createSchema();
//        TollService.importTollGates();
    });
};
TollService.createSchema = function () {
    console.log("Creating schema");
    TollService.tollGateSchema = mongoose.Schema({
        road: String,
        gates: [{name: String, longtitude: String, latitude: String}]
    });
    console.log("Creating model");
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

    var harbourTunnel = new TollService.TollGate({
        road: 'Sydney Harbour Tunnel',
        gates: [{name: 'Milsons Point', longtitude: '151.212707', latitude: '-33.848882'}]
    });
    harbourTunnel.save(function (err, harbourTunnel) {
        if (err) return console.error(err);
        console.log("Saved harbour tunnel successfully"+harbourTunnel);
    });

    var m7 = new TollService.TollGate({
        road: 'M7',
        gates: [{name: 'Winston Hills', longtitude: '150.963061', latitude: '-33.764937'},
            {name: 'Bella Vista', longtitude: '150.945895', latitude: '-33.74881'},
            {name: 'Eastern Creek', longtitude: '150.945895', latitude: '-33.74881'},
            {name: 'Casula', longtitude: '150.868882', latitude: '-33.932898'}]
    });
    m7.save(function (err, m7) {
        if (err) return console.error(err);
        console.log("Saved M7 successfully"+m7);
    });
};


TollService.findAllGates = function (cb) {
    TollService.TollGate.find(function(err, tollgates) {
        if (err) return console.error(err);
        console.log("Tollgates retrieved successfully" + tollgates);
        cb(tollgates);
    });
};

module.exports = TollService;


