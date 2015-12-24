
class SyntaxAnalyzer{
    constructor(string){
        this.string = string;
    }
    startAnalize(){
        let string = this.string;
        return esprima.parse(string);
    }
}

class SemanAnalyzer{
    constructor(tree){
        this.tree = tree;
    }


    startAnalyzer(){

        var reserved = ['abstract',	'boolean',	'break',	'byte',	'case',
            'catch	char	class	const	continue',	'default',	'do',	'double',	'else',	'extends',	'false',
            'for',
            'function','if	',	'in',	'var',	'while'];
        let tree =  this.tree;
        function giveType(value){


            if(!isNaN(value)){
                return 'number';
            } else if(typeof value == 'string'){
                return 'string'
            } else if (typeof value == 'boolean'){
                return 'boolean';
            }
        }
        function analyze(tree){


            if(tree.type == 'Literal'){

                return tree.value;
            }
            if (tree.type == 'Identifier'){
                console.log(environment[tree.name], 'krkrkrkr');
                if(environment[tree.name] !== undefined){
                     return environment;

                } else {

                    document.getElementById("console-emulator").innerHTML+='<p class= "Error"> Error' + tree.name +' not declaration value ' +  '</p>';
                    return;
                }

            }
            if(tree.type == 'AssignmentExpression'){

                console.log('AssignmentExpression');
                analyze(tree.left);
            }else
            if(tree.type == 'IfStatement'){
                analyze(tree.test);
                analyze(tree.consequent);
                if(tree.alternate) {
                    analyze(tree.alternate);
                }
            }else
            if(tree.type == 'ExpressionStatement'){
                console.log(tree.type);
                analyze(tree.expression);
            }else
            if (tree.type == 'VariableDeclaration') {

                tree.declarations.forEach(function (declarationNode) {

                    if(reserved.indexOf(declarationNode.id.name) > 1){

                        document.getElementById("console-emulator").innerHTML+='<p class= "Error"> Error ' + tree.name +' is reserved word ' +  '</p>';

                    }else if(environment[declarationNode.id.name] !== undefined){
                        document.getElementById("console-emulator").innerHTML+='<p class= "Error"> Error ' + declarationNode.id.name +' is already declarated ' +  '</p>';

                    }
                    else
                    if(declarationNode.init == null){
                        environment[declarationNode.id.name] = {
                            value: undefined,
                            type: undefined}
                    }else
                    if(declarationNode.init.type == 'BinaryExpression'){

                        environment[declarationNode.id.name] = {
                            value: analyze(declarationNode.init).value,
                            type: analyze(declarationNode.init).type}
                    }else if(declarationNode.init.type == 'ArrayExpression'){
                    environment[declarationNode.id.name] = {
                        value: declarationNode.init.elements,
                        type: 'Array'
                    }
                    }else {
                        environment[declarationNode.id.name] = {
                            value: declarationNode.init.value,
                            type: giveType(declarationNode.init.value)
                    }
                        }
                })
            } else if(tree.type == 'BinaryExpression'){
                console.log(tree.type);
                    let left  = analyze( tree.left);
                    let right = analyze(tree.right);
                    let leftVal, lType, rightVal, rType;
                    if(typeof left == 'object'){
                        leftVal = left.value;
                         lType =  left.type;
                    }else{
                         leftVal = left;
                         lType = giveType(left);
                    }
                if(typeof right == 'object'){
                     rightVal = right.value;
                     rType =  right.type;
                }else{
                     rightVal = right;
                     rType = giveType(right);
                }
                let resultType;



                return {value: leftVal+''+tree.operator+''+rightVal }
            } else
            if (tree.type == 'ForStatement') {
                analyze(tree.init);
                analyze(tree.test);
                analyze(tree.body);

            }else
            if(tree.body) {

                tree.body.forEach(function (node) {

                   analyze(node);




                })
            }
            if(tree.length && tree.length > 0){
                tree.forEach(function(node) {
                  analyze(node);
                })
            }

            console.log(environment);





        }

         analyze(tree);
        let result = true;
        return result;
    }
}
class Interpreter{
    constructor(tree){
        this.tree = tree;
    }
    startInterpreter(){
        function giveType(value){


            if(!isNaN(value)){
                return 'number';
            } else if(typeof value == 'string'){
                return 'string'
            } else if (typeof value == 'boolean'){
                return 'boolean';
            }
        }
        let binarOperators={
            '+':function(a,b){console.log(a,b,'a'); return a + b},
            '-':function(a,b){return a - b},
            '*':function(a,b){console.log(a,b,'bb'); return a*b},
            '/':function(a,b){ return a/b},
            '%':function(a,b){return a%b},
            '!=':function(a,b){return a != b},
            '==':function(a,b){return a == b},
            '>':function(a,b){return a > b},
            '<':function(a,b){return a < b}
        };
        let mathFunctions = {
            'pow':function(a,b){
                if(b < 1 && b > 0){
                    return Math.pow(a,b);
                }else
                if(b < 0){
                    b = -b;
                    let result = 1;
                    for(var i = 0; i<b; i++){

                        result = result*a;
                    }
                    return 1/result;
                }else
                if(b>=0){
                let result = 1;
                for(var i = 0; i<b; i++){

                    result = result*a;
                }
                return result;
            }
                else {
                    return NaN;
                }
        }}
        let unaryOperators={
            '++':function(a){

                    return ++a;

            },
            '--':function(a){

                    return --a;

            },
            '-':function(a){
                return 0 - a;
            },
            '+':function(a){
                return 0+a;
            }


        };
        let tree = this.tree;
        function interpreter(tree){

            var result;
            var toPrint = [];
            let consoleStringIndex = 0;
            if(tree.type == 'UnaryExpression'){
                if(tree.argument.value) {
                    console.log(tree.argument.value, 'lalalal');
                    let lresult = unaryOperators[tree.operator](tree.argument.value);
                    return {value: lresult, type: typeof  lresult}
                }
                if(tree.argument.name){
                    if(environment[tree.argument.name] === undefined){
                        document.getElementById("console-emulator").innerHTML+='<p class= "Error"> Error ' + tree.argument.name +' not declaration value ' +  '</p>';
                        return;
                    } else {
                        let lresult = unaryOperators[tree.operator](environment[tree.argument.name].value);
                        return {value: lresult, type: typeof  lresult}
                    }
                }
            }
            if(tree.type == 'MemberExpression'){

                if(tree.property.name) {
                   return   environment[tree.object.name].value[environment[tree.property.name].value];
                };

                if(tree.property.value){
                    console.log('uuuuuuuuuuuuuuuuuuuuuuuu',tree.property.value);

                 return   environment[tree.object.name].value[tree.property.value];
                }


            }
            if(tree.type == "ForStatement"){
                var startTime = new Date();
                interpreter(tree.init);
                interpreter(tree.init);

              let init = environment[tree.init.declarations[0].id.name].value;
                var iteration = 0;
               while(interpreter(tree.test).value){
                  var currentTime = new Date();
                   iteration++;
                   if(currentTime - startTime > 100000){
                       document.getElementById("console-emulator").innerHTML+='<p class= "Error"> Error  to many iteration ' +  '</p>';
                       break;

                   }
                   interpreter(tree.body);
                   interpreter(tree.update);
               }



            } else
            if(tree.type == "UpdateExpression"){

                 environment[tree.argument.name].value = unaryOperators[tree.operator](environment[tree.argument.name].value,tree.prefix);

            }else if(tree.type == "CallExpression"){

                if(tree.callee.object.name == "Math"){
                    if(tree.callee.property.name == "pow"){

                        let arg1 = interpreter(tree.arguments[0]).value;
                       let arg2 = interpreter(tree.arguments[1]).value;

                        return {value:mathFunctions.pow(arg1,arg2), type:'number'};
                    }
                }
                if(tree.callee.object.name == 'console'){
                    if(tree.callee.property.name == "log"){
                        let args = [];
                        tree.arguments.forEach(function(arg){
                            args.push(interpreter(arg).value);
                        });
                        let print='';
                        args.forEach(function(arg){
                            print += arg +', '
                        })


                        document.getElementById("console-emulator").innerHTML+='<p> <span>'+'.</span> ' +  print+'</p>';
                    }
                }
            }else
            if(tree.type == "AssignmentExpression"){

                if(tree.left.type=="MemberExpression") {
                    if (environment[tree.left.object.name] === undefined) {
                        document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.left.object.name + ' not declaration value ' + '</p>';
                    }
                    else {
                        if (tree.left.property.name) {
                        environment[tree.left.object.name].value[environment[tree.left.property.name].value] = {
                            value: interpreter(tree.right).value,
                            type: typeof interpreter(tree.right).value
                        }
                    }

                    if (tree.left.property.value) {
                        console.log('uuuuuuuuuuuuuuuuuuuuuuuu');
                        environment[tree.left.object.name].value[tree.left.property.value] = {
                            value: interpreter(tree.right).value,
                            type: typeof interpreter(tree.right).value
                        }
                    }
                }
                }  else {
                    environment[tree.left.name].value = interpreter(tree.right).value;
                    environment[tree.left.name].type = interpreter(tree.right).type;
                }
            }else
            if(tree.type == 'ExpressionStatement'){
                interpreter(tree.expression);
            }else
            if(tree.type == "IfStatement") {
                if (interpreter(tree.test).value) {
                    interpreter(tree.consequent);
                } else if (tree.alternate) {
                    interpreter(tree.alternate);
                }
            }else if(tree.type == 'Identifier'){
                if(environment[tree.name] === undefined) {
                    document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.name + ' not declaration value ' + '</p>';
                    return;
                }else {
                    return {value: environment[tree.name].value, type: environment[tree.name].type}
                }
            }
            if(tree.type =="Literal"){
                return {value: tree.value, type:giveType(tree.value)}
            }
            if(tree.type == 'BinaryExpression'){


                let result = binarOperators[tree.operator](interpreter(tree.left).value, interpreter(tree.right).value);

                return {value: result, type: typeof  result}
            }
            if (tree.type == 'VariableDeclaration') {

                tree.declarations.forEach(function (declarationNode) {
                    if(declarationNode.init.type == 'ArrayExpression'){
                        environment[declarationNode.id.name] = {
                            value: declarationNode.init.elements,
                            type: 'Array'
                        }
                    }else
                    if(declarationNode.init.type == 'BinaryExpression'|| declarationNode.init.type == 'CallExpression' || declarationNode.init.type == 'UnaryExpression'){

                        environment[declarationNode.id.name] = {
                            value: interpreter(declarationNode.init).value,
                            type: interpreter(declarationNode.init).type}
                    }else  {
                        environment[declarationNode.id.name] = {
                            value: declarationNode.init.value,
                            type: giveType(declarationNode.init.value)
                        }
                    }
                })
            } else
            if(tree.body && tree.type != "ForStatement") {

                tree.body.forEach(function (node) {

                    interpreter(node);




                })
            }
        }
        interpreter(tree);
    }
}
class Translator{
    constructor(tree){
        this.tree = tree;
    }

