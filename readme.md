`npm install aigis -g`


```js
require("aigis");

var schema  = {
        "name":     "string",
        "status":   "?string",
        "pts":      {"use": "integer", "max": 30}
    },
    data    = {"name": "X", "pts": "60"};

$sanitize(schema, data);
$validate(schema, data);
```

* Tests: +
* Examples: +
* Browser: +

`?name` - Check an input only when the input exists (not undefined).

#### Module

| Name        | Desc        | Args			|
|-------------|-------------|-------------|
|             | -           ||
| global      | Set `$sanitize, $validate` as Global Var (NodeJS)  	| (v [default: true]) 				|
| rule        | Add/Remove/Get custom Rule  						| (name, [func]) ~ func(input, options) |
|             | -           ||			
| sanitize    | -								   					| (schema (String/Array/HashTable), data, [options]) 		|
| validate    | -								   					| (schema (String/Array/HashTable), data, [options]) 		|



#### Sanitize

| Name     	| Desc        | Val 			|
|-------------|-------------|-------------|
|             | -           ||
| boolean    		| true: "true", "on", "yes", "1"  	| - |
| string    		| -  								| - |
| integer    		| -  								| min, max, enum |
| float    			| -  								| min, max, enum |
| date    			| -  								| - |
| hashTable    		| -  								| - |
| array    			| -  								| - |
| json    			| -  								| - |



#### Validate

| Options     | Desc        | Val 			|
|-------------|-------------|-------------|
|             | -           ||
| errors     | Validate method returns null or an array of errors   		|  true/false (def: false)|


```js
//_ Error: structure 
{
    "field":    field,
    "use":      nameFunc,

    "input":    fieldData
}
```


| Name        | Desc        | Params/Options		|
|-------------|-------------|-------------|
|               	| -           ||
| null    			| -  								| - |
| nan    			| -  								| - |
| finite    		| If number and not: NaN, INFINITY  								| - |
|               	| -           ||
| boolean    		| -  								| - |
| string    		| -  								| min, max, enum, pattern |
| integer    		| -  								| min, max, enum |
| float    			| -  								| min, max, enum |
| date    			| -  								| - |
| hashTable    		| -  								| - |
| array    			| -  								| min, max |
| json    			| -  								| - |
|               	| -           ||
| required    		| Not: null, undefined, length==0, NaN, Invalid Date  								| - |
| notEmpty    		| If string not empty  									| - |
| lowercase    		| If string is lowercase  								| - |
| uppercase    		| If string is uppercase  								| - |
|               	| -           ||
| alphanumeric    	| Only letters and numbers  								| - |
| alpha    			| Only letters  								| - |
| numeric    		| Only numbers  								| - |
| hexadecimal    	| -  								| - |
| email    			| - 								| - |
| url    			| Mailto, http, https, ftp, ssh, ws, gopher, news, telnet, ldap  								| - |
| mongoId    		| -  								| - |
|               	| -           ||
| hexColor    		| -  																									| strict (def: false) |
| creditcard    	| Visa, MasterCard, American Express, Discover, Diners Club, and JCB card  								| - |
| phone    			| `ru-RU`, `zh-CN`, `en-ZA`, `en-AU`, `en-HK`, `fr-FR`, `pt-PT`, `el-GR`  								| locale (def: "ru-RU") |
| uuid    			| -  								| version (def: 3,4,5) |
| ip    			| -  								| version (def: 4,6) |
| ascii    			| -  								| - |
| base64    		| -  								| - |


#### Browser

Include: `//raw.githack.com/Daeren/Aigis/master/index.js`

Global var: `$aigis`


#### Examples

```js
require("aigis");

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
```

#### 3# of the fundamental modules
[2# Fire-Inject][2]

## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://www.npmjs.com/package/fire-inject