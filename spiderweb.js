/* 
SpiderwebJS is proudly published as open source software under the MIT License

The MIT License (MIT)

Copyright (c) 2013 by Shawn Morrison

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

$spiderweb = (function(){
	var startupTimestamp = Date.now();
	var publicObject = {
		session: {
			pageLoadTime: startupTimestamp,
			events: [],
			notes: []
		},
		noteDelegates: [],
		addNoteDelegate: _addNoteDelegate
		
	};
	
	function _logEvent(event){
		var spiderwebEvent = new _spiderwebEvent(event);
		publicObject.session.events.push(spiderwebEvent);
	}
	
	function _spiderwebEvent(event){
		var spiderwebEvent = {};
		
		var timestamp = Date.now();
		spiderwebEvent.time = timestamp - startupTimestamp;	

		spiderwebEvent.target = _getTargetDescriptor(event);
		
		spiderwebEvent.type = event.type;
		
		if(event.type == 'blur')		{
			if(event.target.type == 'text'){
				spiderwebEvent.value = event.target.value;
			}
		}
		
		if(event.type == 'click'){
			spiderwebEvent.x = event.pageX;
			spiderwebEvent.y = event.pageY;
		}
		
		return spiderwebEvent;
	}
	
	function _getTargetDescriptor(event){
		if(event.target.id){
			return '#' + event.target.id;
		}
		
		var elementCssSelector = event.target.tagName;
		var currentElement = event.target;
		while(currentElement.parentNode && currentElement.parentNode.tagName){
			elementCssSelector = currentElement.parentNode.tagName + '>' + elementCssSelector;
			currentElement = currentElement.parentNode;
		}
		
		return elementCssSelector;
	}
	
	function _addNoteDelegate(delegate){
		publicObject.noteDelegates.push(delegate);
	}
	
	var _setup = function () {
        var body = document.getElementsByTagName('body')[0];
		body.addEventListener('click', _logEvent);
		body.addEventListener('blur', _logEvent, true);
    };
	
	var _getSessionData = function(){
		for(var i = 0; i < publicObject.noteDelegates.length; i++){
			var note = publicObject.noteDelegates[i]();
			publicObject.session.notes.push(note);		
		}
		
		return publicObject.session;
	}
	
	// We run this once the DOM is finished loading, but before waiting for content such as images to load.
	document.addEventListener('DOMContentLoaded', _setup);	
	
	return publicObject;
})();