var assert  = require("chai").assert,
	Lexicon = require("../lib/lexicon");

suite('Lexicon', function(){

	setup(function(){
		//..
	});

	suite('#_resolvePath', function(){
		var mess, lexicon;

		setup(function() {

			lexicon = new Lexicon({
				key: {
					_: "_"
				}
			});
			
			mess = {
		        error: {
		            _: {
		                a: "1",
		                c: "4"
		            },

		            b: {
		                a:"2"
		            }
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

		test('should return existing value', function(){
			var result;

			result = lexicon._resolvePath(mess, ["error", "b", "a"]);

			assert.strictEqual(result, mess.error.b.a);
		});

		test('should return fallback value from first neighboor', function(){
			var result;

			result = lexicon._resolvePath(mess, ["error", "b", "c"]);

			assert.strictEqual(result, mess.error._.c);
		});

		test('should return fallback value from root neighboor', function(){
			var result;

			result = lexicon._resolvePath(mess, ["error", "b", "d"]);

			assert.strictEqual(result, mess._.b.d);
		});


		test('should return very fallback value', function(){
			var result;

			result = lexicon._resolvePath(mess, ["error", "b", "z"]);

			assert.strictEqual(result, mess._._._);
		});
	});

});