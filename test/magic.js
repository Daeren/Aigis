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
console.log("| S: String");
console.log("+-------------------------+");

console.log(JSON.stringify({
    "T0":   $sanitize("string", 10),
    "T1":   $sanitize("integer", "80", {"max": 50}),
    "T2":   $sanitize("array", "[1,2,3]", {"max": 2})
}, null, "\t"));


console.log("+-------------------------+");
console.log("| S: HashTable");
console.log("+-------------------------+");

var schema  = {
        "name":     {"use": "string", "max": 2, "trim": true},
        "status":   "?string",
        "pts":      {"use": "integer", "max": 30}
    },
    data    = {"name": "   DT+  ", "pts": "60", "delThisField": "data"};

console.log("1#", $sanitize(schema, data));



console.log("+-------------------------+");
console.log("| V: Custom");
console.log("+-------------------------+");

$validate.rule("testRuleMax10", function(input, options) {
    return input < 10;
});

console.log("1#", $validate("testRuleMax10", 50));
console.log("1#", $validate("testRuleMax10", 8));


console.log("+-------------------------+");
console.log("| V: String");
console.log("+-------------------------+");

console.log(JSON.stringify({
    "T0":   $validate("string", 10),
    "T1":   $validate("integer", "10"),
    "T2":   $validate("email", "0d@root.pop"),
    "T3":   $validate("email", "0d-root.pop"),
    "T4":   $validate("?email", undefined)
}, null, "\t"));

console.log("+-------------------------+");
console.log("| V: HashTable");
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