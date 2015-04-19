//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

var rAigis = require("./../index");

//-----------------------------------------------------

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    console.time("$typenize.string");

    while(l--)
    {
        $typenize("float", data);
    }

    console.timeEnd("$typenize.string");
}

//------------------------------]>

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    console.time("parseFloat");

    while(l--)
    {
        parseFloat(data);
    }

    console.timeEnd("parseFloat");
}
//------------------------------]>

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    var fXEnd = function (in2) { return parseFloat(in2); };
    var fXBegin = function(in1) { return fXEnd(in1); };

    console.time("parseFloat + functions");

    while(l--)
    {
        fXBegin(data);
    }

    console.timeEnd("parseFloat + functions");
}