$(document).ready(function() {   
    // IE does not know about the target attribute. It looks for srcElement
    // This function will get the event target in a browser-compatible way
    function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement; 
    }

    $('.multiple-choice').each(function(index, element) {
        element.maxscore = 1
        element.correct = 0
        element.errors = 0
        element.className += ' vst-click'
        element.addEventListener('click', function(event) {
            var target = getEventTarget(event);
            while (!(target.nodeName.toLowerCase() == 'li') && target != element ) { target = target.parentNode; }
            if (target != element) {
                var parent = target.parentNode

                if (target.className.indexOf('clicked') < 0) {
                    if (!target.className) target.className = 'clicked'
                    else target.className += ' clicked'
                    if (target.className.indexOf('correct') >= 0) 
                        parent.correct = 1
                    else
                        parent.errors++
                } 
            }
        })
    })
})
