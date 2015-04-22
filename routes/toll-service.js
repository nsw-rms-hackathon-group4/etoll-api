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
//        TollService.importTollGates();
    });
};
TollService.createSchema = function () {
    console.log("Creating schema");
    TollService.tollGateSchema = mongoose.Schema({
        road: String,
        gates: [{name: String, longtitude: String, latitude: String}]
    });
    TollService.tollUsageSchema = mongoose.Schema({
        userId: String,
        road: String,
        entryPoint: String,
        entryTime: String,
        exitPoint: String,
        exitTime: String
    });
    console.log("Creating models");
    TollService.TollGate = mongoose.model("TollGate", TollService.tollGateSchema);
    TollService.TollUsage = mongoose.model("TollUsage", TollService.tollUsageSchema);
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

TollService.addEntry = function(entry, cb) {
    var newUsage = new TollService.TollUsage(entry);
    newUsage.save(function (err, savedUsage) {
        if (err) return console.error(err);
        console.log("Added entry" + savedUsage.userId + " : " + savedUsage.road + " : " + savedUsage.entryPoint + " : " + savedUsage.entryTime);
        cb(savedUsage);
    });
};

TollService.addExit = function(exit, cb) {
    try {
        // Retrieve latest tollUsage record  for userId
        var query = TollService.TollUsage.find({userId: '1235'}).limit(1).sort('-entryTime');

//        query.exec(function (err, tollUsage) {
//            // Update  with exit details
//            tollUsage.exitPoint = exit.exitPoint;
//            tollUsage.exitTime = exit.exitTime;
//            tollUsage.save(function (err, savedUsage) {
//                if (err) return console.error(err);
//                console.log("Updated with exit data" + savedUsage.userId + " : " + savedUsage.exitPoint + " : " + savedUsage.exitTime);
//                cb(savedUsage);
//            });
//        });
    } catch(e) {
        console.log("Error occurred in add Exit", e.message);
    }
};


module.exports = TollService;


