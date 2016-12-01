var slides = {};

(function() {

    // IE does not know about the target attribute. It looks for srcElement
    // This function will get the event target in a browser-compatible way
    function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement; 
    }

    function getImage(event) {
        return getEventTarget(event).parentNode.parentNode.firstChild.firstChild
    }

    function sequenceNumber(file) {
        var match = /.*-([0-9]+)\.[a-z]+$/.exec(file)
        return parseInt(match[1])
    }

    function subsequentImage(file, num) {
        var start = /[0-9]+\.[a-z]+$/.exec(file).index
        var end = /\.[a-z]+$/.exec(file).index
        return file.substring(0, start) + num + file.substring(end)
    }

    this.prev = function(event) {
        var img = getImage(event);
        var num = sequenceNumber(img.src)
        if (num > 0) img.src = subsequentImage(img.src, num - 1)
        if (num == 1) getEventTarget(event).disabled = true
        getEventTarget(event).parentNode.children[1].disabled = false
    }

    this.next = function(event, nimages) {
        var img = getImage(event);
        var num = sequenceNumber(img.src)
        if (num < parseInt(nimages)) img.src = subsequentImage(img.src, num + 1)
        if (num == parseInt(nimages) - 1) getEventTarget(event).disabled = true
        getEventTarget(event).parentNode.children[0].disabled = false
    }
	 
    this.startover = function(event) {
        var img = getImage(event);
        img.src = subsequentImage(img.src, 0)
        getEventTarget(event).parentNode.children[0].disabled = true
        getEventTarget(event).parentNode.children[1].disabled = false
    }
}).apply(slides);

