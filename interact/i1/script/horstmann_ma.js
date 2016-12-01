$(document).ready(function() {
    $('.horstmann_ma').each(function(index, element) {
        element.maxscore = $(element).children().length
        element.correct = 0
        element.errors = 0

        $(element).append('<div class="hc-message hc-errors"></div>')
        errors = $(element).children().last()        

        function errorCount() {
            errors.text(gt.strargs(
                gt.ngettext('One correct', '%1 correct', element.correct),
                element.correct) + ', ' + gt.strargs(
                    gt.ngettext('One error', '%1 errors', element.errors),
                    element.errors))
        }

        errorCount()
        element.className += ' vst-click'
        $(element).find('li').each(function(i, item) {
            $(item).prepend('<span class="hc-button hc-unselected">True</span> <span class="hc-button hc-unselected">False</span> ')
            var children = $(item).children()
            var tbutton = children.first()
            var fbutton = children.eq(1)
            $(tbutton).button().click(function() {
                if ($(tbutton).hasClass('hc-unselected') && $(fbutton).hasClass('hc-unselected')) {
                    if ($(item).hasClass('correct'))
                        element.correct++
                    else
                        element.errors++
                    $(tbutton).removeClass('hc-unselected')
                    $(tbutton).addClass('hc-selected')
                    $(fbutton).removeClass('hc-selected')
                    $(fbutton).addClass('hc-unselected')
                    $(item).removeClass('hc-false')
                    $(item).addClass('hc-true')
                    errorCount()
                }
            })
            $(fbutton).button().click(function() {
                if ($(fbutton).hasClass('hc-unselected') && $(tbutton).hasClass('hc-unselected')) {
                    if ($(item).hasClass('correct'))
                        element.errors++
                    else
                        element.correct++                    
                    $(fbutton).removeClass('hc-unselected')
                    $(fbutton).addClass('hc-selected')
                    $(tbutton).removeClass('hc-selected')
                    $(tbutton).addClass('hc-unselected')
                    $(item).removeClass('hc-true')
                    $(item).addClass('hc-false')
                    errorCount()
                }
            })
        })
})}) 
