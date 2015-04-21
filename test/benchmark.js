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

    console.time("$typenize.string: number");

    while(l--)
    {
        $typenize("float", data);
    }

    console.timeEnd("$typenize.string: number");
}

//---------------)>

{
    var l = 1000 * 1000 * 1;

    var data;

    console.time("$typenize.string: undefined");

    while(l--)
    {
        $typenize("float", data);
    }

    console.timeEnd("$typenize.string: undefined");
}

//------------------------------]>

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    console.time("parseFloat: nubmer");

    while(l--)
    {
        parseFloat(data);
    }

    console.timeEnd("parseFloat: nubmer");
}

//---------------)>

{
    var l = 1000 * 1000 * 1;

    var data;

    console.time("parseFloat: undefined");

    while(l--)
    {
        parseFloat(data);
    }

    console.timeEnd("parseFloat: undefined");
}

//------------------------------]>

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    var fXEnd = function(in2) { return parseFloat(in2); };
    var fXBegin = function(in1) { return fXEnd(in1); };

    console.time("parseFloat + functions: nubmer");

    while(l--)
    {
        fXBegin(data);
    }

    console.timeEnd("parseFloat + functions: nubmer");
}

//---------------)>

{
    var l = 1000 * 1000 * 1;

    var data = 1;

    var fXEnd = function(in2) { return parseFloat(in2); };
    var fXBegin = function(in1) { return fXEnd(); };

    console.time("parseFloat + functions: undefined");

    while(l--)
    {
        fXBegin(data);
    }

    console.timeEnd("parseFloat + functions: undefined");
}