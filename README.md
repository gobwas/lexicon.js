# Lexicon.[js](https://developer.mozilla.org/en/docs/JavaScript)

> Fast and simple storage of your phrases.

## Getting started

+ Install with [npm](https://npmjs.org/package/lexicon-js);
+ Download [zip](https://github.com/gobwas/lexicon.js/archive/master.zip).

## Example

Lexicon.js brings you ability to resolve message in your vocabulary tree by path. If there no key of path chain, Lexicon tries
to resolve the default one.

```javascript
	var vocabulary, lexicon;

	vocabulary = {
		greetings: {
			hi:      "Hi, wassup?"
			hello:   "Hello, my dear <%= friend %>!",
			goodbye: "Goodbye, my dear!"
			_:       "Some greetings to you!"
		}
	};

	lexicon = new Lexicon();

	console.log(lexicon.getMessage(vocabulary, ["greetings", "hi"]));                               // Hi, wassup?
	console.log(lexicon.getMessage(vocabulary, ["greetings", "hello"], { data: {friend: "Alf"} })); // Hello, my dear Alf!
	console.log(lexicon.getMessage(vocabulary, ["greetings", "not-existing-key"]));                 // Some greetings to you!
```

## Options

By default there are few reserved keys:

```javascript
	Lexicon.DEFAULTS = {
        key: {
            _:       '_',
            info:    'info',
            error:   'error'
        }
    };
```

But you can redefine them by given options object. For example:

```javascript
	var lexicon = new Lexicon({ key: { _: "_default" } });
```

Lexicon uses underscore template notation. So if you want to render message dynamically, just declare your message with underscore
template syntax, and then pass options to the #getMessage method:

```javascript
	lexicon.getMessage(vocabulary, ["greetings", "hello"], { data: { friend: "Alf" } });
```

Enjoy =)