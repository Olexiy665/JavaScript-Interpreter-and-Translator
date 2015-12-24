'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SyntaxAnalyzer = (function () {
    function SyntaxAnalyzer(string) {
        _classCallCheck(this, SyntaxAnalyzer);

        this.string = string;
    }

    _createClass(SyntaxAnalyzer, [{
        key: 'startAnalize',
        value: function startAnalize() {
            var string = this.string;
            return esprima.parse(string);
        }
    }]);

    return SyntaxAnalyzer;
})();

var SemanAnalyzer = (function () {
    function SemanAnalyzer(tree) {
        _classCallCheck(this, SemanAnalyzer);

        this.tree = tree;
    }

    _createClass(SemanAnalyzer, [{
        key: 'startAnalyzer',
        value: function startAnalyzer() {

            var reserved = ['abstract', 'boolean', 'break', 'byte', 'case', 'catch	char	class	const	continue', 'default', 'do', 'double', 'else', 'extends', 'false', 'for', 'function', 'if	', 'in', 'var', 'while'];
            var tree = this.tree;
            function giveType(value) {

                if (!isNaN(value)) {
                    return 'number';
                } else if (typeof value == 'string') {
                    return 'string';
                } else if (typeof value == 'boolean') {
                    return 'boolean';
                }
            }
            function analyze(tree) {

                if (tree.type == 'Literal') {

                    return tree.value;
                }
                if (tree.type == 'Identifier') {
                    console.log(environment[tree.name], 'krkrkrkr');
                    if (environment[tree.name] !== undefined) {
                        return environment;
                    } else {

                        document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error' + tree.name + ' not declaration value ' + '</p>';
                        return;
                    }
                }
                if (tree.type == 'AssignmentExpression') {

                    console.log('AssignmentExpression');
                    analyze(tree.left);
                } else if (tree.type == 'IfStatement') {
                    analyze(tree.test);
                    analyze(tree.consequent);
                    if (tree.alternate) {
                        analyze(tree.alternate);
                    }
                } else if (tree.type == 'ExpressionStatement') {
                    console.log(tree.type);
                    analyze(tree.expression);
                } else if (tree.type == 'VariableDeclaration') {

                    tree.declarations.forEach(function (declarationNode) {

                        if (reserved.indexOf(declarationNode.id.name) > 1) {

                            document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.name + ' is reserved word ' + '</p>';
                        } else if (environment[declarationNode.id.name] !== undefined) {
                            document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + declarationNode.id.name + ' is already declarated ' + '</p>';
                        } else if (declarationNode.init == null) {
                            environment[declarationNode.id.name] = {
                                value: undefined,
                                type: undefined };
                        } else if (declarationNode.init.type == 'BinaryExpression') {

                            environment[declarationNode.id.name] = {
                                value: analyze(declarationNode.init).value,
                                type: analyze(declarationNode.init).type };
                        } else if (declarationNode.init.type == 'ArrayExpression') {
                            environment[declarationNode.id.name] = {
                                value: declarationNode.init.elements,
                                type: 'Array'
                            };
                        } else {
                            environment[declarationNode.id.name] = {
                                value: declarationNode.init.value,
                                type: giveType(declarationNode.init.value)
                            };
                        }
                    });
                } else if (tree.type == 'BinaryExpression') {
                    console.log(tree.type);
                    var left = analyze(tree.left);
                    var right = analyze(tree.right);
                    var leftVal = undefined,
                        lType = undefined,
                        rightVal = undefined,
                        rType = undefined;
                    if (typeof left == 'object') {
                        leftVal = left.value;
                        lType = left.type;
                    } else {
                        leftVal = left;
                        lType = giveType(left);
                    }
                    if (typeof right == 'object') {
                        rightVal = right.value;
                        rType = right.type;
                    } else {
                        rightVal = right;
                        rType = giveType(right);
                    }
                    var resultType = undefined;

                    return { value: leftVal + '' + tree.operator + '' + rightVal };
                } else if (tree.type == 'ForStatement') {
                    analyze(tree.init);
                    analyze(tree.test);
                    analyze(tree.body);
                } else if (tree.body) {

                    tree.body.forEach(function (node) {

                        analyze(node);
                    });
                }
                if (tree.length && tree.length > 0) {
                    tree.forEach(function (node) {
                        analyze(node);
                    });
                }

                console.log(environment);
            }

            analyze(tree);
            var result = true;
            return result;
        }
    }]);

    return SemanAnalyzer;
})();

