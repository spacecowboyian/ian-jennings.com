/** 
 * Raine's Javascript Extensions 
 * Commonly used functions that should be built-in, but aren't, and that we don't mind polluting the global namespace with. 
 * Client-side and server-side compatible
 *
 * Change Log:
 * 12/26/10: Added object support to map.
 * 04/29/09
 */

/**
String.prototype.format
String.prototype.trim
String.prototype.startsWith
Function.prototype.Extend
Function.prototype.Super
Function.prototype.Implements
Function.prototype.Context
Function.prototype.compose
Function.prototype.sequence
Function.prototype.curry
Function.prototype.rcurry
map
filter
reduce
range
each
find
contains
pluck
keys
values
toDict
joinObj
inArray
isEmpty
compare
compareProperty
equals
hasValue
merge
assert
assertEquals
*/

/***********************************
 * String overrides
 ***********************************/

/** Replaces occurrences of {0}, {1}, ... with each additional argument passed.  Like sprintf. 
	Caches compiled regular expressions to improve performance.
*/
String.prototype.format = (function() { 
	
	// private vars
	var preRE = [];
	
	return function() {

		var str = this;

		for(var i=0, l=arguments.length; i<l; i++) {
			// cache regular expression
			if(!preRE[i]) {
				preRE[i] = new RegExp();
				preRE[i].compile('\\{' + (i) + '\\}','gm');
			}
			str = str.replace(preRE[i], arguments[i]);
		}

		return str;
	}
})();


/** Removes whitespace from both ends of a string. */
String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

/** Returns true if the string starts with the given substring. */
String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}

/***********************************
 * Function overrides
 ***********************************/

/**
 * Returns a function that applies the underlying function
 * to the result of the application of `fn`.
 *
 * Based on Functional library by Oliver Steele
 * http://osteele.com/javascripts/functional
 */
Function.prototype.compose = function(fn) {
    var self = this;
    return function() {
        return self.apply(this, [fn.apply(this, arguments)]);
    }
};
/**
 * Returns a function that applies the underlying function
 * to the result of the application of `fn`.
 */
Function.prototype.sequence = function(fn) {
    var self = this;
    return function() {
        return fn.apply(this, [self.apply(this, arguments)]);
    }
};
/**
 * Returns a function that, applied to an argument list $arg2$,
 * applies the underlying function to $args ++ arg2$.
 * :: (a... b... -> c) a... -> (b... -> c)
 * == f.curry(args1...)(args2...) == f(args1..., args2...)
 */
Function.prototype.curry = function(/*args...*/) {
    var fn = this;
    var args = Array.slice(arguments, 0);
    return function() {
        return fn.apply(this, args.concat(Array.slice(arguments, 0)));
    };
};
/*
 * Right curry.  Returns a function that, applied to an argument list $args2$,
 * applies the underlying function to $args2 + args$.
 * == f.curry(args1...)(args2...) == f(args2..., args1...)
 * :: (a... b... -> c) b... -> (a... -> c)
 */
Function.prototype.rcurry = function(/*args...*/) {
    var fn = this;
    var args = Array.slice(arguments, 0);
    return function() {
        return fn.apply(this, Array.slice(arguments, 0).concat(args));
    };
};

/** Calls the function in the scope of the given object. */
Function.prototype.Context = function(obj) {
	var fnReference = this;
	return function () {
		return typeof fnReference == "function" ? fnReference.apply(obj, arguments) : obj[fnReference].apply(obj, arguments);
	};
};


/***********************************
 * Functional
 ***********************************/

/** Returns a new array consisting of f applied to each item of the given array. 
	@param collection		An array or object of items.
	@param f				If collection is an array, (item index) => newValue.
							If collection is an object, (key value index) => [newKey, newValue] or (key value index) => newValue.
*/
map = function(collection, f, context) {

	// error handling
	if(!collection) {
		throw new Error("Array is null or undefined.");
	}
	else if(!f || !f.apply) {
		throw new Error("You must provide a valid function as the second argument to map: " + f);
	}

	// array version
	if(collection.length || collection.length === 0) {
		var newArray = [];
		for(var i=0, n=collection.length; i<n; i++) {
			newArray[i] = f.apply(context, [collection[i], i]);
		}
		return newArray;
	}
	// object version
	else {
		var newObj = {};
		var i=0;
		for(var prop in collection) {
			var result = f.apply(context, [prop, collection[prop], i])
			if(result && result.key && result.value) {
				newObj[result.key] = result.value;
			}
			else {
				newObj[prop] = result;
			}
			i++;
		}
		return newObj;
	}
};
Array.prototype.map = function(f, context) {
	return map(this, f, context);
};

/** Returns a new array consisting of a subset of arr for which the given function returns truthy. */
filter = function(arr, f, context) {
	var newArray = [];
	for(var i=0, n=arr.length; i<n; i++) {
		if(f.apply(context, [arr[i], i])) {
			newArray.push(arr[i]);
		}
	}
	return newArray;
};
Array.prototype.filter = function(f, context) {
	return filter(this, f, context);
};

/**
 * Applies `fn` to `init` and the first element of `sequence`,
 * and then to the result and the second element, and so on.
 * == reduce(f, init, [x0, x1, x2]) == f(f(f(init, x0), x1), x2)
 * :: (a b -> a) a [b] -> a
 * >> reduce('x y -> 2*x+y', 0, [1,0,1,0]) -> 10
 * 	 (from Oliver Steele's Functional Javascript library)
 */
reduce = function(fn, init, sequence, context) {
    //fn = Function.toFunction(fn);
	sequence = [].concat(sequence);
    var len = sequence.length,
        result = init;
    for (var i = 0; i < len; i++)
        result = fn.apply(context, [result, sequence[i]]);
    return result;
};
 
