`npm install aigis -g`


```js
require("aigis");

$typenize({name: "string"}, {name: 13, "skipThisField": "data"});
$sanitize({name: {type: "string", max: 2}}, {name: "Omnomnomnus", "delThisField": "data"});
$validate("integer", "2");

$sanitize("array", [6.9, "name", "delThisElem"], {"schema": ["integer", "string"]})
```

* Schema-tree (hashTable, array): +
* Tests: +
* Examples: +
* Browser: +

#### ~

* `?name` - Check an input only when the input exists (not undefined).
* `type` -> `use` <- `rule`


#### Module

| Name        | Desc        | Args			|
|-------------|-------------|-------------|
|             | -           ||
| createInstance    | Create new instance  												| ([isGlobal]) 				|
| global      		| Set `$typenize, $sanitize, $validate` as Global Var (NodeJS)  	| (v [default: true]) 				|
|             		| -           ||
| type        		| Set/Delete custom Type (Sanitize) 								| (name (String/HashTable), [func]) ~ func(input, options) |
| rule        		| Set/Delete custom Rule (Validate) 								| (name (String/HashTable), [func]) ~ func(input, options) |
|             		| -           ||			
| typenize    		| -								   									| (schema (String/HashTable), data, [options]) 		|
| sanitize    		| -								   									| (schema (String/HashTable), data, [options]) 		|
| validate    		| -								   									| (schema (String/HashTable), data, [options]) 		|


| Options     | Desc        | Val 		  |
|-------------|-------------|-------------|
|             | -           ||
|             | ALL         ||
| on	      | Scenario   													|  - |
|             | -           ||
|             | Validate    ||
| errors      | Validate method returns null or an array of errors   		|  true/false (def: false)|


```js
//_ Validation error: structure 
{
    "field":    field,
    "use":      nameFunc,

    "input":    fieldData
}
```


#### Typenize

| Type     	  | Desc        | Params/Options |
|-------------|-------------|----------------|
|             	| -           ||
|               | ALL (If `schema` is HashTable)    | on |
| custom    	| -  								||
| boolean    	| true: "true", "on", "yes", "1"  	||
| string    	| -  								||
| integer    	| -  								||
| float    		| -  								||
| date    		| -  								||
| hashTable    	| -  								| schema |
| array    		| -  								| schema |
| json    		| -  								||


#### Sanitize

| Type     	  | Desc        | Params/Options |
|-------------|-------------|----------------|
|             		| -           ||
|               	| ALL (If `schema` is HashTable)    | on |
| custom    		| -  								| - |
| boolean    		| true: "true", "on", "yes", "1"  	| - |
| string    		| -  								| default, enum, max, trim, ltrim, rtrim, escape, lowercase, uppercase, onlyDigits, onlyAlphanumeric, onlyWordchar |
| integer    		| -  								| default, enum, min, max, abs |
| float    			| -  								| default, enum, min, max, abs |
| date    			| -  								| default, min, max |
| hashTable    		| -  								| schema |
| array    			| -  								| schema, max |
| json    			| -  								| - |

```
String:
default (stop chain) -> enum (stop chain) -> only[Digits|Alphanumeric|Wordchar] -> [l|r]trim  -> max -> [r]trim -> [uppercase|lowercase] -> escape

Number:
default (stop chain) -> enum (stop chain) -> abs -> min -> max
```


#### Validate

| Rule        | Desc        | Params/Options		|
|-------------|-------------|-------------|
|               	| -           ||
|               	| ALL (If `schema` is HashTable)          									| on |
| null    			| -  																		| - |
| nan    			| -  																		| - |
| finite    		| If number and not: NaN, INFINITY  										| - |
|               	| -           ||
| boolean    		| -  																		| - |
| string    		| -  																		| min, max, enum, pattern |
| integer    		| -  																		| min, max, enum, divisibleBy |
| float    			| -  																		| min, max, enum, divisibleBy |
| date    			| -  																		| min, max |
| hashTable    		| -  																		| - |
| array    			| -  																		| min, max |
| json    			| -  																		| - |
|               	| -           ||
| required    		| Not: null, undefined, length==0, NaN, Invalid Date  						| - |
| equal    			| If the string matches the comparison  									| value, field (If `schema` is HashTable) |
| notEmpty    		| If string not empty  														| - |
| lowercase    		| If string is lowercase  													| - |
| uppercase    		| If string is uppercase  													| - |
|               	| -           ||
| wordchar    		| Alphanumeric characters including the underscore  						| - |
| alphanumeric    	| If string is only letters and numbers  									| - |
| alpha    			| If string is only letters  												| - |
| numeric    		| If string is only numbers  												| - |
| hexadecimal    	| -  																		| - |
| email    			| - 																		| - |
| url    			| mailto, http, https, ftp, ssh, ws, gopher, news, telnet, ldap  			| - |
| mongoId    		| -  																		| - |
|               	| -           ||
| hexColor    		| -  																									| strict (def: false) |
| creditcard    	| Visa, MasterCard, American Express, Discover, Diners Club, and JCB card  								| - |
| phone    			| `ru-RU`, `zh-CN`, `en-ZA`, `en-AU`, `en-HK`, `fr-FR`, `pt-PT`, `el-GR`  								| locale (def: "ru-RU") |
| uuid    			| -  																									| version (def: 3,4,5) |
|               	| -           ||
| ip    			| This function simply check whether the address is a valid IPv4 or IPv6 address  						| version (def: 4,6) |
| ip.v4    			| -  								| - |
| ip.v6    			| -  								| - |
|               	| -           ||
| ascii    			| -  								| - |
| base64    		| -  								| - |


#### Browser

Include: `//raw.githack.com/Daeren/Aigis/master/index.js`

Global var: `$aigis`


#### Examples

```js
require("aigis");

//-----------------------------------------------------

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

$typenize(schema, data);
$sanitize(schema, data);
$validate(schema, data);

//_ $typenize:
// { name: ' XX + ', pts: -60, data: { login: '', password: '', more: { someData: '' } } }

//_ $sanitize:
// { name: 'XX', pts: 30, data: { login: '', password: '', more: { someData: '' } } }

//_ $validate: false

//-----------------------------------------------------

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
        "name":     {"use": "string", "max": 2, "trim": true},
        "status":   "?string",
        "pts":      {"use": "integer", "max": 30}
    },
    data    = {"name": "   DT+  ", "pts": "60", "delThisField": "data"};

console.log("0#", $sanitize(schema, data));



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
```

#### 3# of the fundamental modules
[2# Fire-Inject][2]

## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://www.npmjs.com/package/fire-inject