var Interpreter = (function () {
    function Interpreter(tree) {
        _classCallCheck(this, Interpreter);

        this.tree = tree;
    }

    _createClass(Interpreter, [{
        key: 'startInterpreter',
        value: function startInterpreter() {
            function giveType(value) {

                if (!isNaN(value)) {
                    return 'number';
                } else if (typeof value == 'string') {
                    return 'string';
                } else if (typeof value == 'boolean') {
                    return 'boolean';
                }
            }
            var binarOperators = {
                '+': function _(a, b) {
                    console.log(a, b, 'a');return a + b;
                },
                '-': function _(a, b) {
                    return a - b;
                },
                '*': function _(a, b) {
                    console.log(a, b, 'bb');return a * b;
                },
                '/': function _(a, b) {
                    return a / b;
                },
                '%': function _(a, b) {
                    return a % b;
                },
                '!=': function _(a, b) {
                    return a != b;
                },
                '==': function _(a, b) {
                    return a == b;
                },
                '>': function _(a, b) {
                    return a > b;
                },
                '<': function _(a, b) {
                    return a < b;
                }
            };
            var mathFunctions = {
                'pow': function pow(a, b) {
                    if (b < 1 && b > 0) {
                        return Math.pow(a, b);
                    } else if (b < 0) {
                        b = -b;
                        var result = 1;
                        for (var i = 0; i < b; i++) {

                            result = result * a;
                        }
                        return 1 / result;
                    } else if (b >= 0) {
                        var result = 1;
                        for (var i = 0; i < b; i++) {

                            result = result * a;
                        }
                        return result;
                    } else {
                        return NaN;
                    }
                } };
            var unaryOperators = {
                '++': function _(a) {

                    return ++a;
                },
                '--': function _(a) {

                    return --a;
                },
                '-': function _(a) {
                    return 0 - a;
                },
                '+': function _(a) {
                    return 0 + a;
                }

            };
            var tree = this.tree;
            function interpreter(tree) {

                var result;
                var toPrint = [];
                var consoleStringIndex = 0;
                if (tree.type == 'UnaryExpression') {
                    if (tree.argument.value) {
                        console.log(tree.argument.value, 'lalalal');
                        var lresult = unaryOperators[tree.operator](tree.argument.value);
                        return { value: lresult, type: typeof lresult };
                    }
                    if (tree.argument.name) {
                        if (environment[tree.argument.name] === undefined) {
                            document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.argument.name + ' not declaration value ' + '</p>';
                            return;
                        } else {
                            var lresult = unaryOperators[tree.operator](environment[tree.argument.name].value);
                            return { value: lresult, type: typeof lresult };
                        }
                    }
                }
                if (tree.type == 'MemberExpression') {

                    if (tree.property.name) {
                        return environment[tree.object.name].value[environment[tree.property.name].value];
                    };

                    if (tree.property.value) {
                        console.log('uuuuuuuuuuuuuuuuuuuuuuuu', tree.property.value);

                        return environment[tree.object.name].value[tree.property.value];
                    }
                }
                if (tree.type == "ForStatement") {
                    var startTime = new Date();
                    interpreter(tree.init);
                    interpreter(tree.init);

                    var init = environment[tree.init.declarations[0].id.name].value;
                    var iteration = 0;
                    while (interpreter(tree.test).value) {
                        var currentTime = new Date();
                        iteration++;
                        if (currentTime - startTime > 100000) {
                            document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error  to many iteration ' + '</p>';
                            break;
                        }
                        interpreter(tree.body);
                        interpreter(tree.update);
                    }
                } else if (tree.type == "UpdateExpression") {

                    environment[tree.argument.name].value = unaryOperators[tree.operator](environment[tree.argument.name].value, tree.prefix);
                } else if (tree.type == "CallExpression") {

                    if (tree.callee.object.name == "Math") {
                        if (tree.callee.property.name == "pow") {

                            var arg1 = interpreter(tree.arguments[0]).value;
                            var arg2 = interpreter(tree.arguments[1]).value;

                            return { value: mathFunctions.pow(arg1, arg2), type: 'number' };
                        }
                    }
                    if (tree.callee.object.name == 'console') {
                        if (tree.callee.property.name == "log") {
                            (function () {
                                var args = [];
                                tree.arguments.forEach(function (arg) {
                                    args.push(interpreter(arg).value);
                                });
                                var print = '';
                                args.forEach(function (arg) {
                                    print += arg + ', ';
                                });

                                document.getElementById("console-emulator").innerHTML += '<p> <span>' + '.</span> ' + print + '</p>';
                            })();
                        }
                    }
                } else if (tree.type == "AssignmentExpression") {

                    if (tree.left.type == "MemberExpression") {
                        if (environment[tree.left.object.name] === undefined) {
                            document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.left.object.name + ' not declaration value ' + '</p>';
                        } else {
                            if (tree.left.property.name) {
                                environment[tree.left.object.name].value[environment[tree.left.property.name].value] = {
                                    value: interpreter(tree.right).value,
                                    type: typeof interpreter(tree.right).value
                                };
                            }

                            if (tree.left.property.value) {
                                console.log('uuuuuuuuuuuuuuuuuuuuuuuu');
                                environment[tree.left.object.name].value[tree.left.property.value] = {
                                    value: interpreter(tree.right).value,
                                    type: typeof interpreter(tree.right).value
                                };
                            }
                        }
                    } else {
                        environment[tree.left.name].value = interpreter(tree.right).value;
                        environment[tree.left.name].type = interpreter(tree.right).type;
                    }
                } else if (tree.type == 'ExpressionStatement') {
                    interpreter(tree.expression);
                } else if (tree.type == "IfStatement") {
                    if (interpreter(tree.test).value) {
                        interpreter(tree.consequent);
                    } else if (tree.alternate) {
                        interpreter(tree.alternate);
                    }
                } else if (tree.type == 'Identifier') {
                    if (environment[tree.name] === undefined) {
                        document.getElementById("console-emulator").innerHTML += '<p class= "Error"> Error ' + tree.name + ' not declaration value ' + '</p>';
                        return;
                    } else {
                        return { value: environment[tree.name].value, type: environment[tree.name].type };
                    }
                }
                if (tree.type == "Literal") {
                    return { value: tree.value, type: giveType(tree.value) };
                }
                if (tree.type == 'BinaryExpression') {

                    var _result = binarOperators[tree.operator](interpreter(tree.left).value, interpreter(tree.right).value);

                    return { value: _result, type: typeof _result };
                }
                if (tree.type == 'VariableDeclaration') {

                    tree.declarations.forEach(function (declarationNode) {
                        if (declarationNode.init.type == 'ArrayExpression') {
                            environment[declarationNode.id.name] = {
                                value: declarationNode.init.elements,
                                type: 'Array'
                            };
                        } else if (declarationNode.init.type == 'BinaryExpression' || declarationNode.init.type == 'CallExpression' || declarationNode.init.type == 'UnaryExpression') {

                            environment[declarationNode.id.name] = {
                                value: interpreter(declarationNode.init).value,
                                type: interpreter(declarationNode.init).type };
                        } else {
                            environment[declarationNode.id.name] = {
                                value: declarationNode.init.value,
                                type: giveType(declarationNode.init.value)
                            };
                        }
                    });
                } else if (tree.body && tree.type != "ForStatement") {

                    tree.body.forEach(function (node) {

                        interpreter(node);
                    });
                }
            }
            interpreter(tree);
        }
    }]);

    return Interpreter;
})();

