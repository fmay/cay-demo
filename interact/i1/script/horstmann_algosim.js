/*

Script recipe:

      (function() { // Makes namespace
        var ha = horstmann_algosim 
        var sim_a, sim_i // Variables needed in the actions
        ha.setup.push({
          init: function(sim) {
             var a = ha.randXXX(...) // Create a random something
             sim_a = sim.createXXX('a', a) // Create visualization
             sim_i = sim_a.createIndexVar('i', 'N', 0)
               // Create index variable ('N' = north, 'W' = west etc.)

             // Produce array of actions       
             steps = [];
             i = 0
             while (...) {
                steps.push('action1')
                if (...) steps.push('action2')
                ...
             }

          return steps;
        },

        actions:
          [['action1', 'buttonLabel1', function() {
              sim_i.set(. . .)
          }],
           ['action2', 'buttonLabel2', function() {
              sim_a.set(sim_i.get(), . . .)
          }],
          ...
          ]})})()

In the init method, you generate a random sample and 
precompute the steps that the student must take, as an array 
of action names.

In the actions array, you provide the action name, button label,
and visual behavior of each action.

Pay attention to the difference between regular JavaScript variables
(used in init for precomputation) and simulation variables 
(visible in the simulation and updated in the action functions). 

The simulation variables MUST be declared in the var outside init, 
so that they are visible by init and the action functions. 

Do not update the simulation variables in the precomputation step--
then they'll have the wrong values when init exits and the
simulation starts. 

Also note the various methods:

* randInt, randIntArray, randSelect, etc. are "static" methods 
  of the horstmann_algosim object (ha for short)
* createVar, createArray, etc. are methods of the sim object that
  is passed to the init method
* createIndexVar is a method of a simulation variable that simulates 
  an array (1- or 2-dimensional), or a string
* Each simulation variable has get and set methods. The set methods
  update the visual appearance. 
* For arrays and strings, get without an argument gets the entire
  array or string. If you supply an index, you get the value at
  that index.

For most simulations, it is sufficient to use the state of the 
simulation variables in the action functions. Sometimes, it is
convenient to access the state of the actual array or string instead
of the simulated one. For example, to write a[sim_i.get()] 
instead of sim_a.get(sim_i.get(), just declare a in the outer var 
declaration. (This requires that the array is not changed in
the algorithm, or that you track the changes in the action functions.)
Occasionally, you may have some non-visual state that
needs to be updated in the action functions, Again, declare it 
in the outer var. 

*/

