//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

var rA  = require("assert");
require("../index");

//-----------------------------------------------------

var count = 0;

function test(exp, data) {
    count++;

    var result = true,
        args = Array.prototype.slice.call(arguments, 1);

    try {
        rA.deepEqual($validate.apply(null, args), exp, args);
    } catch(e) {
        result = false;

        console.log(e);
        console.log("\n");
    }

    console.log("|%s|> T%s ", result ? "+" : "-", count);
}

//-------------------------]>

console.log("+-------------------------+");
console.log("|");

{
    [
        "finite",
        "boolean", "string", "integer", "float", "date", "hashTable", "array",
        "required", "notEmpty", "lowercase", "uppercase",
        "alphanumeric", "alpha", "numeric", "hexadecimal", "email", "url", "mongoId",
        "hexColor", "creditcard", "phone", "uuid", "ip", "ascii", "base64"
    ]
        .forEach(function(e) {
            test(false, e, undefined);
            test(false, e, null);
            test(false, e, NaN);
        });

    test(true, "null", null);
    test(false, "null", undefined);
    test(false, "null", 10);
    test(false, "null", "");
    test(false, "null", NaN);

    test(true, "nan", NaN);
    test(false, "nan", undefined);
    test(false, "nan", "");
    test(false, "nan", null);

    test(true, "finite", 10);
    test(false, "finite", "");
    test(false, "finite", "10");
    test(false, "finite", +1 / 0);
    test(false, "finite", -1 / 0);

    test(true, "boolean", true);
    test(true, "boolean", false);
    test(false, "boolean", "true");

    test(false, "string", 10);
    test(true, "string", "10");

    test(true, "integer", 10);
    test(false, "integer", 10.5);
    test(false, "integer", "10");
    test(false, "integer", "");

    test(true, "float", 10);
    test(true, "float", 10.5);
    test(false, "float", "10");
    test(false, "float", "");

    test(true, "date", 10);
    test(false, "date", new Date(NaN));
    test(true, "date", new Date());
    test(false, "date", Date.now());
    test(false, "date", "23/25/2014");
    test(false, "date", "2014-25-23");
    test(false, "date", "");
    test(true, "date", "Thu, 01 Jan 1970 00:00:00 GMT-0400");

    test(true, "hashTable", {'x': 1});
    test(false, "hashTable", "{'x': 1");
    test(false, "hashTable", "[1,2]");
    test(true, "hashTable", JSON.stringify({'x': 1}));

    test(false, "array", "[1,2");
    test(true, "array", "[1,2]");
    test(true, "array", [1,2]);
    test(false, "array", {x:1});
    test(false, "array", "{'x': 1}");

    test(false, "json", undefined);
    test(true, "json", null);
    test(false, "json", NaN);
    test(false, "json", "{'x': 1");
    test(false, "json", "{'x': 1}");
    test(true, "json", JSON.stringify({'x': 1}));
    test(true, "json", "[1,2]");
    test(false, "json", "[1,2");
    test(true, "hashTable", {'x': 1});
    test(true, "array", [1,2]);

    test(false, "required", "");
    test(false, "required", new Date(NaN));

    test(false, "notEmpty", "                  ");
    test(false, "notEmpty", "\n\n");
    test(true, "notEmpty", "        1          ");
    test(true, "notEmpty", "\n2\n");
    test(false, "notEmpty", "\t\t");
    test(true, "notEmpty", "\t3\t");

    test(true, "lowercase", "0drootpop");
    test(false, "lowercase", "0DROOTPOP");

    test(true, "uppercase", "0DROOTPOP");
    test(false, "uppercase", "0drootpop");

    test(false, "alphanumeric", 10);
    test(true, "alphanumeric", "0drootpop");
    test(false, "alphanumeric", "0d@root.pop");

    test(true, "alpha", "rootpop");
    test(false, "alpha", "d@root.pop");
    test(false, "alpha", "0");
    test(false, "alpha", "0d@root.pop");

    test(false, "numeric", 10);
    test(false, "numeric", "0drootpop");
    test(false, "numeric", "0d@root.pop");
    test(false, "numeric", "drootpop");
    test(true, "numeric", "10");

    test(false, "hexadecimal", "XA");
    test(true, "hexadecimal", "FA");
    test(true, "hexadecimal", "fA");
    test(true, "hexadecimal", "fa0");

    test(true, "email", "0d@root.pop");
    test(false, "email", "0d-root.pop");
    test(false, "email", 10);

    test(false, "url", "");
    test(true, "url", "666.io");
    test(false, "url", "httpsx://666.io");
    test(false, "url", "http://666");
    test(false, "url", "ht://666");
    test(true, "url", "http://666.io");
    test(true, "url", "ssh://666.io");
    test(true, "url", "ws://666.io");
    test(true, "url", "https://666.io");
    test(true, "url", "ftp://666.io");

    test(true, "mongoId", "507f191e810c19729de860ea");
    test(false, "mongoId", "");
    test(false, "mongoId", "507f191e810c19729de860ex");
    test(false, "mongoId", "507f191e810c19729de860eax");
    test(false, "mongoId", "507f191e810c19729de860e");

    test(true, "hexColor", "#FFF");
    test(false, "hexColor", "#FFFF");
    test(true, "hexColor", "#FFFFFF");
    test(false, "hexColor", "#XFFFFF");
    test(false, "hexColor", "#XFF");

    test(false, "creditcard", "");
    test(true, "creditcard", "4539705911256127");
    test(true, "creditcard", "5112136511738516");
    test(true, "creditcard", "6011875460215667");
    test(true, "creditcard", "374931102531716");
    test(false, "creditcard", "453970591125612");
    test(false, "creditcard", "511213651173851");
    test(false, "creditcard", "601187546021566");
    test(false, "creditcard", "37493110253171");

    test(false, "phone", "");
    test(false, "phone", "95885");
    test(true, "phone", "+7 888 788 99");
    test(true, "phone", "8 888 788 99");
    test(true, "phone", "888 788 99");

    test(false, "uuid", "");
    test(true, "uuid", "550e8400-e29b-41d4-a716-446655440000");
    test(false, "uuid", "550e8400-e29b-41d4-a716-4466554400000");
    test(false, "uuid", "550e8400-e29b-41d4-a716-446655440000x");


    test(false, "ip", "");
    test(false, "ip", "100.005.055.");
    test(false, "ip", "100.005.055.x");
    test(false, "ip", "100.005.055.x88");
    test(true, "ip", "100.005.055.88");
    test(true, "ip", "3FFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF");
    test(true, "ip", "2001:db8::7");
    test(false, "ip", "2001:xb8::7");

    test(false, "ascii", "");
    test(true, "ascii", "test 99");
    test(false, "ascii", "тест 99");

    test(false, "base64", "");
    test(false, "base64", "994");
    test(true, "base64", "RFQ=");
}

console.log("+-------------------------+");