var Translator = (function () {
    function Translator(tree) {
        _classCallCheck(this, Translator);

        this.tree = tree;
    }

    _createClass(Translator, [{
        key: 'run',
        value: function run() {
            var operators = {
                '+': ' додати ',
                '-': " відняти ",
                '*': " помножити ",
                '/': " поділити ",
                '%': " визначити остачу від ділення ",
                '!=': " не дорівнює ",
                '==': " дорівнює",
                '>': "більше",
                '<': "меньше",
                '++': "інкримент",
                "--": "дикримент"

            };
            var SyntaxAr = { AssignmentExpression: function AssignmentExpression(a, b) {
                    return 'Змінній ' + a + ' присвоїти ' + b;
                },

                ArrayExpression: 'ArrayExpression',
                BinaryExpression: function BinaryExpression(left, op, right) {
                    return left + ' ' + operators[op] + ' ' + right;
                },
                BreakStatement: 'BreakStatement',
                CallExpression: function CallExpression(obj, prop, arg1, arg2) {
                    if (obj == 'Math') {
                        if (prop == 'pow') {

                            return 'Піднесення числа ' + arg1 + ' до ступення ' + arg2;
                        }
                    }
                    if (obj == 'console') {
                        return "Вивід на екран: " + arg1;
                    }
                },

                ForStatement: function ForStatement(init, test, body, update) {

                    return init + ", " + update + ",  поки " + test + ",  робити: " + body;
                },

                IfStatement: function IfStatement(con, bod, alt) {
                    if (alt) {
                        return 'Якщо ' + con + '  виконати <pre> ' + bod + '</pre>  </br> інакше   <pre>' + alt + '</pre>';
                    } else {
                        return 'Якщо ' + con + ' виконати <pre> ' + bod + '</pre> </br>';
                    }
                },
                ImportDeclaration: 'ImportDeclaration',
                ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                ImportSpecifier: 'ImportSpecifier',
                Literal: 'Literal',
                UnaryExpression: function UnaryExpression(op, val) {
                    return op + '' + val;
                },
                LogicalExpression: 'LogicalExpression',
                MemberExpression: function MemberExpression(el, obj, val, inReq) {

                    return el + '-му елементу масива ' + obj + ' присвоїти ' + val;
                },
                MetaProperty: 'MetaProperty',

                UpdateExpression: function UpdateExpression(name, operator) {
                    return operators[operator] + ' змінної ' + name;
                },
                VariableDeclaration: function VariableDeclaration(name, value, tab, type) {
                    return tab + 'Декларування змінної  ' + name + ' типу ' + type + ' значення:' + value;
                }

            };
            var result = [];
            function translate(tree, require) {
                console.log(tree, 'ololo');
                if (tree) {
                    var toPrint;
                    var lresult;
                    var lresult;
                    var result1;

                    var _ret2 = (function () {
                        var giveType = function giveType(value) {

                            if (!isNaN(value)) {
                                return 'number';
                            } else if (typeof value == 'string') {
                                return 'string';
                            } else if (typeof value == 'boolean') {
                                return 'boolean';
                            }
                        };

                        toPrint = [];

                        var tabs = '';

                        if (tree.type == 'MemberExpression') {

                            if (tree.property.value) {
                                lresult = { value: tree.property.value + " -й eлементе масиву " + tree.object.name + '[]' };
                            } else {
                                lresult = { value: tree.property.name + " -й eлементе масиву " + tree.object.name + '[]' };
                            }
                            if (require) {

                                return {
                                    v: lresult.value
                                };
                            } else result.push(lresult.value);
                        } else if (tree.type == "ForStatement") {

                            console.log(tree.body, 'forBody');
                            if (require) {
                                return {
                                    v: SyntaxAr[tree.type](translate(tree.init, true), translate(tree.test, true), translate(tree.body, true), translate(tree.update, true))
                                };
                            } else {
                                result.push(SyntaxAr[tree.type](translate(tree.init, true), translate(tree.test, true), translate(tree.body, true), translate(tree.update, true)));
                            }
                        } else if (tree.type == "UpdateExpression") {

                            var _lresult = SyntaxAr[tree.type](tree.argument.name, tree.operator);
                            if (require) {
                                return {
                                    v: _lresult
                                };
                            } else {
                                result.push(_lresult);
                            }
                        } else if (tree.type == "CallExpression") {

                            if (tree.callee.object.name == "Math") {
                                if (tree.callee.property.name == "pow") {

                                    var arg1 = undefined;
                                    if (tree.arguments[0].value) {
                                        arg1 = translate(tree.arguments[0], true);
                                    } else if (tree.arguments[0].name) {
                                        arg1 = translate(tree.arguments[0], true);
                                    } else {
                                        arg1 = translate(tree.arguments[0], true);
                                    }
                                    var arg2 = undefined;
                                    if (tree.arguments[1].value) {
                                        arg2 = translate(tree.arguments[1], true);
                                    } else if (tree.arguments[1].name) {
                                        console.log('uuuuu', tree.arguments[1]);
                                        arg2 = translate(tree.arguments[1], true);
                                    } else {
                                        arg2 = translate(tree.arguments[1], true);
                                    }
                                    console.log(tree.arguments[0], tree.arguments[1], 'trop');
                                    var _lresult2 = SyntaxAr['CallExpression'](tree.callee.object.name, tree.callee.property.name, arg1, arg2);
                                    if (require) {

                                        return {
                                            v: _lresult2
                                        };
                                    } else result.push(_lresult2);
                                }
                            }
                            if (tree.callee.object.name == 'console') {
                                if (tree.callee.property.name == "log") {
                                    var _ret3 = (function () {
                                        var args = [];
                                        tree.arguments.forEach(function (arg) {

                                            args.push(translate(arg, true));
                                        });

                                        var lResult = SyntaxAr['CallExpression'](tree.callee.object.name, tree.callee.property.name, args);

                                        if (require) {

                                            return {
                                                v: {
                                                    v: lResult
                                                }
                                            };
                                        } else {

                                            result.push(lResult);
                                        }
                                    })();

                                    if (typeof _ret3 === 'object') return _ret3.v;
                                }
                            }
                        } else if (tree.type == "AssignmentExpression") {

                            if (tree.left.type == "MemberExpression") {
                                console.log(tree, 'asssssffff');
                                var _lresult3 = undefined;
                                if (tree.left.property.value) {
                                    _lresult3 = SyntaxAr[tree.left.type](tree.left.property.value, tree.left.object.name, translate(tree.right, true));
                                }
                                if (tree.left.property.name) {

                                    _lresult3 = SyntaxAr[tree.left.type](tree.left.property.name, tree.left.object.name, translate(tree.right, true));
                                }

                                if (require) {
                                    return {
                                        v: _lresult3
                                    };
                                } else {
                                    result.push(_lresult3);
                                }
                            } else {

                                var _lresult4 = SyntaxAr[tree.type](tree.left.name, translate(tree.right, true));
                                if (require) {
                                    return {
                                        v: _lresult4
                                    };
                                } else {
                                    result.push(_lresult4);
                                }
                            }
                        } else if (tree.type == 'ExpressionStatement') {

                            return {
                                v: translate(tree.expression, require)
                            };
                        } else if (tree.type == "IfStatement") {
                            var lResult = SyntaxAr[tree.type](translate(tree.test, true), translate(tree.consequent, true), translate(tree.alternate, true));
                            if (require) {
                                return {
                                    v: lResult
                                };
                            } else result.push(lResult);
                        } else if (tree.type == 'Identifier') {

                            if (require) {
                                return {
                                    v: tree.name
                                };
                            } else result.push(tree.name);
                        }
                        if (tree.type == "Literal") {

                            if (require) {
                                return {
                                    v: tree.value
                                };
                            } else result.push(tree.value);
                        }
                        if (tree.type == 'BinaryExpression') {

                            var lResult = SyntaxAr[tree.type](translate(tree.left, true), tree.operator, translate(tree.right, true));
                            if (require) {
                                return {
                                    v: lResult
                                };
                            } else result.push(lResult);
                        }
                        if (tree.type == 'UnaryExpression') {
                            console.log('uiiiiiii');
                            var lResult = undefined;
                            if (tree.init) {
                                if (tree.init.value) {
                                    lResult = SyntaxAr[tree.type](tree.operator, translate(tree.init.value, true));
                                }
                                if (tree.init.name) {
                                    lResult = SyntaxAr[tree.type](tree.operator, tree.init.name);
                                }
                            }
                            if (tree.argument) {
                                console.log(tree.argument, 'kekek');
                                if (tree.argument.value) {
                                    lResult = SyntaxAr[tree.type](tree.operator, translate(tree.argument, true));
                                }
                                if (tree.argument.name) {
                                    lResult = SyntaxAr[tree.type](tree.operator, tree.argument.name);
                                }
                            }
                            console.log(lResult, 'kukuku');
                            if (require) {
                                return {
                                    v: lResult
                                };
                            } else result.push(lResult);
                        }
                        if (tree.type == 'VariableDeclaration') {
                            tree.declarations.forEach(function (declarationNode) {
                                if (declarationNode.init.type == 'ArrayExpression') {
                                    (function () {
                                        var elements = [];
                                        declarationNode.init.elements.forEach(function (elem) {
                                            elements.push(elem.value);
                                        });

                                        result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, elements, tabs, 'Array');
                                    })();
                                } else {
                                    console.log(declarationNode.init.value, 'YuYYYYYYYYYY');
                                    if (declarationNode.init.value !== undefined) {
                                        console.log(declarationNode.init.value, 'YYYYYYYYYYY', giveType(declarationNode.init.value));
                                        result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, declarationNode.init.value, tabs, environment[declarationNode.id.name].type);
                                    }
                                    if (declarationNode.init.type == 'BinaryExpression') {
                                        console.log(environment[declarationNode.id.name], 'eeeeeeeen');
                                        result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init, true), tabs, environment[declarationNode.id.name].type);
                                    }
                                    if (declarationNode.init.type == 'CallExpression') {
                                        result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init, true), tabs, environment[declarationNode.id.name].type);
                                        console.log(tree, 'fuuuu');
                                    }
                                    if (declarationNode.init.type == 'UnaryExpression') {
                                        result1 = SyntaxAr['VariableDeclaration'](declarationNode.id.name, translate(declarationNode.init, true), tabs, environment[declarationNode.id.name].type);
                                        console.log(tree, 'fuuuu');
                                    }
                                }
                            });
                            if (require) {
                                return {
                                    v: result1
                                };
                            } else result.push(result1);
                        } else if (tree.type == 'BlockStatement') {
                            var _ret5 = (function () {
                                var result = [];
                                tree.body.forEach(function (body) {
                                    result.push('<pre>' + translate(body, true) + '</pre>');
                                });
                                return {
                                    v: {
                                        v: result
                                    }
                                };
                            })();

                            if (typeof _ret5 === 'object') return _ret5.v;
                        } else if (tree.body && tree.type != "ForStatement") {

                            tree.body.forEach(function (node) {

                                translate(node, require);
                            });
                        }
                    })();

                    if (typeof _ret2 === 'object') return _ret2.v;
                }
            }

            translate(this.tree);

            return result;
        }
    }]);

    return Translator;
})();

var environment = {};
function main() {
    environment = {};
    document.getElementById('result').innerHTML = '';
    document.getElementById('console-emulator').innerHTML = '';
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
    });
}
