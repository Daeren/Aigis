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

var schUser = {"name": "string", "score": "integer"};

var tpzUser = $typenize(schUser),
    snzUser = $sanitize(schUser),
    vldUser = $validate(schUser);

var data = {"name": "DT", "score": 13.7, "someData": 999};


console.log(
    tpzUser(data) //_ Rewrite
);
console.log(
    tpzUser.format("My name: {name};\nMy score: {score};", data)
);


console.log("\n");

console.log(
    snzUser(data) //_ New object
);
console.log(
    snzUser.format("My name: {name};\nMy score: {score};", data)
);


console.log("\n");

console.log(
    data,

    vldUser(data),
    vldUser(tpzUser(data)),
    vldUser(snzUser(data))
);
console.log(
    vldUser.format("vldUser: {}", data)
);


console.log("\n");

console.log(
    $typenize("hashTable").format("{video}: {views}", '{"video": "cats", "views": 100500}')
);
console.log(
    $sanitize("array").format("Array: {2}, {1}, {0}", "[11, 12, 13]", {"max": 2})
);
console.log(
    $typenize("string").format("Date: {}", new Date())
);

return; // <--------------- !


console.log(
    $typenize.format({"name": "DT", "score": 12.2}, "My name: {name};\nMy score: {score};")
);

console.log(
    $typenize.format("My name: {0};\nMy score: {1};", "DT", 11.1)
);

return; // <--------------- !


//-----------------------------------------------------



var data = {
    "data": [2.2, "name", "[skip/del]ThisElem"]
};

console.log(
    $typenize({"data": {"type": "array", "schema": ["integer", "string"]}}, data)
);
console.log(
    $sanitize({"data": {"type": "array", "schema": ["integer", "string"]}}, data)
);

//-----------]>

var data = [6.9, "name", "delThisElem"];

console.log(
    $sanitize("array", data, {"schema": ["integer", "string"]})
);

//-----------]>

var data = {
    "data": [{"pts": 2.2}, "name"]
};

console.log(
    $typenize({"data": {"type": "array", "schema": [{"pts": "integer"}]}}, data)
);
console.log(
    $sanitize({"data": {"type": "array", "schema": [{"pts": "integer"}]}}, data)
);

console.log("\n\n");

//-----------]>

var schema = {
    "data": {
        "type": "hashTable",

        "schema": {
            "login":    "string",
            "password": "string",

            "more": {
                "type": "hashTable",

                "schema": {
                    "someData": "string"
                }
            }
        }
    }
};

var data = {
    "test": 1,
    "data": JSON.stringify({
        "login": 1,
        "tex": 2
    })
};

console.log($sanitize(schema, data));
console.log($typenize(schema, data));
console.log("\n\n");

var data = {
    "test": 1,
    "data": {
        "login": 1,
        "tex": 2
    }
};

console.log($typenize(schema, data));
console.log($sanitize(schema, data));
console.log("\n\n");


//-----------------------------------------------------


console.log("+-------------------------+");
console.log("| Schema");
console.log("+-------------------------+");

var schema = {
        "name": {
            "type": "string",
            "rule": "required",

            "max":  3,
            "trim": true
        },

        "status": "?string",

        "pts": {
            "use": "integer",

            "max":  30,
            "abs":  true
        },

        "data": {
            "type": "hashTable",

            "schema": {
                "login":    "string",
                "password": "string",

                "more": {
                    "type": "hashTable",

                    "schema": {
                        "someData": "string"
                    }
                }
            }
        }
    },

    data = {"name": " XX + ", "pts": "-60", "delThisField": "data"};

console.log(JSON.stringify({
    "T0":   $typenize(schema, data), //_ { name: ' XX + ', pts: -60,  ...}
    "T1":   $sanitize(schema, data) //_ { name: 'XX', pts: 30, ... }

    //"T2":   $validate(schema, data) //_ error ("data" without "rule")
}, null, "\t"));




console.log("+-------------------------+");
console.log("| Store");
console.log("+-------------------------+");

$typenize.set("myName", {"name": "string"});

console.log("0#", $typenize.run("myName", {"name": [1,2,3]}));
console.log("1#", $typenize.get("myName"));


