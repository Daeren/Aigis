//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.00.015
//
//-----------------------------------------------------

var $aigis = (function createInstance() {
    "use strict";

    //-----------------------------------------------------

    var C_MODE_TYPENIZE         = 1,
        C_MODE_SANITIZE         = 2,
        C_MODE_VALIDATE         = 3;

    var customTypesStore        = {},
        customRulesStore        = {};

    var typenizeSchemaStore     = {},
        sanitizeSchemaStore     = {},
        validateSchemaStore     = {};

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

    var gExport = {
        "createInstance": function(isGlobal) {
            var r = createInstance();

            r.global(isGlobal);

            return r;
        },

        //--------]>

        "global": function(v) {
            if(global && typeof(global) !== "object" || typeof(v) === "undefined")
                return this;

            if(v) {
                var gTObj = gExport.typenize,
                    gSObj = gExport.sanitize,
                    gVObj = gExport.validate;

                for(var i in gExport) {
                    if(gExport.hasOwnProperty(i))
                        gTObj[i] = gSObj[i] = gVObj[i] = gExport[i];
                }

                if(typeof(global.$typenize) === "undefined")
                    global.$typenize = gTObj;

                if(typeof(global.$sanitize) === "undefined")
                    global.$sanitize = gSObj;

                if(typeof(global.$validate) === "undefined")
                    global.$validate = gVObj;
            } else {
                if(global.$typenize === gExport.typenize)
                    delete global.$typenize;

                if(global.$sanitize === gExport.sanitize)
                    delete global.$sanitize;

                if(global.$validate === gExport.validate)
                    delete global.$validate;
            }

            return this;
        },

        "type": function(name, func) {
            wFuncStore(name, func, customTypesStore);
            return this;
        },

        "rule": function(name, func) {
            wFuncStore(name, func, customRulesStore);
            return this;
        },

        //--------]>

        "typenize": function(schema, data, options) {
            return parseSchema(C_MODE_TYPENIZE, schema, data, options, {
                "string": function(schema, data, options) {
                    return $typenize(schema, data, options);
                },

                "hashTable": function(schema, data, options) {
                    var optScenario = options.on;

                    var result = {};

                    for(var field in schema) {
                        if(!Object.prototype.hasOwnProperty.call(schema, field)) continue;

                        var nameFunc,
                            schemaData = schema[field],
                            fieldData = data[field];

                        if(!schemaData) {
                            throw new Error("[!] Typenize | schemaData: " + schemaData);
                        }

                        //-----------------)>

                        if(typeof(schemaData) === "string") {
                            nameFunc = schemaData;
                            schemaData = {};
                        }
                        else if(typeof(schemaData) === "object") {
                            nameFunc = schemaData.type || schemaData.use;

                            if(typeof(schemaData.on) !== "undefined" && schemaData.on != optScenario)
                                continue;
                        }
                        else {
                            throw new Error("[!] Typenize | schemaData: " + schemaData);
                        }

                        if(nameFunc[0] === "?") {
                            if(typeof(fieldData) === "undefined")
                                continue;

                            nameFunc = nameFunc.substring(1);
                        }

                        //-----------------)>

                        result[field] = $typenize(nameFunc, fieldData, schemaData);
                    }

                    return result;
                }
            });
        },

        "sanitize": function(schema, data, options) {
            return parseSchema(C_MODE_SANITIZE, schema, data, options, {
                "string": function(schema, data, options) {
                    return $sanitize(schema, $typenize(schema, data, options), options);
                },

                "hashTable": function(schema, data, options) {
                    var optScenario = options.on;

                    var result = {};

                    for(var field in schema) {
                        if(!Object.prototype.hasOwnProperty.call(schema, field)) continue;

                        var nameFunc,
                            schemaData = schema[field],
                            fieldData = data[field];

                        if(!schemaData) {
                            throw new Error("[!] Sanitize | schemaData: " + schemaData);
                        }

                        //-----------------)>

                        if(typeof(schemaData) === "string") {
                            nameFunc = schemaData;
                            schemaData = {};
                        }
                        else if(typeof(schemaData) === "object") {
                            nameFunc = schemaData.type || schemaData.use;

                            if(typeof(schemaData.on) !== "undefined" && schemaData.on != optScenario)
                                continue;
                        }
                        else {
                            throw new Error("[!] Sanitize | schemaData: " + schemaData);
                        }

                        if(nameFunc[0] === "?") {
                            if(typeof(fieldData) === "undefined")
                                continue;

                            nameFunc = nameFunc.substring(1);
                        }

                        //-----------------)>

                        result[field] = $sanitize(nameFunc, $typenize(nameFunc, fieldData, schemaData), schemaData);
                    }

                    return result;
                }
            });
        },

        "validate": function(schema, data, options) {
            return parseSchema(C_MODE_VALIDATE, schema, data, options, {
                "string": function(schema, data, options) {
                    return $validate(schema, data, options, options.data);
                },

                "hashTable": function(schema, data, options) {
                    var optScenario = options.on,
                        optErrors   = options.errors;

                    var result = optErrors ? null : true;

                    for(var field in schema) {
                        if(!Object.prototype.hasOwnProperty.call(schema, field)) continue;

                        var nameFunc,

                            schemaData  = schema[field],
                            fieldData   = data[field];

                        if(!schemaData) {
                            throw new Error("[!] Validation | schemaData: " + schemaData);
                        }

                        //-----------------)>

                        if(typeof(schemaData) === "string") {
                            nameFunc = schemaData;
                            schemaData = {};
                        }
                        else if(typeof(schemaData) === "object") {
                            nameFunc = schemaData.rule || schemaData.use;

                            if(typeof(schemaData.on) !== "undefined" && schemaData.on != optScenario)
                                continue;
                        }
                        else {
                            throw new Error("[!] Validation | schemaData: " + schemaData);
                        }

                        if(nameFunc[0] === "?") {
                            if(typeof(fieldData) === "undefined")
                                continue;

                            nameFunc = nameFunc.substring(1);
                        }

                        //-----------------)>

                        if(!$validate(nameFunc, fieldData, schemaData, data)) {
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
            });
        }
    };

    //---------[Storage]----------}>

    {
        var gTObj = gExport.typenize,
            gSObj = gExport.sanitize,
            gVObj = gExport.validate;

        ["set", "get", "run"]
            .forEach(function(name) {
                function buildFunc(obj, store) {
                    switch(name) {
                        case "set":
                            return function(name, data) {
                                store[name] = data;
                                return obj;
                            };

                        case "get":
                            return function(name) {
                                return store[name];
                            };

                        case "run":
                            return function(name, data, options) {
                                return obj(store[name], data, options);
                            };
                    }
                }

                gTObj[name] = buildFunc(gTObj, typenizeSchemaStore);
                gSObj[name] = buildFunc(gSObj, sanitizeSchemaStore);
                gVObj[name] = buildFunc(gVObj, validateSchemaStore);
            });
    }

    //------------------)>

    return gExport;

    //-----------------------------]>

    function $typenize(type, input, options) {
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
                    input = {};

                if(typeof(options.schema) === "object") {
                    return gExport.typenize(options.schema, input, options);
                }

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
                var func = customTypesStore[type];

                if(func)
                    return func(input, options);

                throw new Error("[!] Sanitize | Unknown type.\n" + type + " : " + JSON.stringify(options));
        }
    }

    function $sanitize(type, input, options) {
        switch(type) {
            case "string":
                if(!input) {
                    if(typeof(options.default) === "string")
                        input = options.default;

                    break;
                }

                if(typeof(options.enum) !== "undefined")
                    return options.enum.indexOf(input) === -1 ? "" : input;

                //------------]>

                if(options.trim)
                    input = input.trim();
                else if(options.ltrim)
                    input = input.replace(/^\s/g, "");
                else if(options.rtrim)
                    input = input.replace(/\s$/g, "");

                //------------]>

                if(typeof(options.max) !== "undefined" && input.length > options.max)
                    input = input.substring(0, options.max);

                if(options.onlyDigits)
                    input = input.replace(/\D/g, "");
                else if(options.onlyAlphanumeric)
                    input = input.replace(/[\W_]/g, "");
                else if(options.onlyWordchar)
                    input = input.replace(/\W/g, "");

                //------------]>

                if(options.trim)
                    input = input.trim();
                else if(options.rtrim)
                    input = input.replace(/\s+$/g, "");

                //------------]>

                if(options.uppercase)
                    input = input.toUpperCase();
                else if(options.lowercase)
                    input = input.toLowerCase();

                if(options.escape)
                    input = input
                        .replace(/&/g, "&amp;").replace(/\//g, "&#x2F;")
                        .replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
                        .replace(/</g, "&lt;").replace(/>/g, "&gt;");

                break;

            case "integer":
                if(isNaN(input)) {
                    if(typeof(options.default) === "number")
                        input = parseInt(options.default, 10);

                    break;
                }

                if(typeof(options.enum) !== "undefined")
                    return options.enum.indexOf(input) === -1 ? NaN : input;

                //------------]>

                if(options.abs)
                    input = Math.abs(input);

                if(typeof(options.min) !== "undefined" && input < options.min)
                    return parseInt(options.min, 10);

                if(typeof(options.max) !== "undefined" && input > options.max)
                    return parseInt(options.max, 10);

                break;

            case "float":
                if(isNaN(input)) {
                    if(typeof(options.default) === "number")
                        input = options.default;

                    break;
                }

                if(typeof(options.enum) !== "undefined")
                    return options.enum.indexOf(input) === -1 ? NaN : input;

                //------------]>

                if(options.abs)
                    input = Math.abs(input);

                if(typeof(options.min) !== "undefined" && input < options.min)
                    return parseFloat(options.min);

                if(typeof(options.max) !== "undefined" && input > options.max)
                    return parseFloat(options.max);

                break;

            case "array":
                if(typeof(options.max) !== "undefined" && input.length > options.max)
                    input.length = options.max;

                break;

            case "date":
                if(!input.getTime()) {
                    if(typeof(options.default) !== "undefined")
                        input = new Date(options.default);

                    break;
                }

                if(typeof(options.min) !== "undefined" && input < options.min)
                    return new Date(options.min);

                if(typeof(options.max) !== "undefined" && input > options.max)
                    return new Date(options.max);

                break;
        }

        return input;
    }

    function $validate(use, input, options, data) {
        switch(use) {
            case "null":
                return input === null;

            case "nan":
                return typeof(input) === "number" && isNaN(input);

            case "finite":
                return typeof(input) === "number" && isFinite(input);

            //-----------------------]>

            case "boolean":
                return typeof(input) === "boolean";

            case "string":
                if(typeof(input) !== "string")
                    return false;

                return !(
                (typeof(options.min) !== "undefined" && input.length < options.min) ||
                (typeof(options.max) !== "undefined" && input.length > options.max) ||
                (typeof(options.pattern) !== "undefined" && !options.pattern.test(input)) ||
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1)
                );

            case "integer":
                if(typeof(input) !== "number" || isNaN(input))
                    return false;

                return !(
                (input !== parseInt(input, 10)) ||
                (typeof(options.min) !== "undefined" && input < options.min) ||
                (typeof(options.max) !== "undefined" && input > options.max) ||
                (typeof(options.divisibleBy) !== "undefined" && (input % options.divisibleBy) !== 0) ||
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1)
                );

            case "float":
                if(typeof(input) !== "number" || isNaN(input))
                    return false;

                return !(
                (typeof(options.min) !== "undefined" && input < options.min) ||
                (typeof(options.max) !== "undefined" && input > options.max) ||
                (typeof(options.divisibleBy) !== "undefined" && (input % options.divisibleBy) !== 0) ||
                (typeof(options.enum) !== "undefined" && options.enum.indexOf(input) === -1)
                );

            case "date":
                if(!(input instanceof(Date)) || !input.getTime())
                    return false;

                return !(
                (typeof(options.min) !== "undefined" && input < options.min) ||
                (typeof(options.max) !== "undefined" && input > options.max)
                );

            case "hashTable":
                if(Array.isArray(input) || !input)
                    return false;

                return typeof(input) === "object";

            case "array":
                if(!Array.isArray(input))
                    return false;

                return !(
                (typeof(options.min) !== "undefined" && input.length < options.min) ||
                (typeof(options.max) !== "undefined" && input.length > options.max)
                );

            case "json":
                return input === null || typeof(input) === "object";

            //-----------------------]>

            case "required":
                return !(
                input === null || typeof(input) === "undefined" ||
                (typeof(input) === "number" && input !== input) ||
                (typeof(input) === "string" && !input.length) ||
                (input instanceof(Date) && !input.getTime())
                );

            case "equal":
                var d;

                if(typeof(options.value) !== "undefined") {
                    d = options.value;

                    if(typeof(input) !== "string")
                        input = $typenize("string", input);

                    if(typeof(d) !== "string")
                        d = $typenize("string", d);

                    return input === d;
                }

                if(typeof(options.field) !== "undefined" && data && typeof(data) === "object") {
                    d = data[options.field];

                    if(typeof(input) !== "string")
                        input = $typenize("string", input);

                    if(typeof(d) !== "string")
                        d = $typenize("string", d);

                    return input === d;
                }

                return false;

            case "notEmpty":
                return typeof(input) === "string" && !input.match(/^[\s\t\r\n]*$/);

            case "lowercase":
                return typeof(input) === "string" && input === input.toLowerCase();

            case "uppercase":
                return typeof(input) === "string" && input === input.toUpperCase();

            //-----------------------]>

            case "wordchar":
                return typeof(input) === "string" && !!input.match(/^[\w]+$/);

            case "alphanumeric":
                return typeof(input) === "string" && !!input.match(/^[a-zA-Z0-9]+$/);

            case "alpha":
                return typeof(input) === "string" && !!input.match(/^[a-zA-Z]+$/);

            case "numeric":
                return typeof(input) === "string" && !!input.match(/^[0-9]+$/);

            case "hexadecimal":
                return typeof(input) === "string" && !!input.match(/^[0-9a-fA-F]+$/);

            case "email":
                return typeof(input) === "string" && !!input.match(/^(?:[\w\!\#\$\%\&\"\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\"\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);

            case "url":
                return typeof(input) === "string" && !!input.match(/^(?!mailto:)(?:(?:https?|ftp|ssh|ws|gopher|news|telnet|ldap):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);

            case "mongoId":
                return typeof(input) === "string" && !!input.match(/^[0-9a-fA-F]{24}$/);

            //-----------------------]>

            case "hexColor":
                if(typeof(input) !== "string")
                    return false;

                return !!input.match(options.strict ? /^#[0-9A-F]{6}$/i : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i);

            case "creditcard":
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

            case "phone":
                if(!input || typeof(input) !== "string")
                    return false;

                ///---)>

                var rgPhone = gVPhones[options.locale || "ru-RU"];

                return rgPhone && rgPhone.test(input);

            case "uuid":
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

            case "ip":
                if(!input || typeof(input) !== "string")
                    return false;

                ///---)>

                var version = options.version,
                    ipV4 = function() {
                        if((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(input)) {
                            var parts = input.split(".").sort();
                            // no need to check for < 0 as regex won't match in that case
                            return !(parts[3] > 255);
                        }
                    };

                ///---)>

                if(version && version != 4 && version != 6)
                    return false;

                if(!version && !ipV4() && !(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(input))
                    return false;

                if(version == 4 && !ipV4())
                    return false;

                if(version == 6 && !(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(input))
                    return false;

                return true;

            case "ascii":
                return typeof(input) === "string" && (/^[\x00-\x7F]+$/).test(input);

            case "base64":
                return typeof(input) === "string" && (/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/).test(input);

            //------------------------]>

            default:
                var func = customRulesStore[use];

                if(func)
                    return func(input, options);

                throw new Error("[!] Validation | Unknown rule.\n" + use + " : " + JSON.stringify(options));
        }
    }

    //-------[HELPERS]-------}>

    function parseSchema(mode, schema, data, options, callbacks) {
        if(!schema)
            throw new Error("[!] Empty schema.");

        options = options || {};

        //----------------]>

        if(typeof(schema) === "string") {
            if(schema[0] === "?") {
                if(typeof(data) === "undefined") {
                    switch(mode) {
                        case C_MODE_TYPENIZE:
                        case C_MODE_SANITIZE:
                            return undefined;

                        case C_MODE_VALIDATE:
                            return true;
                    }
                }

                schema = schema.substring(1);
            }

            return callbacks.string(schema, data, options);
        }

        //-------]>

        if(typeof(schema) === "object" && !Array.isArray(schema)) {
            if(!data || typeof(data) !== "object") {
                switch(mode) {
                    case C_MODE_TYPENIZE:
                    case C_MODE_SANITIZE:
                        return null;

                    case C_MODE_VALIDATE:
                        return false;
                }
            }

            //----------------)>

            return callbacks.hashTable(schema, data, options);
        }

        //----------------]>

        throw new Error("[!] Invalid schema.");
    }

    function wFuncStore(name, func, store) {
        if(name === null)
            return;

        switch(typeof(name)) {
            case "string":
                if(func === null) delete store[name];
                else if(typeof(func) === "function") store[name] = func;

                break;

            case "object":
                for(var field in name) {
                    if(!Object.prototype.hasOwnProperty.call(name, field)) continue;

                    func = name[field];

                    if(func === null) delete store[name];
                    else if(typeof(func) === "function") store[name] = func;
                }

                break;
        }
    }
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = $aigis.global(true);
}