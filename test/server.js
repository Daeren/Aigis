//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

require("../index");

var rExpress    = require("express");
var rBodyParser = require("body-parser");

//-----------------------------------------------------

var objApp = rExpress();

var appModels = {
    "user": {
        "id":   "integer",
        "name": "string",
        "pswd": {"type": "string", "rule": "required", "on": ["update"]}
    },

    "task": {
        "id":   "integer"
    }
};

//-------------------]>

objApp
    .use(rBodyParser.urlencoded({"extended": false}))
    .use(rBodyParser.json());

//--------)>

objApp.use($sanitize.mid(appModels)); //_Default: GET -> POST or PUT or ... etc
//objApp.use($sanitize.mid(appModels, "POST")); //_Only: POST
//objApp.use($sanitize.mid(appModels, ["GET", "POST", "PUT"])); //_Only: GET, POST, PUT

//-------------------]>

objApp.all("/", function(req, res) {
    if(!req.model)
        return res.send("req.model: empty");

    res.send(
        JSON.stringify(req.model.data) +
        " | name: " + req.model.name +
        " | scenario: " + req.model.scenario +
        " | validate: " + req.model.validate()
    );
});

//-------------------]>

objApp.listen(3000, "127.0.0.1");



//_ http://127.0.0.1:3000/?model=user&data=%7B"name"%3A"DT"%7D
//_ http://127.0.0.1:3000/?model=user&data=%7B%22id%22%3A%226d%22%2C%22name%22%3A%22DT%22%7D
//_ http://127.0.0.1:3000/?model=user&scenario=test&data=%7B%22id%22%3A%226d%22%2C%22name%22%3A%22DT%22%7D
//_ http://127.0.0.1:3000/?model=user&scenario=update&data=%7B%22id%22%3A%226d%22%2C%22name%22%3A%22DT%22%7D
//_ encodeURIComponent(JSON.stringify({id: "6d", name: "DT"}));
//_ http://127.0.0.1:3000/?model=user&scenario=update&data=%7B%22id%22%3A%226d%22%2C%22name%22%3A%22DT%22%2C%22pswd%22%3A%22potato%22%7D
//_ encodeURIComponent(JSON.stringify({id: "6d", name: "DT", pswd: "potato"}));
//
//_{"model":"user", "data": {id: "6d", name: "DT"}}
//_{"model":"user", "data": {id: "6d", name: "DT"}, "scenario": "update"}