$sanitize.set("myName", {"name": "string"});

console.log("0#", $sanitize.run("myName", {"name": [1,2,3]}));
console.log("1#", $sanitize.get("myName"));


$validate.set("myName", {"name": "string"});

console.log("0#", $validate.run("myName", {"name": [1,2,3]}));
console.log("1#", $validate.get("myName"));




console.log("+-------------------------+");
console.log("| T: Schema");
console.log("+-------------------------+");

console.log("0#", $typenize("string", 10) + 10);


var schema  = {
        "name":     "?string",

        "data":     {
            "type":     "hashTable",

            "schema":   {
                "login":    "string",
                "password": "string",

                "deep":     {
                    "type":     "hashTable",

                    "schema":   {
                        "someData":    "string"
                    }
                }
            }
        }
    },

    data    = {
        "name": "XX"/*,

        "data": {
            "login":    new Date(),
            "password": /s+/g,

            "deep":     {
                "someData":   [1,2,3]
            }
        }
        */
    };

console.log("1#", $typenize(schema, data));



console.log("+-------------------------+");
console.log("| S: Custom");
console.log("+-------------------------+");

$sanitize.type("testTypeDateEasy", function(input, options) {
    return new Date(input);
});

console.log("0#", $sanitize("testTypeDateEasy", "Thu, 01 Jan 1970 00:00:00 GMT-0400"));
console.log("1#", $sanitize("testTypeDateEasy", "---"));


console.log("+-------------------------+");
console.log("| S: String");
console.log("+-------------------------+");

console.log(JSON.stringify({
    "T0":   $sanitize("string", 10),
    "T1":   $sanitize("integer", "80", {"max": 50}),
    "T2":   $sanitize("array", "[1,2,3]", {"max": 2}),
    "T3":   $sanitize("integer", "50.5", {"enum": [10, 50]}),
    "T4":   $sanitize("integer", "60.5", {"enum": [10, 50]})
}, null, "\t"));


console.log("+-------------------------+");
console.log("| S: HashTable");
console.log("+-------------------------+");


var schema  = {
        "name":     {"type": "string", "rule": "required", "max": 3, "trim": true},
        "status":   "?string",
        "pts":      {"use": "integer", "max": 30, "abs": true}
    },
    data    = {"name": " XX + ", "pts": "-60", "delThisField": "data"};

console.log("0#", $typenize(schema, data));
console.log("1#", $sanitize(schema, data));
console.log("2#", $validate(schema, data));
console.log("3#", $validate(schema, $sanitize(schema, data)));



console.log("+-------------------------+");
console.log("| V: Custom");
console.log("+-------------------------+");

$validate.rule("testRuleMax10", function(input, options) {
    return input < 10;
});

console.log("0#", $validate("testRuleMax10", 50));
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

var schema  = {
        "name":         "string",

        "pswd":         "string",
        "pswdCheck":    {"use": "equal", "field": "pswd"}, //_ #1
        //"pswdCheck":    {"use": "equal", "value": "/\\w+/g"}, //_ #2

        "status":       "?string",

        "pts":          "integer"
    },
    data    = {"name": "DT", "pts": "32", "pswd": "/\\s+/g", "pswdCheck": /\s+/g}; //_ #1
    //data    = {"name": "DT", "pts": "32", "pswd": "", "pswdCheck": /\w+/g}; //_ #2

console.log("1#", $validate(schema, data));
console.log("2#", $validate(schema, data, {"errors": true}));



var schema = {
    "info": {
        "rule": "hashTable",

        "schema": {

            "login": {
                "rule": "hashTable",

                "schema": {
                    "login": "string"
                }
            }

        }
    }
};

console.log(JSON.stringify({
    "T0":   $validate(schema, {"info": {"login": {"login": 1}}}),
    "T1":   $validate(schema, {"info": {}}),
    "T2":   $validate(schema, {}),
    "T3":   $validate(schema, {"info": {"login": {"login": 1}}}, {"errors": true}),
    "T4":   $validate(schema, {"info": {"login": {"login": "test"}}})
}, null, "\t"));