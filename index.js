﻿//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.00.003
//
//-----------------------------------------------------

var $aigis = (function createInstance() {
    "use strict";

    //-----------------------------------------------------

    var gVPhones = {
        "ru-RU":    /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
        "zh-CN":    /^(\+?0?86\-?)?1[345789]\d{9}$/,
        "en-ZA":    /^(\+?27|0)\d{9}$/,
        "en-AU":    /^(\+?61|0)4\d{8}$/,
        "en-HK":    /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
        "fr-FR":    /^(\+?33|0)[67]\d{8}$/,
        "pt-PT":    /^(\+351)?9[1236]\d{7}$/,
        "el-GR" :   /^(\+30)?((2\d{9})|(69\d{8}))$/
    };

    //-----------------------------]>

    var gVMethods = {
        "null": function(input) {
            return input === null;
        },

        "nan": function(input) {
            return typeof(input) === "number" && isNaN(input);
        },

        "finite": function(input) {
            return typeof(input) === "number" && isFinite(input);
        },

        //-----------------------]>

        "boolean": function(input) {
            return typeof(input) === "boolean";
        },

        "string": function(input, options) {
            if(typeof(input) !== "string")
                return false;

            if(
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1) ||
                (typeof(options.pattern) !== "undefined" && !options.pattern.test(input)) ||
                (typeof(options.min) !== "undefined" && input.length < options.min) ||
                (typeof(options.max) !== "undefined" && input.length > options.max)
            )
                return false;

            return true;
        },

        "integer": function(input, options) {
            if(typeof(input) !== "number" || isNaN(input))
                return false;

            if(
                (input !== parseInt(input, 10)) ||
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1) ||
                (typeof(options.min) !== "undefined" && input < options.min) ||
                (typeof(options.max) !== "undefined" && input > options.max)
            )
                return false;

            return true;
        },

        "float": function(input, options) {
            if(typeof(input) !== "number" || isNaN(input))
                return false;

            if(
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1) ||
                (typeof(options.min) !== "undefined" && input < options.min) ||
                (typeof(options.max) !== "undefined" && input > options.max)
            )
                return false;

            return true;
        },

        "date": function(input) {
            if(!input || !(input instanceof(Date)) || !input.getTime())
                return false;

            return true;
        },

        "hashTable": function(input) {
            if(Array.isArray(input) || !input)
                return false;

            if(typeof(input) === "object")
                return true;

            return false;
        },

        "array": function(input, options) {
            if(!Array.isArray(input))
                return false;

            if(
                (typeof(options.min) !== "undefined" && input.length < options.min) ||
                (typeof(options.max) !== "undefined" && input.length > options.max)
            )
                return false;

            return true;
        },

        "json": function(input) {
            if(typeof(input) !== "object")
                return false;

            return true;
        },

        //-----------------------]>

        "required": function(input) {
            return !(
            input === null || typeof(input) === "undefined" ||
            (typeof(input) === "number" && input !== input) ||
            (typeof(input) === "string" && !input.length) ||
            (input instanceof(Date) && !input.getTime())
            );
        },

        "notEmpty": function(input) {
            if(typeof(input) === "string" && input.match(/^[\s\t\r\n]*$/))
                return false;

            return gVMethods.required(input);
        },

        "lowercase": function(input) {
            return typeof(input) === "string" && input === input.toLowerCase()
        },

        "uppercase": function(input) {
            return typeof(input) === "string" && input === input.toUpperCase()
        },

        //-----------------------]>

        "alphanumeric": function(input) {
            return typeof(input) === "string" && !!input.match(/^[a-zA-Z0-9]+$/);
        },

        "alpha": function(input) {
            return typeof(input) === "string" && !!input.match(/^[a-zA-Z]+$/);
        },

        "numeric": function(input) {
            return typeof(input) === "string" && !!input.match(/^[0-9]+$/);
        },

        "hexadecimal": function(input) {
            return typeof(input) === "string" && !!input.match(/^[0-9a-fA-F]+$/);
        },

        "email": function(input) {
            return typeof(input) == "string" && !!input.match(/^(?:[\w\!\#\$\%\&\"\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\"\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
        },

        "url": function(input) {
            return typeof(input) === "string" && !!input.match(/^(?!mailto:)(?:(?:https?|ftp|ssh|ws|gopher|news|telnet|ldap):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
        },

        "mongoId": function(input) {
            return typeof(input) === "string" && !!input.match(/^[0-9a-fA-F]{24}$/);
        },

        //-----------------------]>

        "hexColor": function(input, options) {
            if(typeof(input) !== "string")
                return false;

            return !!input.match(options.strict ? /^#[0-9A-F]{6}$/i : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i);
        },

        "creditcard": function(input) {
            if(typeof(input) !== "string")
                return false;

            input = input.replace(/[^0-9]+/g, "");

            if(!input || !input.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/))
                return false;

            var sum = 0, shouldDouble = false;
            var digit, tmpNum;

            for(var i = input.length - 1; i >= 0; i--) {
                digit = input.substring(i, (i + 1));
                tmpNum = parseInt(digit, 10);

                if(shouldDouble) {
                    tmpNum *= 2;
                    sum += (tmpNum >= 10) ? ((tmpNum % 10) + 1) : tmpNum;
                } else
                    sum += tmpNum;

                shouldDouble = !shouldDouble;
            }

            return (sum % 10) === 0;
        },

        "phone": function(input, options) {
            if(!input || typeof(input) !== "string")
                return false;

            ///---)>

            var rgPhone = gVPhones[options.locale || "ru-RU"];

            return rgPhone && rgPhone.test(input);
        },

        "uuid": function(input, options) {
            if(!input || typeof(input) !== "string")
                return false;

            ///---)>

            var version = options.version,
                pattern;

            if(version == 3 || version == "v3")
                pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
            else if(version == 4 || version == "v4")
                pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
            else if(version == 5 || version == "v5")
                pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
            else
                pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

            return pattern.test(input);
        },

        "ip": function(input, options) {
            if(!input || typeof(input) !== "string")
                return false;

            ///---)>

            var version = options.version;

            function ipV4() {
                if((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(input)) {
                    var parts = input.split(".").sort();
                    // no need to check for < 0 as regex won't match in that case
                    return !(parts[3] > 255);
                }
            }

            ///---)>

            if(!version && !ipV4() && !(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(input))
                return false;

            if(version == 4 && !ipV4())
                return false;

            if(version == 6 && !(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(input))
                return false;

            return true;
        },

        "ascii": function(input) {
            return typeof(input) === "string" && (/^[\x00-\x7F]+$/).test(input);
        },

        "base64": function(input) {
            return typeof(input) === "string" && (/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/).test(input);
        }
    };

    //-----------------------------]>

    function normalize(type, input, options) {
        if(type === "custom")
            return input;

        //------------------]>

        switch(type) {
            case "boolean":
                if(typeof(input) === "boolean")
                    return input;

                if(typeof(input) === "string")
                    return input === "true" || input === "on" || input === "yes" || input === "1";

                return false;

            case "string":
                if(typeof(input) === "string")
                    return input;

                if(input === null || typeof(input) === "undefined")
                    return "";

                if(typeof(input.toString) === "function")
                    return input.toString();

                if(typeof(input) === "object")
                    return Object.prototype.toString.call(input);

                return input + "";

            case "integer":
                return parseInt(input, options.radix || 10);

            case "float":
                if(typeof(input) === "number")
                    return input;

                return parseFloat(input);

            case "date":
                if(input instanceof(Date))
                    return input;

                return new Date(input);

            case "hashTable":
                if(!input || Array.isArray(input))
                    return {};

                if(typeof(input) === "object")
                    return input;

                if(typeof(input) !== "string")
                    return {};

                try {
                    input = JSON.parse(input);
                    return Array.isArray(input) ? {} : input;
                } catch(e) {
                }

                return {};

            case "array":
                if(Array.isArray(input))
                    return input;

                if(!input || typeof(input) !== "string")
                    return [];

                try {
                    input = JSON.parse(input);
                    return Array.isArray(input) ? input : [];
                } catch(e) {
                }

                return [];

            case "json":
                if(typeof(input) === "object")
                    return input;

                if(!input || typeof(input) !== "string")
                    return null;

                try {
                    return JSON.parse(input);
                } catch(e) {
                }

                return null;

            //------------------------]>

            default:
                throw "[!] Sanitizer | Unknown Type.\n" + type + " : " + JSON.stringify(options);
        }
    }

    function postNormilize(type, input, options) {
        switch(type) {
            case "string":
                if(options.trim)
                    input = input.trim();

                if(typeof(options.length) !== "undefined" && input.length > options.length)
                    input = input.substring(0, options.length);

                break;

            case "integer":
                if(typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1)
                    return NaN;

                if(typeof(options.min) !== "undefined" && input < options.min)
                    return parseInt(options.min, 10);

                if(typeof(options.max) !== "undefined" && input > options.max)
                    return parseInt(options.max, 10);

                break;

            case "float":
                if(typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1)
                    return NaN;

                if(typeof(options.min) !== "undefined" && input < options.min)
                    return parseFloat(options.min);

                if(typeof(options.max) !== "undefined" && input > options.max)
                    return parseFloat(options.max);

                break;

            case "array":
                if(typeof(options.max) !== "undefined" && input.length > options.max)
                    input.length = options.max;

                break;
        }

        return input;
    }

    //-------[HELPERS]-------}>

    function wFuncStore(name, func, store) {
        if(func === null) delete store[name];
        else if(typeof(func) == "function") store[name] = func;
        else return store[name];
    }

    //-----------------------------]>

    var gExport = {
        "global": function(v) {
            if(!typeof(global) == "object" || typeof(v) == "undefined" || typeof(global.$validate) != "undefined")
                return this;

            if(v) {
                var gSObj = gExport.sanitize,
                    gVObj = gExport.validate;

                for(var i in gExport) {
                    if(gExport.hasOwnProperty(i))
                        gSObj[i] = gVObj[i] = gExport[i];
                }

                global.$sanitize = gSObj;
                global.$validate = gVObj;
            } else {
                delete global.$sanitize;
                delete global.$validate;
            }

            return this;
        },

        "rule": function(name, func) {
            return wFuncStore(name, func, gVMethods);
        },

        //--------]>

        "sanitize": function(schema, data, options) {
            if(!schema)
                throw "[!] Sanitizer | schema: " + schema;

            options = options || {};

            //----------------]>

            if(typeof(schema) === "string") {
                if(schema[0] == "?") {
                    if(typeof(data) == "undefined")
                        return undefined;

                    schema = schema.substring(1);
                }

                return postNormilize(schema, normalize(schema, data, options), options);
            }

            if(typeof(schema) === "object") {
                if(!data || typeof(data) !== "object")
                    return null;

                //----------------)>

                var result = {};

                for(var field in schema) {
                    if(!schema.hasOwnProperty(field)) continue;

                    var nameFunc,
                        schemaData = schema[field],
                        fieldData = data[field];

                    //-----------------)>

                    if(typeof(schemaData) === "string") {
                        nameFunc = schemaData;
                        schemaData = {};
                    } else if(typeof(schemaData) === "object") {
                        nameFunc = schemaData.use;
                    }

                    if(nameFunc[0] === "?") {
                        if(typeof(fieldData) === "undefined")
                            continue;

                        nameFunc = nameFunc.substring(1);
                    }

                    //-----------------)>

                    result[field] = postNormilize(nameFunc, normalize(nameFunc, fieldData, schemaData), schemaData);
                }

                return result;
            }

            //----------------]>

            throw "[!] Sanitizer | schema: " + schema;
        },

        "validate": function(schema, data, options) {
            if(!schema)
                throw "[!] Validation | schema: " + schema;

            options = options || {};

            //----------------]>

            if(typeof(schema) === "string") {
                if(schema[0] == "?") {
                    if(typeof(data) == "undefined")
                        return true;

                    schema = schema.substring(1);
                }

                var func = gVMethods[schema];

                if(!func)
                    throw "[!] Validation | not found method: " + schema;

                return func(data, options);
            }

            //-------]>

            if(typeof(schema) === "object") {
                if(!data || typeof(data) !== "object")
                    return false;

                //----------------)>

                var optErrors = options.errors;
                var result = optErrors ? null : true;

                for(var field in schema) {
                    if(!schema.hasOwnProperty(field)) continue;

                    var nameFunc,
                        schemaData = schema[field],
                        fieldData = data[field];

                    //-----------------)>

                    if(typeof(schemaData) === "string") {
                        nameFunc = schemaData;
                        schemaData = {};
                    } else if(typeof(schemaData) === "object") {
                        nameFunc = schemaData.use;
                    }

                    if(nameFunc[0] === "?") {
                        if(typeof(fieldData) === "undefined")
                            continue;

                        nameFunc = nameFunc.substring(1);
                    }

                    //-----------------)>

                    var func = gVMethods[nameFunc];

                    if(!func)
                        throw "[!] Validation | not found method: " + nameFunc;

                    if(!func(fieldData, schemaData)) {
                        if(optErrors) {
                            result = result || [];
                            result.push({
                                "field":    field,
                                "use":      nameFunc,

                                "input":    fieldData
                            });
                        } else {
                            result = false;
                            break;
                        }
                    }



                }

                return result;
            }

            //----------------]>

            throw "[!] Validation | schema: " + schema;
        }
    };

    return gExport;
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = $aigis;

    if(typeof(global) == "object")
        $aigis.global(true);
}