/** Returns a list of integers from min (default: 0) to max (inclusive). */
range = function(min, max) {

	// override for 1 argument
	if(arguments.length == 1) {
		min = 0;
		max = arguments[0];
	}

	var arr = [];
	for(var i=min; i<=max; i++) {
		arr.push(i);
	}
	return arr;
};


/** Applies the given function to each item in the array.  Same as map but doesn't build and return an array. */
each = function(arr, f, context) {
	for(var i=0, n=arr.length; i<n; i++) {
		f.apply(context, [arr[i], i]);
	}
};
Array.prototype.each = function(f, context) {
	return each(this, f, context);
};

/** Returns the first item in arr for which the function f returns true.  Returns null if no matches are found. */
find = function(arr, f, context) {
	for(var i=0, n=arr.length; i<n; i++) {
		if(f.apply(context, [arr[i], i])) {
			return arr[i];
		}
	}

	return null;
};
Array.prototype.find = function(f, context) {
	return find(this, f, context);
};

/** Returns true if the array contains the given item (compared by address, but works by value for strings). */
contains = function(arr, item) {
	for(var i=0, n=arr.length; i<n; i++) {
		if(arr[0] === item) {
			return true;
		}
	}

	return false;
}
Array.prototype.contains = function(item) {
	return contains(this, item);
};

/** Returns an array of values of the given property for each item in the array. */
pluck = function(arr, property) {
	return map(arr, function(item) {
		return item[property];
	});
};
Array.prototype.pluck = function(property) {
	return pluck(this, property);
};

/** Group the array of objects by one of the object's properties. Returns a dictionary containing the original arrays items indexed by the property value. */
group = function(arr, property) {

	if(!property) {
		throw new Error("Invalid property.");
	}

	var dict = {};
	each(arr, function(item) {
		if(!(item[property] in dict)) {
			dict[item[property]] = [];
		}
		dict[item[property]].push(item);
	});
	return dict;
}
Array.prototype.group = function(property) {
	return group(this, property);
};

/***********************************
 * Array/Object/Utility
 ***********************************/

/** Returns an array of the object's keys. */
keys = function(obj) {
	var newArray = [];
	for(var property in obj) {
		newArray.push(property);
	}
	return newArray;
};

/** Returns an array of the object's values. */
values = function(obj) {
	var newArray = [];
	for(var property in obj) {
		newArray.push(obj[property]);
	}
	return newArray;
};

/** Converts an array to a dictionary given a function that takes an array value and returns a 2-part array of the key and value. */
toDict = function(arr, makeKeyValue) {
	var dict = {};
	arr.each(function(item) {
		kvp = makeKeyValue(item);
		dict[kvp[0]] = kvp[1];
	});
	return dict;
};
Array.prototype.toDict = function(makeKeyValues) { return toDict(this, makeKeyValues); };

joinObj = function(obj, propSeparator, valueSeparator) {
	var keyValuePairs = [];
	for(var prop in obj) {
		keyValuePairs.push(prop + valueSeparator + obj[prop]);
	}
	return keyValuePairs.join(propSeparator);
};

/** Returns true if the array contains the given object. */
// why is there this and contains()?
inArray = function(arr, obj) {
	return find(arr, function(x) { return x === obj; }) !== null;
};

/** Returns true if the object has no properties, like {}. */
isEmpty = function(obj) {
	for(var prop in obj) {
		return false;
	}
	return true;
};

/** Compares two items lexigraphically.  Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
compare = function(a,b) {
	if(a > b) {
		return 1;
	}
	else if(a == b) {
		return 0;
	}
	else {//if(a < b) {
		return -1;
	}
};

/** Returns a function that compares the given property of two items. */
compareProperty = function(property) {
	return function(a,b) {
		return compare(a[property], b[property]);
	};
};

/** Returns true if all the items in a are equal to all the items in b, recursively. */
equals = function(a,b) {
	// compare arrays
	if(a instanceof Array) {

		// check if the arrays are the same length
		if(a.length !== b.length) {
			return false;
		}

		// check the equality of each item
		for(var i=0, l=a.length; i<l; i++) {
			if(!b || !b[i] || !equals(a[i], b[i])) {
				return false;
			}
		}
	}
	// compare scalars
	else {
		if(a !== b) {
			return false;
		}
	}

	return true;
};

/** Returns true if the given value is not undefined, null, or an empty string. */
hasValue = function(x) { 
	return x !== undefined && x !== null && x !== ""; 
};

/** Returns a new object with the given objects merged onto it. Properties on later arguments override identical properties on earlier arguments. */
merge = function(/*arguments*/) {

	var mothership = {};
	
	// iterate through each given object
	for(var i=0; i<arguments.length; i++) {
		var outlier = arguments[i];
		
		// add each property to the mothership
		for(prop in outlier) {
			if(typeof outlier[prop] === "object" && !(outlier[prop] instanceof Array)) {
				mothership[prop] = merge(mothership[prop], outlier[prop]); // RECURSION
			}
			else {
				mothership[prop] = outlier[prop];
			}
		}
	}
	
	return mothership;
};

/** Returns a function that returns the inverse of the given boolean function. */
not = function(f) { 
	return function() { 
		return !f.apply(this, arguments); 
	} 
}

/***********************************
 * Assertions
 ***********************************/

/** Asserts that a is truthy. */
assert = function(a,b) {
	if(!a) {
		console.error("Assertion failure: {0}".format(a));
	}
};

/** Asserts that a is equal to b, using recursive equality checking for arrays. */
assertEquals = function(a,b) {
	if(!equals(a,b)) {
		console.error("Assertion failure: {0} === {1}".format(a,b));
	}
};
