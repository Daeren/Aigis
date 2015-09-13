//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

var $aigis = (function createInstance(isGlobal) {
    "use strict";

    //-----------------------------------------------]>

    var C_MODE_TYPENIZE         = 1,
        C_MODE_SANITIZE         = 2,
        C_MODE_VALIDATE         = 3;

    var gCustomTypesStore       = {},
        gCustomRulesStore       = {};

    var gTypenizeSchemaStore    = {},
        gSanitizeSchemaStore    = {},
        gValidateSchemaStore    = {};

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

    var gVUUIDs = {
        0: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    };

    var gVIPs = {
        4: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        6: /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/
    };

    //-----------------------------]>

    var gExport = {
        "createInstance":   createInstance,

        //--------]>

        "global":           setGlobal,

        "type":             type,
        "rule":             rule,

        //--------]>

        "typenize":         typenize,
        "sanitize":         sanitize,
        "validate":         validate,

        //--------]>

        "mid":              mid
    };

    //---------[Storage]---------}>

    ["set", "get", "run"]
        .forEach(function(name) {
            gExport.typenize[name] = buildFunc(gExport.typenize, gTypenizeSchemaStore);
            gExport.sanitize[name] = buildFunc(gExport.sanitize, gSanitizeSchemaStore);
            gExport.validate[name] = buildFunc(gExport.validate, gValidateSchemaStore);

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
        });

    gExport.global(isGlobal);

    //------------------)>

    return gExport;

    //-----------------------------------------------]>

    function setGlobal(v) {
        if(global && typeof(global) !== "object" || typeof(v) === "undefined")
            return gExport;

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

        return gExport;
    }

    function type(name, func) {
        wFuncStore(name, func, gCustomTypesStore);
        return gExport;
    }

    function rule(name, func) {
        wFuncStore(name, func, gCustomRulesStore);
        return gExport;
    }

    //-----)>

    function typenize(schema, data, options) {
        return arguments.length === 1 ?
            createModel(schema, gExport.typenize) : runSchema(C_MODE_TYPENIZE, schema, data, options, $typenize, $typenizeHashTable);
    }

    function sanitize(schema, data, options) {
        return arguments.length === 1 ?
            createModel(schema, gExport.sanitize) : runSchema(C_MODE_SANITIZE, schema, data, options, $sanitizeString, $sanitizeHashTable);
    }

    function validate(schema, data, options) {
        return arguments.length === 1 ?
            createModel(schema, gExport.validate) : runSchema(C_MODE_VALIDATE, schema, data, options, $validateString, $validateHashTable);
    }

    //-----)>

    function mid(models, permittedMethods) {
        if(Array.isArray(permittedMethods)) {
            permittedMethods = permittedMethods.map(function(v) {
                return v.toUpperCase();
            });

            if(permittedMethods.length == 1)
                permittedMethods = permittedMethods[0];
        } else if(typeof(permittedMethods) === "string")
            permittedMethods = permittedMethods.toUpperCase();
        else
            permittedMethods = undefined;

        //------------------]>

        return main;

        //------------------]>

        function main(req, res, next) {
            var model, options,
                mdlName, mdlData, mdlScenario;

            //----------]>

            if(!permittedMethods) {
                if(!extrFromOther()) extrFromGet();
            } else {
                if(permittedMethods === req.method || typeof(permittedMethods) !== "string" && permittedMethods.indexOf(req.method) != -1) {
                    switch(req.method) {
                        case "GET":
                            extrFromGet();
                            break;

                        default:
                            extrFromOther();
                    }
                }
            }

            if(model) {
                if(mdlScenario)
                    options = {"scenario": mdlScenario};

                mdlData = sanitize(model, mdlData, options);

                req.model = {
                    "name":     mdlName,
                    "data":     mdlData,
                    "scenario": mdlScenario || "",

                    "validate": function() { return validate(model, mdlData, options); }
                };
            } else {
                req.model = null;
            }

            //----------]>

            next();

            //----------]>

            function extrFromGet() {
                mdlName = req.query && req.query.model;

                if(mdlName) {
                    mdlData = req.query.data;

                    if(mdlData)
                        mdlData = decodeURIComponent(mdlData);

                    mdlData = $typenize("hashTable", mdlData, {});
                    mdlScenario = req.query.scenario;

                    model = models[mdlName];
                }

                return !!mdlName;
            }

            function extrFromOther() {
                mdlName = req.body && req.body.model;

                if(mdlName) {
                    mdlData = $typenize("hashTable", req.body.data, {});
                    mdlScenario = req.body.scenario;

                    model = models[mdlName];
                }

                return !!mdlName;
            }
        }
    }

    //----------------)>

    function $typenizeHashTable(schema, data, options) {
        var optScenario = options.scenario;

        var result = data;

        for(var field in schema) {
            if(!Object.prototype.hasOwnProperty.call(schema, field)) continue;

            var nameFunc,
                schemaData = schema[field],
                fieldData = data[field];

            if(!schemaData) {
                throw new Error("[!] Typenize | schemaData: " + schemaData);
            }

            //-----------------)>

            switch(typeof(schemaData)) {
                case "string":
                    nameFunc = schemaData;
                    schemaData = {};

                    break;

                case "object":
                    nameFunc = schemaData.type || schemaData.use;

                    if(checkScenario(schemaData.on, optScenario))
                        continue;

                    break;

                default:
                    throw new Error("[!] Typenize | schemaData: " + schemaData);
            }

            switch(typeof(nameFunc)) {
                case "string":
                    if(nameFunc[0] === "?") {
                        if(typeof(fieldData) === "undefined")
                            continue;

                        nameFunc = nameFunc.substring(1);
                    }

                    break;
            }

            //-----------------)>

            result[field] = $typenize(nameFunc, fieldData, schemaData);
        }

        return result;
    }

    //-----)>

    function $sanitizeString(schema, data, options) {
        return $sanitize(schema, $typenize(schema, data, options, true), options);
    }

    function $sanitizeHashTable(schema, data, options) {
        var optScenario = options.scenario;

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

            switch(typeof(schemaData)) {
                case "string":
                    nameFunc = schemaData;
                    schemaData = {};

                    break;

                case "object":
                    nameFunc = schemaData.type || schemaData.use;

                    if(checkScenario(schemaData.on, optScenario))
                        continue;

                    break;

                default:
                    throw new Error("[!] Sanitize | schemaData: " + schemaData);
            }

            switch(typeof(nameFunc)) {
                case "string":
                    if(nameFunc[0] === "?") {
                        if(typeof(fieldData) === "undefined")
                            continue;

                        nameFunc = nameFunc.substring(1);
                    }

                    break;
            }

            //-----------------)>

            result[field] = $sanitize(nameFunc, $typenize(nameFunc, fieldData, schemaData, true), schemaData);
        }

        return result;
    }

    //-----)>

    function $validateString(schema, data, options) {
        return $validate(schema, data, options, options.data);
    }

    function $validateHashTable(schema, data, options) {
        var optScenario = options.scenario,
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

            switch(typeof(schemaData)) {
                case "string":
                    nameFunc = schemaData;
                    schemaData = {};

                    break;

                case "object":
                    nameFunc = schemaData.rule || schemaData.use;

                    if(checkScenario(schemaData.on, optScenario))
                        continue;

                    break;

                default:
                    throw new Error("[!] Validation | schemaData: " + schemaData);
            }

            switch(typeof(nameFunc)) {
                case "string":
                    if(nameFunc[0] === "?") {
                        if(typeof(fieldData) === "undefined")
                            continue;

                        nameFunc = nameFunc.substring(1);
                    }

                    break;
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

    //----------------)>

    function $typenize(type, input, options, isUseSanitize) {
        if(type === "custom")
            return input;

        //------------------]>

        switch(type) {
            case "boolean":
                switch(typeof(input)) {
                    case "boolean":
                        return input;

                    case "string":
                        return input === "true" || input === "on" || input === "yes" || input === "1";
                }

                return input === 1;

            case "string":
                if(input === null) return "";

                switch(typeof(input)) {
                    case "string":
                        return input;

                    case "undefined":
                        return "";

                    case "object":
                        return typeof(input.toString) === "function" ? input.toString() : Object.prototype.toString.call(input);
                }

                return typeof(input.toString) === "function" ? input.toString() : input + "";

            case "integer":
                if(input === null) return NaN;

                switch(typeof(input)) {
                    case "undefined": return NaN;

                    case "object":
                        if(input instanceof(Date)) {
                            if(typeof(input.valueOf) === "function")
                                input = input.valueOf(); else return NaN;
                        }
                }

                return parseInt(input, options.radix || 10);

            case "float":
                if(input === null) return NaN;

                switch(typeof(input)) {
                    case "number": return input;
                    case "undefined": return NaN;

                    case "object":
                        if(input instanceof(Date)) {
                            if(typeof(input.valueOf) === "function")
                                input = input.valueOf(); else return NaN;
                        }
                }

                return parseFloat(input);

            case "date":
                if(input instanceof(Date))
                    return input;

                return new Date(input);

            case "hashTable":
                if(input && typeof(input) === "string") {
                    try {
                        input = JSON.parse(input);
                    } catch(e) {
                    }
                }

                input = input && typeof(input) === "object" && !Array.isArray(input) ? input : {};

                if(typeof(options.schema) === "object") {
                    return gExport[isUseSanitize ? "sanitize" : "typenize"](options.schema, input, options);
                }

                return input;

            case "array":
                if(input && typeof(input) === "string") {
                    try {
                        input = JSON.parse(input);
                    } catch(e) { }
                }

                input = Array.isArray(input) ? input : [];

                if(Array.isArray(options.schema)) {
                    var result = isUseSanitize ? [] : input,

                        func = gExport[isUseSanitize ? "sanitize" : "typenize"],
                        sch = options.schema;

                    for(var i = sch.length - 1; i >= 0; i--) {
                        result[i] = func(sch[i], input[i], options);
                    }

                    return result;
                }

                return input;

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
                var func = gCustomTypesStore[type];

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

                if(options.onlyDigits)
                    input = input.replace(/\D/g, "");
                else if(options.onlyAlphanumeric)
                    input = input.replace(/[\W_]/g, "");
                else if(options.onlyWordchar)
                    input = input.replace(/\W/g, "");

                if(options.trim)
                    input = input.trim();
                else {
                    if(options.ltrim)
                        input = input.replace(/^[\s\uFEFF\xA0]+/g, "");

                    if(options.rtrim)
                        input = input.replace(/[\s\uFEFF\xA0]+$/g, "");
                }

                //------------]>

                if(typeof(options.max) !== "undefined" && input.length > options.max)
                    input = input.substring(0, options.max);

                //------------]>

                if(options.trim)
                    input = input.trim();
                else {
                    if(options.rtrim)
                        input = input.replace(/[\s\uFEFF\xA0]+$/g, "");
                }

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

                if(typeof(options.schema) === "object")
                    return gExport.validate(options.schema, input, options);

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
                switch(typeof(input)) {
                    case "number": return !isNaN(input);
                    case "string": return input.length > 0;

                    default:
                        if(input instanceof(Date))
                            return !!input.getTime();
                }

                return false;

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
                return typeof(input) === "string" && !!input.match(/^(?:(?:https?|ftp|ssh|ws|gopher|news|telnet|ldap):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);

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

                //---)>

                var locale = options.locale;

                if(locale && Array.isArray(locale)) {
                    var result = false;

                    for(var i = 0, l = locale.length; !result || i < l; i++)
                        result = gVPhones[locale[i]].test(input);

                    return result;
                }

                return gVPhones[locale || "ru-RU"].test(input);

            //-----------[UUID]-------------}>

            case "uuid":
                if(!input || typeof(input) !== "string")
                    return false;

                //---)>

                var version = options.version;

                if(!version)
                    return gVUUIDs[0].test(input);

                if(Array.isArray(version)) {
                    var result = false;

                    for(var i = 0, l = version.length; !result || i < l; i++)
                        result = validate("uuid.v" + version[i], input);

                    return result;
                }

                return $validate("uuid.v" + version, input);

            case "uuid.v3":
                return !!input && typeof(input) === "string" && gVUUIDs[3].test(input);

            case "uuid.v4":
                return !!input && typeof(input) === "string" && gVUUIDs[4].test(input);

            case "uuid.v5":
                return !!input && typeof(input) === "string" && gVUUIDs[5].test(input);

            //-----------[IP]-------------}>

            case "ip":
                var version = options.version;

                return version ? $validate("ip.v" + version, input) : ($validate("ip.v4", input) || $validate("ip.v6", input));

            case "ip.v4":
                return !!input && typeof(input) === "string" && gVIPs[4].test(input);

            case "ip.v6":
                return !!input && typeof(input) === "string" && gVIPs[6].test(input);

            //------------------------]>

            case "ascii":
                return typeof(input) === "string" && (/^[\x00-\x7F]+$/).test(input);

            case "base64":
                return typeof(input) === "string" && (/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/).test(input);

            //------------------------]>

            default:
                var func = gCustomRulesStore[use];

                if(func)
                    return func(input, options);

                throw new Error("[!] Validation | Unknown rule.\n" + use + " : " + JSON.stringify(options));
        }
    }

    function $format(data, str, fnc) {
        if(data === null)
            return str;

        var d;

        //------[Array]------}>

        if(Array.isArray(data)) {
            for(var i = 0, len = data.length; i < len; i++) {
                str = str.replace("{" + i + "}", data[i]);
            }

            return str;
        }

        //------[~]------}>

        switch(typeof(data)) {
            case "undefined":
                return str;

            case "object":
                for(var field in data) {
                    if(!Object.prototype.hasOwnProperty.call(data, field)) continue;

                    d = data[field];
                    str = fnc ? fnc(field, d, str) : str.replace("{" + field + "}", d);
                }

                return str;
        }

        return str.replace("{}", data);
    }

    //-------[HELPERS]-------}>

    function createModel(schema, func) {
        var result = function(data, options) {
            return func(schema, data, options);
        };

        result.format = function(str, data, options) {
            return $format(func(schema, data, options), str);
        };

        return result;
    }

    function runSchema(mode, schema, data, options, cbString, cbHashTable) {
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

            return cbString(schema, data, options);
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

            return cbHashTable(schema, data, options);
        }

        //----------------]>

        throw new Error("[!] Invalid schema.");
    }

    function checkScenario(x, y) {
        switch(typeof(x)) {
            case "undefined": return false;
            case "string": return x !== y;

            default:
                if(Array.isArray(x))
                    return x.indexOf(y) === -1;
        }

        throw new Error("[!] checkScenario: strange type - " + x);
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
})(true);

//-----------------------------------------------------

if(module && typeof(module) == "object") {
    module.exports = $aigis;
}