     run() {
         var operators = {
             '+':' додати ',
             '-':" відняти ",
             '*':" помножити ",
             '/': " поділити ",
             '%':" визначити остачу від ділення ",
             '!=':" не дорівнює ",
             '==':" дорівнює",
             '>':"більше",
             '<':"меньше",
             '++':"інкримент",
             "--":"дикримент"

         }
         var SyntaxAr = {AssignmentExpression: function(a,b){
             return 'Змінній ' + a + ' присвоїти ' + b;
         },

             ArrayExpression: 'ArrayExpression',
             BinaryExpression: function(left, op, right){
                 return left + ' ' + operators[op] + ' ' + right;
             },
             BreakStatement: 'BreakStatement',
             CallExpression: function(obj, prop, arg1,arg2){
                 if(obj == 'Math'){
                     if(prop == 'pow'){

                         return 'Піднесення числа ' + arg1 + ' до ступення ' + arg2;
                     }
                 }
                 if(obj == 'console'){
                     return "Вивід на екран: " + arg1;
                 }

             },

             ForStatement: function(init,test, body, update ){

                 return init + ", "   + update + ",  поки " + test + ",  робити: " + body;
             },

             IfStatement: function(con, bod, alt){
                 if(alt) {
                     return 'Якщо ' + con + '  виконати <pre> ' + bod + '</pre>  </br> інакше   <pre>' + alt + '</pre>';
                 }else
                 {
                     return 'Якщо ' + con + ' виконати <pre> ' + bod + '</pre> </br>';
                 }
             },
             ImportDeclaration: 'ImportDeclaration',
             ImportDefaultSpecifier: 'ImportDefaultSpecifier',
             ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
             ImportSpecifier: 'ImportSpecifier',
             Literal: 'Literal',
             UnaryExpression: function(op, val){
                 return op + '' + val;
             },
             LogicalExpression: 'LogicalExpression',
             MemberExpression: function(el, obj, val,inReq){

                     return el + '-му елементу масива ' + obj + ' присвоїти ' + val;

             },
             MetaProperty: 'MetaProperty',

             UpdateExpression: function(name,operator){
                 return operators[operator] + ' змінної ' + name;
             },
             VariableDeclaration: function(name, value, tab,type){
                 return tab+ 'Декларування змінної  '+name+' типу '+ type + ' значення:'+value;
             }

         }
         var result = [];
         function translate(tree, require) {
                console.log(tree, 'ololo');
             if (tree) {
                 var toPrint = [];
                 let tabs = '';

                 function giveType(value) {


                     if (!isNaN(value)) {
                         return 'number';
                     } else if (typeof value == 'string') {
                         return 'string'
                     } else if (typeof value == 'boolean') {
                         return 'boolean';
                     }
                 }

                 if (tree.type == 'MemberExpression') {

                     if(tree.property.value) {
                         var lresult = {value: tree.property.value + " -й eлементе масиву " + tree.object.name + '[]'};
                     }
                     else{
                         var lresult = {value: tree.property.name + " -й eлементе масиву " + tree.object.name + '[]'};
                     }
                     if (require) {


                         return lresult.value;
                     } else

                         result.push(lresult.value);


                 }else

                 if (tree.type == "ForStatement") {

                     console.log(tree.body,'forBody')
                      if(require){
                        return  SyntaxAr[tree.type](translate(tree.init, true), translate(tree.test, true), translate(tree.body, true), translate(tree.update, true));
                      } else {
                          result.push(SyntaxAr[tree.type](translate(tree.init, true), translate(tree.test, true), translate(tree.body, true), translate(tree.update, true)))
                      }
                 } else if (tree.type == "UpdateExpression") {


                     let lresult = SyntaxAr[tree.type](tree.argument.name, tree.operator);
                     if (require) {
                         return lresult;
                     } else {
                         result.push(lresult);
                     }



                 } else if (tree.type == "CallExpression") {

                     if (tree.callee.object.name == "Math") {
                         if (tree.callee.property.name == "pow") {


                             let arg1;
                             if(tree.arguments[0].value){
                                 arg1 = translate(tree.arguments[0],true);
                             }else
                             if(tree.arguments[0].name){
                                 arg1 = translate(tree.arguments[0],true);
                             }else {
                                 arg1 = translate(tree.arguments[0],true);
                             }
                             let arg2;
                             if(tree.arguments[1].value){
                                 arg2 = translate(tree.arguments[1],true);
                             }else
                             if(tree.arguments[1].name){
                                 console.log('uuuuu',tree.arguments[1])
                                 arg2= translate(tree.arguments[1],true);
                             } else {
                                 arg2= translate(tree.arguments[1],true);
                             }
                             console.log(tree.arguments[0], tree.arguments[1],'trop');
                             let lresult = SyntaxAr['CallExpression'](tree.callee.object.name, tree.callee.property.name, arg1, arg2);
                             if (require) {

                                 return lresult
                             } else
                                 result.push(lresult);


                         }
                     }
                     if (tree.callee.object.name == 'console') {
                         if (tree.callee.property.name == "log") {
                             let args = [];
                             tree.arguments.forEach(function (arg) {

                                 args.push(translate(arg, true));
                             });


                             let lResult = SyntaxAr['CallExpression'](tree.callee.object.name, tree.callee.property.name, args);

                             if (require) {

                                 return lResult
                             } else {

                                 result.push(lResult);
                             }

                         }
                     }
                 } else if (tree.type == "AssignmentExpression") {

                     if (tree.left.type == "MemberExpression") {
                         console.log(tree,'asssssffff');
                         let lresult
                         if(tree.left.property.value) {
                           lresult   = SyntaxAr[tree.left.type](tree.left.property.value, tree.left.object.name, translate(tree.right,true))
                         }
                         if(tree.left.property.name){

                             lresult   = SyntaxAr[tree.left.type](tree.left.property.name, tree.left.object.name, translate(tree.right,true))
                         }

                         if (require) {
                             return lresult;
                         }
                         else {
                             result.push(lresult);
                         }
                     } else {


                         let lresult = SyntaxAr[tree.type](tree.left.name, translate(tree.right,true));
                         if (require) {
                             return lresult;
                         }
                         else {
                             result.push(lresult);
                         }
                     }
                 } else if (tree.type == 'ExpressionStatement') {


                    return translate(tree.expression,require);
                 } else if (tree.type == "IfStatement") {
                     let lResult = SyntaxAr[tree.type](translate(tree.test, true), translate(tree.consequent, true), translate(tree.alternate, true));
                     if (require) {
                         return lResult;
                     } else result.push(lResult);
                 } else if (tree.type == 'Identifier') {

                     if (require) {
                         return tree.name;
                     } else
                         result.push(tree.name);

                 }
                 if (tree.type == "Literal") {

                     if (require) {
                         return tree.value;
                     } else
                         result.push(tree.value);
                 }
                 if (tree.type == 'BinaryExpression') {

                     let lResult = SyntaxAr[tree.type](translate(tree.left, true), tree.operator, translate(tree.right, true));
                     if (require) {
                         return lResult;
                     }
                     else result.push(lResult);

                 }
                 if(tree.type == 'UnaryExpression'){
                     console.log('uiiiiiii');
                     let lResult;
                     if(tree.init) {
                         if (tree.init.value) {
                             lResult = SyntaxAr[tree.type](tree.operator, translate(tree.init.value, true));
                         }
                         if (tree.init.name) {
                              lResult = SyntaxAr[tree.type](tree.operator, tree.init.name);
                         }
                     }
                     if(tree.argument){
                         console.log(tree.argument,'kekek');
                         if (tree.argument.value) {
                              lResult = SyntaxAr[tree.type](tree.operator, translate(tree.argument, true));
                         }
                         if (tree.argument.name) {
                              lResult = SyntaxAr[tree.type](tree.operator, tree.argument.name);
                         }
                     }
                      console.log(lResult, 'kukuku');
                     if (require) {
                         return lResult;
                     }
                     else result.push(lResult);

                 }
                 if (tree.type == 'VariableDeclaration') {

                     var result1;
                     tree.declarations.forEach(function (declarationNode) {
                         if (declarationNode.init.type == 'ArrayExpression') {
                             let elements = [];
                             declarationNode.init.elements.forEach(function (elem) {
                                 elements.push(elem.value)
                             })

                             result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, elements, tabs, 'Array');

                         } else {
                             console.log(declarationNode.init.value, 'YuYYYYYYYYYY');
                             if(declarationNode.init.value !== undefined) {
                                 console.log(declarationNode.init.value, 'YYYYYYYYYYY', giveType(declarationNode.init.value));
                                 result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, declarationNode.init.value, tabs,  environment[declarationNode.id.name].type);
                             }
                             if(declarationNode.init.type == 'BinaryExpression'){
                                 console.log(environment[declarationNode.id.name], 'eeeeeeeen');
                                 result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init,true), tabs, environment[declarationNode.id.name].type);

                             }
                             if(declarationNode.init.type == 'CallExpression'){
                                 result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init,true), tabs, environment[declarationNode.id.name].type);
                                 console.log(tree, 'fuuuu');
                             }
                             if(declarationNode.init.type == 'UnaryExpression'){
                                 result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init,true), tabs, environment[declarationNode.id.name].type);
                                 console.log(tree, 'fuuuu');
                             }




                         }


                     })
                     if (require) {
                         return result1;
                     }
                     else result.push(result1);
                 } else if(tree.type == 'BlockStatement'){
                     let result = [];
                     tree.body.forEach(function(body){
                         result.push('<pre>' +  translate(body, true) + '</pre>');
                     })
                     return result;

                 }else
                 if (tree.body && tree.type != "ForStatement") {

                     tree.body.forEach(function (node) {

                         translate(node,require);



                     })
                 }
             }
         }

         translate(this.tree);

         return result;
     }

}
var environment = {};
function main() {
    environment = {};
    document.getElementById('result').innerHTML = '';
    document.getElementById('console-emulator').innerHTML = ''
    var string = document.getElementById('entry-string').value;

    var testAnalizer = new SyntaxAnalyzer(string);
    var tree = testAnalizer.startAnalize();

    var testSemanAnalyzer = new SemanAnalyzer(tree);
    testSemanAnalyzer.startAnalyzer();
    console.log(tree);
    var testInterpreter = new Interpreter(tree);
    testInterpreter.startInterpreter();
    var testTranslator = new Translator(tree);
    var translated = testTranslator.run();

    translated.forEach(function (res) {
        document.getElementById('result').innerHTML += '<p>' + res + '</p>';
    })

}