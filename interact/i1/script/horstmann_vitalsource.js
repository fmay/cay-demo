if (horstmann_config.vitalsource_buttons) {
    $(document).ready(function() {   
        function computeScore(scores) {
            var sum = 0
            var maxscore = 0
            for (var i = 0; i < scores.length; i++) {
                var s = scores[i]
                if (typeof s.correct === 'undefined' ||
                    typeof s.errors === 'undefined' ||
                    typeof s.maxscore === 'undefined')
                    console.log("Bad score element " + JSON.stringify(s))
                else {
                    sum += Math.max(s.correct - s.errors, 0)
                    maxscore += s.maxscore
                }
            }
            return maxscore === 0 ? 0 : sum / maxscore
        }
        $('div[epub\\:type="vst:activity"]' ).each(function(index, element) {
            var location = $(element).attr('id')
	    $(element).append('<div class="hc-vstbutton vst-click"><span id="' + 
                              location + '-submit" class="hc-start hc-button">' + _('vs_submit_scores') + '</span></div>')
            if (horstmann_config.vitalsource_debug) 
                $(element).append('<div class="hc-vstreport"></div>')
            var submitButton = $('#' + location + '-submit').button()
            if (!horstmann_config.vitalsource_debug && 
                   (typeof VST === 'undefined' || !VST.Book)) 
               submitButton.addClass("ui-button-disabled")
            submitButton.click(function() {
                scores = []
                $(element).find('div, ol').filter(function(i, e) {
                    var ty = $(e).prop('tagName')
                    var cl = $(e).attr('class')
                    return cl && (ty === 'div' && cl.indexOf('horstmann_') === 0 || ty === 'ol' && cl.indexOf('multiple-choice') === 0) // TODO: horstmann_multiplechoice
                }).each(function(i, e) {
                    var id = $(e).closest('li').attr('id')
                    scores.push({correct: e.correct, errors: e.errors, maxscore: e.maxscore, 
                                 activity: id, element: e.id}) 
                    // last two for debugging
                })

                var score = computeScore(scores)
                var toVitalSource = [{ score: score, maxscore: 1, location: location}]
                var vstreport = $(element).find('.hc-vstreport')
                var message = vstreport == null ? '' : JSON.stringify(toVitalSource) + " computed from " + JSON.stringify(scores)                
                
                if (typeof VST !== 'undefined' && VST.Book) {	
                    if (vstreport != null) vstreport.text("Reporting scores to VitalSource: " + message) 
                    submitButton.addClass("ui-button-disabled")
		    VST.Book.reportScores(toVitalSource, function(err) {
                        if (vstreport != null) vstreport.append("<hr/>Reply from VitalSource: " + JSON.stringify(err))
		    })
                    submitButton.removeClass("ui-button-disabled")
	        } else {
                    if (vstreport != null) vstreport.text("No scores are reported to VitalSource. Score computation details: " + message) 
                }
            })
        })
    })
}
