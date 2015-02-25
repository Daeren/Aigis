//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

require("../index");

//-----------------------------------------------------

console.log("+-------------------------+");
console.log("| Custom");
console.log("+-------------------------+");

$validate.rule("testRuleMax10", function(input, options) {
    return input < 10;
});

console.log("1#", $validate("testRuleMax10", 50));
console.log("1#", $validate("testRuleMax10", 8));


console.log("+-------------------------+");
console.log("| String");
console.log("+-------------------------+");

console.log(JSON.stringify({
    "T0":   $validate("string", 10),
    "T1":   $validate("integer", "10"),
    "T2":   $validate("email", "0d@root.pop"),
    "T3":   $validate("email", "0d-root.pop"),
    "T4":   $validate("?email", undefined)
}, null, "\t"));


console.log("+-------------------------+");
console.log("| Array");
console.log("+-------------------------+");

console.log(JSON.stringify({
    "T0":   $validate(["integer", 10], ["email", "0d@root.pop"]),
    "T1":   $validate(["string", 10], ["email", "0d@root.pop"]),
    "T2":   $validate(["string", 10], ["email", "0d-root.pop"]),
    "T3":   $validate(["?string", undefined], ["email", "0d@root.pop"]),
    "T4":   $validate(["?string", undefined], ["email", "0d-root.pop"])
}, null, "\t"));


console.log("+-------------------------+");
console.log("| HashTable");
console.log("+-------------------------+");

var schema  = {"name": "string", "status": "?string", "pts": "integer"},
    data    = {"name": "DT", "pts": "32"};

console.log("1#", $validate(schema, data));
console.log("2#", $validate(schema, data, {"errors": true}));


var schema  = {
        "name":     "string",
        "status":   "?string",
        "pts":      {"use": "integer", "max": 32}
    },
    data    = {"name": "DT", "pts": 32};

console.log("3#", $validate(schema, data));