var horstmann_algosim = {
    setup: [],
    genericAlgo: function(prefix, algo) {
        var steps = []
        var actions = []
        var step = 0
        var errors = 0
        var reportElement
        var time

        function str(obj) {
            var result = obj.toString()
            if (result === '') result = '&#160;'
            return result
        }
        
        // Create an index variable.
        // @param name the name of the index variable
        // @param position position of the index variable (N, S, E, W)
        // @param value the initial value
        // @param arrayName the name of the array that the index variable is connected to
        // @param rows the number of rows if the array is two-dimensional
        // @param columns the number of columns if the array is two-dimensional
        function createIndexVar(name, position, value, arrayName, rows, columns) {
            function cellOf(value) {
                var v = value
                var p = position
                
                // Map W and E corner positions to N or S
                if (position == 'W') {
                    if (value == -1) p = 'N'
                    else if (value == rows) { p = 'S'; v = -1 }
                } else if (position == 'E') {
                    if (value == -1) { p = 'N'; v = columns }
                    else if (value == rows) { p = 'S'; v = columns }
                }
                
                return $('#' + prefix + '-array-' + arrayName + '-' + p + v)
            }

            function setCell(newValue) {
                var cell = cellOf(value)
                var text = ''
                var i
                if (cell.length > 0) {
                    // TODO if E or W, do we separate by something else? &#160; <span> </span>?
                    var indexes = cell.html().split(/<br[^>]*>/) // may have namespace in element
                    text = ''
                    for (i = 0; i < indexes.length; i++) {
                        if (indexes[i] != name) {
                            if (text.length > 0) text += "<br/>"
                            text += indexes[i]
                        }
                    }
                    cell.html(text)
                }
                value = newValue
                
                cell = cellOf(value)
                if (cell.length > 0) {
                    text = cell.html()
                    if (text.length > 0) text += "<br/>"
                    cell.html(text + name)
                }
            }

            setCell(value)
            return {
                get: function() { return value },
                set: setCell                             
            }
        }
        
        var sim = { // The object that is passed to the algorithm's init
    
            // Create a variable.
            // @param name the name of the variable
            // @param value the initial value of the variable
            // @return an object with get and set methods to get and set the variable
            createVar: function(name, value) {
                if (value === undefined) value = ''
                var table = '<tr><td class="variableName">'+ name + ': </td>'
                var id = prefix + '-variable-' + name
                table += '<td class="variable"><span id="' + id + '">' + str(value) + '</span></td></tr>'
                $('#' + prefix + '-values').append('<div><table class="array">'+ table + '</table></div>')
               return {
                    get: function() { return value },
                    set: function(newValue) {  
                        value = newValue      
                        $('#' + id).html(str(value))   
                    }
                }
            },

            // Create an array.
            // @param name the name of the array 
            // @param values the initial values
            // @return an object with get and set methods to get and set the array elements
            // and a createIndexVar method to create an index variable            
            createArray: function(name, values) { 

                var table = ''
                var id = prefix + '-array-' + name
                table += '<tr>'
                for (var i = -1; i <= values.length; i++) 
                    table += '<td class="index"><span id="'+ id + '-N' + i +'"></span></td>'      
                table += '</tr>'
                
                table += '<tr>'
                table += '<td class="variableName">' + name +': </td>'  
                for (i = 0; i < values.length; i++) 
                    table += '<td class="variable"><span id="'+ id + '-' + i +'">'+ values[i] +'</span></td>'
                table += '<td class="empty">&#160;</td>'
                table += '</tr>'

                table += '<tr>'
                for (i = -1; i <= values.length; i++) 
                    table += '<td class="index"><span id="'+ id + '-S' + i +'"></span></td>'      
                table += '</tr>'
                
                $('#' + prefix + '-values').append('<div><table class="array">' + table + '</table></div>')   
                return {
                    get: function(i) {
                        if (i === undefined) return values
                        else return values[i]
                    },
                    set: function(i, newValue) { 
                        values[i] = newValue
                        $('#' + id + '-' + i).html(str(newValue))   
                    },
                    createIndexVar: function(varName, position, initialValue) {
                        if (position === undefined) position = 'N'
                        if (initialValue === undefined) initialValue = -2
                        return createIndexVar(varName, position, initialValue, name)
                    }
                }
            },

            // Create a 2D array.
            // @param name the name of the array
            // @param values the initial values
            // @return an object with get and set methods to get and set the array elements
            // and a createIndexVar method to create an index variable            
            createArray2: function(name, values) {                
                var id = prefix + '-array-' + name
                var table = '<tr><td class="variableName">' + name + ': </td></tr>'

                var columns = 0
                for (var i = 0; i < values.length; i++)
                    columns = Math.max(columns, values[i].length)
                
                // North fringe
                table += '<tr><td class="empty"></td>'
                for (var j = -1; j <= columns; j++)
                    table += '<td class="index"><span id="'+ id + '-N' + j +'"></span></td>'
                table += '</tr>'

                // Cells surrounded by east and west fringe
                for (i = 0; i < values.length; i++){
                    table += '<tr><td class="empty"></td>'
                    table += '<td class="index"><span id="'+ id + '-W' + i +'"></span></td>'
                    for (j = 0; j < values[i].length; j++)
                        table += '<td class="variable"><span id="'+ id + '-' + i + '-' + j +'">'+ values[i][j] +'</span></td>'
                    for (j = values[i].length; j < columns; j++)
                        table += '<td class="empty"></td>'
                    table += '<td class="index"><span id="'+ id + '-E' + i +'"></span></td>'
                    table += '</tr>' 
                }

                // South fringe
                table += '<tr><td class="empty"></td>'
                for (j = -1; j <= columns; j++)
                    table += '<td class="index"><span id="'+ id + '-S' + j +'"></span></td>'
                table += '</tr>'        
                $('#' + prefix + '-values').append('<div><table class="array"><tr>'+table+'</tr></table></div>')   

                return {
                    get: function(i, j) {
                        if (i === undefined) return values
                        else if (j === undefined) return values[i]
                        else return values[i][j]
                    },
                    set: function(i, j, newValue) { 
                        values[i][j] = newValue
                        $('#' + id + i + '-' + j).html(str(newValue))
                    },
                    createIndexVar: function(varName, position, initialValue) {
                        if (position === undefined) position = 'N'
                        if (initialValue === undefined) initialValue = -2
                        return createIndexVar(varName, position, initialValue, name, values.length, columns)
                    }
                }
            },

            // Create a string
            // @param name the name of the variable
            // @param value the initial value of the variable
            // @return an object with get and set methods to get and set the string elements
            // (since this might be used for languages with mutable strings)
            // and a createIndexVar method to create an index variable
            
            createString: function(name, value) {
                var table = ''
                var id = prefix + '-array-' + name
                table += '<tr>'
                for (var i = -1; i <= value.length; i++) 
                    table += '<td class="index"><span id="'+ id + '-N' + i +'"></span></td>'      
                table += '</tr>'
                
                table += '<tr>'
                table += '<td class="variableName">' + name +': </td>'  
                for (i = 0; i < value.length; i++) 
                    table += '<td class="character"><span id="'+ id + '-' + i +'">'+ value.charAt(i) +'</span></td>'
                table += '<td class="empty">&#160;</td>'
                table += '</tr>'

                table += '<tr>'
                for (i = -1; i <= value.length; i++) 
                    table += '<td class="index"><span id="'+ id + '-S' + i +'"></span></td>'      
                table += '</tr>'
                
                $('#' + prefix + '-values').append('<div><table class="array">' + table + '</table></div>')   
                return {
                    get: function(i) {
                        if (i === undefined) return value
                        else return value.charAt(i)
                    },
                    set: function(i, character) { 
                        var newValue = value.substr(0, i) 
                        newValue += character
                        newValue += value.substr(i,value.length)
                        value = newValue
                        $('#' + id + '-' + i).html(str(newValue))
                    },
                    createIndexVar: function(varName, position, initialValue) {
                        if (position === undefined) position = 'N'
                        if (initialValue === undefined) initialValue = -2
                        return createIndexVar(varName, position, initialValue, name)
                    }
                }
            }
        }

        function errorCount() {
            return gt.strargs(
                gt.ngettext('One correct', '%1 correct', step),
                step) + ', ' + gt.strargs(
                    gt.ngettext('One error', '%1 errors', errors),
                    errors)
        }

        function incrementScore(s) {
            reportElement[s]++
            $('#' + prefix + '-errors').show()   
            $('#' + prefix + '-errors').html(errorCount())    
        }

        function addAction(name, buttonLabel, action) {
            actions.push(name)
            $('#' + prefix + '-actions').append('<span id="' + prefix + '-' + name + '" class="hc-button hc-step">' + buttonLabel + '</span> ')

            $('#' + prefix + '-' + name).button().click(function() {
                if (name === steps[step]) { 
                    step++ 
                    incrementScore('correct')
                    enableActions(true)
                    $('#' + prefix + '-retry').hide()    
                    action() 
                } else {
                    $('#' + prefix + '-' + name).button('disable')
                    $('#' + prefix + '-retry').show()   
                    errors++;
                    incrementScore('errors')
                }   
            })
        }

        function enableActions(state) {
            for (var i = 0; i < actions.length; i++)
                $('#' + prefix + '-' + actions[i]).button(state ? 'enable' : 'disable')
        }

        function start() {
            steps = algo.init(sim) 
            steps.push('done')
            reportElement.correct = 0
            reportElement.errors = 0
            reportElement.maxscore = steps.length
            
            step = 0
            errors = 0
            $('#' + prefix + '-errors').hide()
            $('#' + prefix + '-input').html('&#160;')    
            $('#' + prefix + '-stored').html('&#160;')
            
            enableActions(true)
            $('#' + prefix + '-step').html(_('Select the next action.'))
            $('#' + prefix + '-start').hide()
            $('#' + prefix + '-startover').show()
            time = new Date().getTime();    
        }

        function done() {
            time = new Date().getTime() - time;
            $('#' + prefix + '-step').html('')
            $('#' + prefix + '-good').show()
            $('#' + prefix + '-errors').show()   
            $('#' + prefix + '-errors').html(errorCount() + ' ' + _('Time') + ': ' + Math.round(time / 1000) + _(' seconds.'))      
            enableActions(false)
        }
        
        function startOver() {
            $('#' + prefix + '-values').html('')
            $('#' + prefix + '-start').show()
            $('#' + prefix + '-startover').hide()
            $('#' + prefix + '-step').html(_('Press start to begin.'))
            $('#' + prefix + '-retry').hide()
            enableActions(false)
            $('#' + prefix + '-errors').hide()
            $('#' + prefix + '-good').hide()
            $('#' + prefix + '-input').html('&#160;')
            $('#' + prefix + '-stored').html('&#160;')    
        }

        reportElement = document.getElementById(prefix)
        if (reportElement == null) return; // this element is not present

        while (reportElement != null && reportElement.className !== 'horstmann_algosim') { reportElement = reportElement.parentNode; }
        if (reportElement == null) {
            console.log('#' + prefix + ' has no horstmann_algosim ancestor')
        } else {

            // If never started, need to guesstimate maxscore
            // Not worth doing anything better because eventually we
            // need to scale to 10 anyway since data-maxscore needs to 
            // be deterministic

            reportElement.correct = 0
            reportElement.errors = 0
            reportElement.maxscore = 0
        }
        
        $('#' + prefix).append('<div class="hc-instructions instructionpanel">' +
                               '<div id="' + prefix + '-step" class="hc-message hc-step"></div>' +
                               '<div><span id="' + prefix + '-retry" class="hc-message hc-retry">' + 
                                _('Try again') + '</span><span id="' + 
                                prefix + '-good" class="hc-message hc-good">' + 
                                _('Good job') + '</span><span id="' + 
                               prefix + '-start" class="hc-start hc-button">Start</span>&#160;</div></div>')
        $('#' + prefix).append('<div id="' + prefix + '-values" class=""></div>')
        $('#' + prefix).append('<div id="' +
                               prefix + '-actions" class="buttonpanel"></div>')

        $('#' + prefix).append('<div class="bottompanel hc-bottom"><div id="' + 
                               prefix + '-errors" class="hc-message hc-errors">' +
                               errorCount() + '</div><div class="buttonpanel"><span id="' +
                               prefix + '-startover" class="hc-button hc-start">' + 
                               _('Start over') + '</span></div></div>')

        $('#' + prefix + '-start').button().click(start)
        $('#' + prefix + '-startover').button().click(startOver)

        for (var i = 0; i < algo.actions.length; i++) {
            addAction(algo.actions[i][0], algo.actions[i][1], algo.actions[i][2])
        }
        addAction('done', _('Done'), done)

        startOver()
    },

    randInt: function(a, b) { // a <= r <= b
        return Math.floor(a + (b - a + 1) * Math.random())
    },

    randIntArray: function(n, low, high) { 
        a = []
        for (var i = 0; i < n; i++) 
            a.push(horstmann_algosim.randInt(low, high))
        return a
    },

    randIntArray2: function(r, c, low, high) { 
        a = []
        for (var i = 0; i < r; i++){
            b = []
            for (var j = 0; j < c; j++)
                b.push(horstmann_algosim.randInt(low, high))
            a.push(b) 
        }
        return a
    },

    randSelect: function() {
        return arguments[horstmann_algosim.randInt(0, arguments.length - 1)];
    }
}

$(document).ready(function() {
    $('.horstmann_algosim').each(function(index, element) {
        var id = 'horstmann_algosim' + (index + 1)
        $(element).attr('id', id)
        horstmann_algosim.genericAlgo(id, horstmann_algosim.setup[index])
    })})
