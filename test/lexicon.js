var _       = require("underscore"),
	assert  = require("chai").assert,
	Lexicon = require("../lib/lexicon");

suite('Lexicon', function(){
	var mess, lexicon;

	setup(function(){
		lexicon = new Lexicon({
			key: {
				_: "_"
			}
		});

		mess = {
	        lexema: {
	            _: {
	                a: "1",
	                c: "4"
	            },

	            b: {
	                a: "2"
	            },

	            c: {
	            	_: "hi!"
	            },

	            message: "Hello, my dear friend!",

	            template: "Hello, my dear <%= friend %>!"
	        },
	        _: {
	            b: {
	                d:"5"
	            },
	            _ : {
	            	_: "very!"
	            }
	        }
	    };
	});

	suite('#_resolvePath', function(){
		test('should return existing value', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "b", "a"]);

			assert.strictEqual(value, mess.lexema.b.a);
		});

		test('should return fallback value from first neighboor when path is null', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "c", null]);

			assert.strictEqual(value, mess.lexema.c._);
		});

		test('should return fallback value from first neighboor when path is finite', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "c"]);

			assert.strictEqual(value, mess.lexema.c._);
		});

		test('should return fallback value from first neighboor', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "b", "c"]);

			assert.strictEqual(value, mess.lexema._.c);
		});

		test('should return fallback value from root neighboor', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "b", "d"]);

			assert.strictEqual(value, mess._.b.d);
		});


		test('should return very fallback value', function(){
			var value;

			value = lexicon._resolvePath(mess, ["lexema", "b", "z"]);

			assert.strictEqual(value, mess._._._);
		});
	});

	suite('#getMessage', function() {
		test('should return existing message', function() {
			var message;

			message = lexicon.getMessage(mess, ["lexema", "message"]);

			assert.strictEqual(message, mess.lexema.message);
		});

		test('should return rendered template', function() {
			var message, data;

			data = { friend: "Alf" };

			message = lexicon.getMessage(mess, ["lexema", "template"], { data: data });

			assert.strictEqual(message, _.template(mess.lexema.template)(data));
		});
	});

});