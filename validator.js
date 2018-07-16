/*
	Purpose: To validate user Input
	Works only with unique selectors or just picking up the first one.
	Allowed keys [0-9.,], backspace, arrow keys, delete, tab
	example of usage:
		$NumValidator({      // global name
			maxLen: 8,       // optional default 8
			decMaxLen: 2,    // optional default 2
			DEBUG: false,    // optional default false
			selector: '#txt' // required, query Selector
		})
		.activeOn('keydown') // required
		.disableOn(['paste','drop']) // optional
    @author b.kodua
    @version 1.0 26/06/18
*/
window.$NumValidator = (function(document, validate){

	'use strict'
	return function(data){

		return new validate(document, data);
	}

})(document, function(ctx, data){

	var maxLen = data.maxLen || 8;
	var decMaxLen = data.decMaxLen || 2;
	var DEBUG = data.DEBUG || false;
	var txt = ctx.querySelector(data.selector || 'input[type=text]');
	
	/*number keys + numlock pad number keys*/
	const keyCodes = new Array(8,9,37,38,39,40,46,49,50,51,52,53,54,55,56,57,48,97,98,99,100,101,102,103,104,105,96,110,190,188);
	
	var validateInputNumber = function(event) {
		var curVal = this.value,
			curValArr = curVal.split('');

		if(curValArr.length >= maxLen && !(new RegExp(/8|9|37|38|39|40|46/).test( event.which ))){
			event.preventDefault();
			return false;
		}

		/*all characters from white-list*/
		if( -1 !== keyCodes.indexOf( event.which ) ){
			/*if user clicked ',' or '.' */
			if( new RegExp(/190|188|110/).test( event.which ) ){
				if( -1 === curValArr.indexOf('.') ){
					this.value += curVal.length === 0 ? '0.': '.';
				}
				event.preventDefault();
			}
			if( new RegExp(/48|96/).test( event.which ) ){
				DEBUG?console.log(event.which, curValArr, curValArr.indexOf('0')):null;
				if( curValArr.length === 0){
					this.value += '0.';
				}else{
					if(curValArr.length < maxLen){
						if(-1 !== curValArr.indexOf('.') && curValArr.length - curValArr.indexOf('.') > decMaxLen){
							event.preventDefault();
						}else{
							this.value += '0';
						}
					}
				} 
				event.preventDefault();
			}
			if( !(new RegExp(/8|9|37|38|39|40|46/).test( event.which )) && -1 !== curValArr.indexOf('.') && curValArr.length - curValArr.indexOf('.') > decMaxLen){
				event.preventDefault();
			}
		}else{
			DEBUG?console.log(event.which, 'not allowed'):null;
			event.preventDefault();
		}
	}
	
	this.activeOn = function(evName){
		txt.addEventListener(evName, validateInputNumber);
		
		return this;
	}
	
	this.disableOn = function(evnts){
		evnts.forEach(function(evn){
			txt.addEventListener(evn, function(event){
				event.preventDefault ? event.preventDefault() : (event.returnValue = false);
			});
		});
		
		return this;
	}

});


/* examples of usage

$NumValidator({
	maxLen: 8,
	decMaxLen: 2,
	DEBUG: true,
	selector: '#txt'
}).activeOn('keydown').disableOn(['paste','drop'])

$NumValidator({
	maxLen: 12,
	decMaxLen: 3,
	DEBUG: true,
	selector: '#txt1'
}).activeOn('keydown').disableOn(['paste','drop'])

*/