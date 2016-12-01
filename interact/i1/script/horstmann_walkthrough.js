/********************** Start Events class ****************************/

var Events;
(Events = function() {
}).prototype = {
    addEventListener: function(type, method, scope, context, data) {
        var listeners, handlers, scope,type;

        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });

    },
    dispatchEvent: function(type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (typeof(context)!=="undefined" && context !== handler.context) continue;
            if (handler.method.call(handler.scope, this, type, data)===false) {
                return false;
            }
        }
        return true;
    }
};


/************************ Start Timer Class ********************************/
var Timer = function()
{

	
	var bStop = false;
	var nCurrentPassedSec = 0;
	var bPassTen = false;
	var obs
	var self = this;
	var timeOut;
	var bPlaying = false;
	var timerType = "";
	var intervalTime1 = 10;
	var intervalTime2 = 30;
	function init()
	{
		obs = new Events();
	}

	function start()
	{
		bStop = false;
		bPassTen = false;
		bPlaying = true;
		clearTimeout(timeOut)
		timeOut = setTimeout(incriment,1000);
	}
	function stop()
	{
		bStop = true;
		bPlaying = false;
		clearTimeout(timeOut)
	}

	function incriment()
	{
		if(!bStop)
		{
			nCurrentPassedSec++;

			if(nCurrentPassedSec>=intervalTime1 && !bPassTen)
			{
				bPassTen = true;

				obs.dispatchEvent('CheckTimer');		
			}
			if(nCurrentPassedSec>=intervalTime2 && bPassTen)
			{
				bStop = true;
				bPassTen = true;
				obs.dispatchEvent('CheckTimer');	
			}
			clearTimeout(timeOut)
			timeOut = setTimeout(incriment,1000);
		}
	}

	init();
	
	return{

		reset:function()
		{
			nCurrentPassedSec = 0;
			bPassTen = false;
		},
		start:function()
		{
			start();
		},
		stop:function()
		{
			stop();
		},
		inc:function()
		{
			incriment();
		},
		bPlaying:function(){
			return bPlaying;
		},
		currentInc:function()
		{
			return nCurrentPassedSec;
		},
		setTimerType:function(args)
		{
			timerType = args;
		},
		getTimerType:function()
		{
			return timerType;
		},
		intervalTime1:intervalTime1,
		intervalTime2:intervalTime2,
		stopped:bStop,
		Evts:obs
	}
}

var horstmann_walkthrough;
function getElement(obj)
{
	ctr = 0
	while (!obj.hasClass("horstmann_walkthrough") && ctr <10)
	{
		obj = $(obj.parent());
		++ctr;
	}
	return obj;

}

function initializeVitalsourceData(element, obj)
{
	var steps = eval("horstmann_walkthrough"+$(obj).attr("id").split("walkthrough")[1]);
	var maxscr = 0;
	for (i=0;i<steps.length;i++)
	{
		stepObj = steps[i];
		
		if (stepObj.answer != undefined)
			maxscr++;
		if (stepObj.gotoline != undefined)
			maxscr++;
		if (stepObj.remove != undefined)
			maxscr++;
	}
	
	element.maxscore = maxscr;
    element.correct = 0;
   	element.errors = 0;
}

//Global variables defined with in the scope of this page
(function(player){
	
	//
	var totalNoOfAnimations;
	var totalNoOfTries = 2;
	//
	var screenInstruction1 = gt.gettext("new_value_inst");
	var screenInstruction2 = gt.gettext("click_line_inst");
	var screenInstruction3 = gt.gettext("click_variable_inst");
	var screenInstruction4 = gt.gettext("click_line_inst");
	var screenInstruction5 = gt.gettext("new_value_small_inst");
	var cColumn = 1;
	var walkthroughCnt = 1;
	var vScore = 0;
	var vStepWalkthroughId = "";
	var currentInput = "";
	var lineToResetObject = null;
	
	player.setup = [];
	var oTimer = new Timer();    // Defined timer obj
	oTimer.Evts.addEventListener('CheckTimer',handleTimerEvents)
	
	player.setTimeoutInstance = null;
	player.setTimeoutInstanceB = null;
	player.setTimeoutInstanceC = null;

	player.screenInstruction1 = screenInstruction1;
	player.screenInstruction2 = screenInstruction2;
	player.screenInstruction3 = screenInstruction3;
	player.screenInstruction4 = screenInstruction4;
	player.screenInstruction5 = screenInstruction5;
	player.vStepWalkthroughId = vStepWalkthroughId;
	player.currentInput = currentInput; 
	player.totalNoOfTries = totalNoOfTries;
	player.vScore = vScore;
	player.oTimer = oTimer;
	player.walkthroughCnt = 0;
	player.seeNextStepClicked = false;
	player.textBlurScoreIncremented = false;
	player.textLastInput = null;
	
	player.preClass = new Array();
	
	horstmann_walkthrough.lineToResetObject = null;

	$(document).ready(function(){
		//-Content display trigger not required for walkthrough as activity initializes properlly and does not require height calculation.
		initializeWalkthrough();
	});
	function initializeWalkthrough()
	{
		$(".horstmann_walkthrough").each(function () {
			//--Add vstdonthighlight and vst-click
			$(this).addClass("vstdonthighlight").addClass("vst-click");
			//
			player.preClass.push($(this).find("pre").attr("class"));
			
			//-- Add default class hc-hand to table
			if($(this).find("table").attr("class") == undefined){
				$(this).find("table").addClass("hc-hand");
			}
			
		});
		
		
		$(".horstmann_walkthrough PRE").reformatPreWalkthrough(); // reformating pre
		
		for(var i=0;i<player.setup.length;i++)
		{
			window["horstmann_walkthrough"+(i+1)] = player.setup[i]
		}
		
		$( ".horstmann_walkthrough").each(function () {
				
				/*$(this).before( $(this).children( ".initalExpression" ) );*/
				$(this).attr("id","walkthrough"+walkthroughCnt);
				walkthroughCnt++;
				player.walkthroughCnt++;

				initializeVitalsourceData($(this)[0], $(this));
		});

		walkthrough_controller.initialize();	
		
		if(typeof String.prototype.trim !== 'function') {
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g, ''); 
			}
		}

	}
		
	/**************************** handle timer event ***************************************/	
	// utility functions
	function handleTimerEvents(e)
	{
		if(oTimer.currentInc()==oTimer.intervalTime1)
		{
			if (oTimer.getTimerType() == "removeColumn")
			{
				$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").html(gt.gettext("more_remove_inst"));
			}else{
				$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").html(gt.gettext("enter_press_inst"));
			}

			$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").css('display','block');
			clearTimeout(horstmann_walkthrough.setTimeoutInstanceC);
			horstmann_walkthrough.setTimeoutInstanceC = setTimeout(function(){
			//	$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").css('display','none');
				$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").html("");
			},4000)
		}
		else if(oTimer.currentInc()==oTimer.intervalTime2)
		{
			if (oTimer.getTimerType() == "removeColumn")
			{
				var idWalkthrough = horstmann_walkthrough.vStepWalkthroughId
				var IdNumber = idWalkthrough.substr(12,idWalkthrough.length);
				
				if (eval("tries"+IdNumber) >= horstmann_walkthrough.totalNoOfTries) {
					var inputObject = "tableHeading";
					$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").html(gt.gettext("wrong_variable_msg")+" "+gt.gettext("try_again_or_msg"));
					$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").css('display','block')
					$(horstmann_walkthrough.vStepWalkthroughId+" .seeNextStep").css("display","block");

					var AnimationId = $(horstmann_walkthrough.vStepWalkthroughId).attr("id");
					walkthrough_view.fillNextStep(AnimationId,inputObject,idWalkthrough,IdNumber);
					
					oTimer.stop();  //Stop timer
					oTimer.reset(); //Reset Timer
				}else
				{
					$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").html(gt.gettext("wrong_variable_msg")+" "+gt.gettext("try_again_msg"));
					$(horstmann_walkthrough.vStepWalkthroughId+" .warningMsg").css('display','block');
					if (eval("tries"+IdNumber) == 0)
					{
						eval("tries"+IdNumber+ "= tries"+IdNumber+" + 1");	
					}
					eval("tries"+IdNumber+ "= tries"+IdNumber+" + 1");
					oTimer.stop();
					oTimer.reset(); //Reset Timer
					oTimer.start();
				}
			}else{
				walkthrough_controller.executeStep(horstmann_walkthrough.vStepWalkthroughId,horstmann_walkthrough.currentInput);
				oTimer.stop();  //Stop timer
				oTimer.reset(); //Reset Timer
			}

			
		}
	}


	/* pushing reformatPre to jquery */
	$.fn.reformatPreWalkthrough = function( method ) {

			var defaults = {
				ignoreExpression: /\s/ // what should be ignored?
			};

			var methodsWt = {
				initWt: function( options ) {
					
					return;
					this.each( function() {
						
						var context = $.extend( {}, defaults, options );
						var $obj = $( this );
						var usingInnerText = true;
						var text = $obj.get( 0 ).innerText;
						// some browsers support innerText...some don't...some ONLY work with innerText.
						if ( typeof text == "undefined" ) {
							text = $obj.html();
							usingInnerText = false;
						}

						// use the first line as a baseline for how many unwanted leading whitespace characters are present
						var superfluousSpaceCount = 0;
						var currentChar = text.substring( 0, 1 );

						while ( context.ignoreExpression.test( currentChar ) ) {
							currentChar = text.substring( ++superfluousSpaceCount, superfluousSpaceCount + 1 );
						}

						// split
						var parts = text.split( "\n" );
						var reformattedText = "";

						// reconstruct
						var length = parts.length;
						for ( var i = 0; i < length; i++ ) {
							// cleanup, and don't append a trailing newline if we are on the last line
							reformattedText += parts[i].substring( superfluousSpaceCount ) + ( i == length - 1 ? "" : "\n" );
						}
						// modify original
						if ( usingInnerText ) {
							//$obj.get( 0 ).innerText = reformattedText;
							$obj.get( 0 ).value = reformattedText;
							
						}
						else {
							// This does not appear to execute code in any browser but the onus is on the developer to not 
							// put raw input from a user anywhere on a page, even if it doesn't execute!
							$obj.html( reformattedText );
						}
					} );
				}
			}

			if ( methodsWt[method] ) {
				return methodsWt[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			}
			else if ( typeof method === "object" || !method ) {
				return methodsWt.initWt.apply( this, arguments );
			}
			else {
				$.error( "Method " + method + " does not exist on jQuery.reformatPreWalkthrough." );
			}
		}
		
		/* end push*/
})(horstmann_walkthrough = horstmann_walkthrough || {})


/************************************* Controller Class Start **********************************/

var walkthrough_controller = {
	
	errorCount:function(element) {
		// return gt.strargs(
		// 	gt.ngettext('One error', '%1 errors', err),
		// err)
		var cor = (element.correct == undefined)?0:element.correct;
		var err = (element.errors == undefined)?0:element.errors;
		return gt.strargs(
        gt.ngettext('One correct', '%1 correct', cor),
        cor) + ', ' + gt.strargs(
        gt.ngettext('One error', '%1 errors', err),
        err)
	},

	initialize:function(){		
	
		totalNoOfAnimations = horstmann_walkthrough.walkthroughCnt;

		Logger.debug = false;	 // uncomment line to disable debugger
				
		//Setting DOM with div's integrated with pre and table tag
		
		for(var i=1;i<=totalNoOfAnimations;i++)
		{
			//Defining variables going to used through out the walkthrough
			window["oTimer"+i] = i;
			eval("Noofcolumns"+i+" = $('#walkthrough"+i+" table tr > th').size()");
			eval("walkthroughCount"+i+" = 0");
			eval("lLine"+i+" = 0");
			eval("cRow"+i+" = 1");
			eval("aLineClick"+i+" = 0");
			eval("aTableHClick"+i+" = 0");
			eval("tries"+i+" = 0");
			eval("score"+i+" = 0");
			eval("totalSteps"+i+" =0");
			

			var preTag = '<div id="instDv'+i+'" class="instructions hc-instructions hc-step"></div>'+
				'<div class="codeContainer"><div class="preTag"></div>'+
				'<div class="Table"></div></div>'
			//Append span according to format in below added divs
			$("#walkthrough"+i).append(preTag);	
			
			//Append div to instruction div
			$("#instDv"+i).append('<div class="instructions1 hc-message">'+gt.gettext("Press start to begin.")+'</div>');
			$("#instDv"+i).append('<span class="hc-button hc-start" id="startbtnWT'+i+'">'+gt.gettext("start_button")+'</span>');
			$("#instDv"+i).append('<div id="warnMsg'+i+'" class="warningMsg hc-message hc-retry"></div>');
			$("#instDv"+i).append('<span class="hc-button hc-retry seeNextStep">'+gt.gettext("next_step_button")+'</span>');
			$("#instDv"+i).append('<div class="goodjob"><img width="25" height="25" style="vertical-align:middle;position:absolute;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzMjRCMEREODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzMjRCMERFODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMyNEIwREI4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTMyNEIwREM4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5fkXkUAAAA+UlEQVR42mJM3ujOQA3ARKY+fiDOAeIVQCwKEmAhwxBdIN4CxHJAfBCIv5PjInsgPgw1pA+InYH4C6kuUoe6hAeIpwBxMTlhxAnEq6GGXEA3hBSDuqBhA/JGBBD/IscgGyDOhLKzgPgmOdHPBsRzgJgZiBdDMcF0xIxFvggayE+BuICYBAlKYA+B+DMQq0DFpIG4GslL74gxyBKqERQr85ECGMRfCcSbiM0iB6HOhwXuZCCOgsZSMSl5DZTMm5DEc6B0K5IFRGfauUB8B4l/B5oNSM79f6ExA6IfAXEQtoSHC6Dnta1ALA/EL6AGMpBrEAOxYYIOAAIMAHdiLpAopYgmAAAAAElFTkSuQmCC" /><span class="gJobText hc-message hc-good"></span></div>');
			
			//Binding pre and table tags to the div
			$("#walkthrough"+i+" pre").appendTo("#walkthrough"+i+" .preTag");
			$("#walkthrough"+i+" table").appendTo("#walkthrough"+i+" .Table");
			walkthrough_preParser.Parser(i);
			
			//Add class name to each span
			$("#walkthrough"+i+" .preTag .mainSpan").each(function(index){
				$(this).addClass("span"+(index+1));
			});
			
			//Prepend paper clip images and font to the defined span 

			// CSH Removed adding preTag to span. The tag is added when .preTag 
			// is being replaced with a pre further down.

			$("#walkthrough"+i+" .preTag .mainSpan").prepend(
				"<img style='vertical-align:middle' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY1QkZEMDc0MUY5MjExRTM4MEFGRjQwOTM5QjUzMTAxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY1QkZEMDc1MUY5MjExRTM4MEFGRjQwOTM5QjUzMTAxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjVCRkQwNzIxRjkyMTFFMzgwQUZGNDA5MzlCNTMxMDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjVCRkQwNzMxRjkyMTFFMzgwQUZGNDA5MzlCNTMxMDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50AtG8AAAAuElEQVR42mL8//8/A60B46glg86SQQHYgPghEP8nAR8A4nBaO0wCiI8BsSsuBTZAfJ5El78F4slo5hgD8WFsFvAA8SsgNiPR5SB9Z7C4/BU0uBmYkAS9gfgsEJ+iIP6QwTto0KFYogjE17BofEIguD4A8WUg3oGmVxSIP4IYLGg2q6Mp/AXEMmT4ChQnj2CWIANpIH4O9RGlqeskECfjUuBBRupCx/eAuJTuOXq0FB61ZNQSwgAgwACItW3wO+GYXwAAAABJRU5ErkJggg==' />"				
			);
				
			$("#walkthrough"+i+" .preTag .mainSpan").append(
				"<img width='25' height='25' style='vertical-align:middle;position:absolute;visibility:hidden' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII=' />"
			);	

			$("#walkthrough"+i+" .preTag .mainSpan").append(
				"<img width='23' height='24' style='vertical-align:middle;position:absolute;visibility:hidden' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAACXBIWXMAADZfAAA2XwHBy+RXAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAZBJREFUeNqs1b9LVnEUx/GXj2EYEf3YWlxcUqGg/6AhgoaElrKGFoewQRvMIaKhHBILWhKRcJCGUokmwdQhEIQQhzAcdBAjQQqCflBIupwLl8vj433u41kun3PO933vPd/vOd86cw7CjqEdN3EWK4cOAHoag7iW8vWXaoQ24kkGOoqhWsF3M9AP6MXfWsBXA1IfegXd2IKi4HN4GJsG33Efi0lCEfBJPEBbyjeA8XRSteA63I6jldgEnmcTqwVfRk+8AD7iHn7XAm6Oup4KvYk+rJZLzgs+HJDzof/jKWb2WpAXfAPXU/o1histyANuiUY4EvozHuNHHnATLkYd09aAO2gN/Sugn/b7mhIu4VUcm2c4kYonEyuxl3iT71zOWcaZTKtOxl+8jS5L5kAHNvKAS9gps1FH0ZWCbqE/LzQBv8/4LmAMnSnfSJm8fcGzGd9xXIknzGMI29WCl7C+R/wbHlWIVwR/xVSZ2A5eYLrIXC3hH97hTyY2G3fZdhFwvVvgS9S0GT+xELNhrej1sjsAMPJLEf/HKa4AAAAASUVORK5CYII=' />"
			);	
			

			$("#walkthrough"+i+" th").prepend(
				"<img width='15' height='15' style='vertical-align:middle;position:absolute;margin:6px 0 0 -15px;visibility:hidden' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII=' />"				
			);

			//Append first row for each walkthrough 
			content = "";
			content = content + "<tr class='row_1'>";	
			for (var k = 1; k <= eval("Noofcolumns"+i); k++) {			
				content = content + "<td align='center' class='1_"+k+" hc-tablecell'></td>";
			}
			content = content + "</tr>";
			
			$("#walkthrough"+i+" table").append(content);
			
			//--- Assign class to table header
			$("#walkthrough"+i+" table th").addClass("hc-tableheader")
			
			//--- Assign class to table header
			$("#walkthrough"+i+" table td").addClass("hc-tablecell")
			
			$("#walkthrough"+i+" table input").addClass("hc-input")
			
			//--- Assign width to th
			// Adding cross image to table
			$("#walkthrough"+i+" .Table").append("<div class='trCrossImg'><img width='25' height='25' style='vertical-align:middle;position:absolute;visibility:visible;margin: 10px 62px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII=' /></div>");	

			
			//Get the total number of steps from the JSON
			for (var z = 0;z < eval("horstmann_walkthrough"+i).length ;z++){
				if(eval("(horstmann_walkthrough"+i+")[z].value == undefined")){
					eval("totalSteps"+i+ "= totalSteps"+i+" + 1");
				}					
			}
			
			// Add bottomDv 
			$("#walkthrough"+i).append('<div class="bottomDv hc-bottom"></div>');
			
			//Add error feedback div to bottomDv
			$("#walkthrough"+i+" .bottomDv").append('<div class="errorfeedback hc-message hc-errors" id="errorfeedbackwalkthrough'+i+'"><span class="nooferrors">'+walkthrough_controller.errorCount(0)+'</span><span class="timespent"></span></div>');

			//Add startover buttonDv to bottomDv
			$("#walkthrough"+i+" .bottomDv").append('<span class="hc-button hc-start" id="buttonWT'+i+'">'+gt.gettext("Start over")+'</span>');
			$('#buttonWT'+i).css('display','none');

			$('#errorfeedbackwalkthrough'+i).hide();


			$(".horstmann_walkthrough #buttonWT"+i).unbind("click").on("click touch",function(){				
				//Getting the Walkhtrough Number from current button ID
				var buttonID = $(this).attr("id"); 				
				buttonID = buttonID.substring(8,buttonID.length);
				$("#buttonWT"+buttonID).css("display","none");	
				$("#warnMsg"+buttonID).hide();
				walkthrough_controller.Restart(buttonID);
				if (isIE() < 9 && isIE()){
					$(".warningMsg").html(gt.gettext("browserwarning"));//gt.gettext("browserwarning"));
					$(".warningMsg").css("float","none");
					$(".warningMsg").show();
				}
			});

			//Start Traversing the walkthroughs
			$(".horstmann_walkthrough #startbtnWT"+i).unbind("click").on("click touch",function(){
				var buttonID = $(this).attr("id"); 				
				buttonID = buttonID.substring(10,buttonID.length);				
				$(this).hide();
				$("#warnMsg"+buttonID).show();
				$("#buttonWT"+buttonID).css("display","inline-block");
				$("#errorfeedbackwalkthrough"+buttonID).show();
				walkthrough_controller.start(buttonID);
			});
			
			
			// added by amit for replacing the div tag to pre tag
			$("#walkthrough"+i).find('.preTag').replaceWith( "<pre class='preTag'>" + $("#walkthrough"+i).find('.preTag').html() + "</pre>" );
			// CSH
			if (horstmann_walkthrough.preClass[i-1] != undefined){
                            $("#walkthrough"+i+" .preTag").addClass(horstmann_walkthrough.preClass[i-1]); 
}

			
			
		}
		function isIE () {
		  var myNav = navigator.userAgent.toLowerCase();
		  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
		}
		//Give focus to first walkthrough
		walkthrough_view.focusInput(1);
		setTimeout(function () {
			if (isIE() < 9 && isIE()){
				$(".warningMsg").html(gt.gettext("browserwarning"));//gt.gettext("try_again_msg"));
				$(".warningMsg").css("float","none");
				$(".warningMsg").show();
			}
		}, 500);
	},

	//Start Method
	start:function(i){
		$("#warnMsg"+i).html("");
		$("#warnMsg"+i).hide();
		$("#warnMsg"+i).css("float","left");
		var date = new Date();
		window["oTimer"+i] = date.getTime();
		walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+i),i);
		walkthrough_controller.bindWalkthroughLogic(i);
	},
	
	//Will traverse the row and will create variable in global scope
	traverseWalkthrough:function(lineCount,cWalkthrough){

		if(eval("horstmann_walkthrough"+cWalkthrough).length > lineCount){
			eval("cVar"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].variable");
			eval("cLine"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].line");
			eval("cGotoline"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].gotoline");
			eval("cRemove"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].remove");
			eval("cRemoved"+cWalkthrough+" = new Array()")
			eval("aTableHClick"+cWalkthrough+" = 1");
			eval("cValue"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].value");
			
			eval("cAnswer"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"].answer");
			eval("cGotoLineLength"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+lineCount+"]");	
		}else{	//When the walkthrough is over	
			eval("cLine"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+(lineCount-1)+"].line");
			eval("cGotoline"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+(lineCount-1)+"].gotoline");
			eval("cRemove"+cWalkthrough+" = (horstmann_walkthrough"+cWalkthrough+")["+(lineCount-1)+"].remove");

			var cLine = eval("cLine"+cWalkthrough);
			var cGotoline = eval("cGotoline"+cWalkthrough);
			var cRemove = eval("cRemove"+cWalkthrough);
			/*var prevLineNoMoveConstant = false;
			if (typeof prevGotoLine != "undefined" || typeof prevRemove != "undefined")
			{
				prevLineNoMoveConstant = true;
			}
			console.log("traverse end: prevGotoLine: "+prevGotoLine + "   prevRemove: "+prevRemove);

			var walkthroughId = "#walkthrough"+cWalkthrough;
			
			if(cLine == undefined && cGotoline != undefined){
				walkthrough_view.showClipwithBackground(walkthroughId,cGotoline);
			}else{
				//--Added 06/11/15
				console.log("prevLineNoMoveConstant...> "+prevLineNoMoveConstant)
				if (!prevLineNoMoveConstant)
					eval("lLine"+cWalkthrough+ "= lLine"+cWalkthrough+" + 1");
				walkthrough_view.showClipwithBackground(walkthroughId,eval("lLine"+cWalkthrough));
			}
			*/
			eval("cVar"+cWalkthrough+" = 0");

			$("#walkthrough"+cWalkthrough+" .feedback").css("display","block");
			var date = new Date();
			var elapseTime = date.getTime();
			var totalTimeSpent =  elapseTime - window["oTimer"+cWalkthrough]
			var tSeconds = Math.round(totalTimeSpent/1000)
						
			$("#errorfeedbackwalkthrough"+cWalkthrough+" .timespent").html(", "+tSeconds+" "+gt.gettext("seconds"));
			$("#walkthrough"+cWalkthrough+" .gJobText").html(gt.gettext("Good job")) 
			$("#walkthrough"+cWalkthrough+" .goodjob").css("display","block"); 
		}
	},
	
	// Core Alog to handle all the logic behind walkthroughs
	bindWalkthroughLogic:function(cWalkthrough, showClipBackground){
		
		if (showClipBackground == undefined)
			showClipBackground = true;
		horstmann_walkthrough.textBlurScoreIncremented = false;
		var walkthroughId = "#walkthrough"+cWalkthrough; 
		$(walkthroughId+" .preTag .mainSpan").css("cursor","default");
		eval("tries"+cWalkthrough+" = 0");
		
		if(eval("cVar"+cWalkthrough) != 0){
			//Variables to be used within local scope	
			
			var cVar = eval("cVar"+cWalkthrough);
			
			var cLine = eval("cLine"+cWalkthrough);
			var cGotoline = eval("cGotoline"+cWalkthrough);
			var cRemove = eval("cRemove"+cWalkthrough);
			var cValue = eval("cValue"+cWalkthrough);		
			var cAnswer = eval("cAnswer"+cWalkthrough);
			var cGotoLineLength = eval("cGotoLineLength"+cWalkthrough);
			
			var walkthroughCount = eval("walkthroughCount"+cWalkthrough);
			//JIRA Comment: You always move to the next line at the start of a command unless the previous command was remove or gotoline, or an explicit line was given.
			
			var prevLineNoMoveConstant = false;
			if (walkthroughCount > 0)
			{
				prevLine = eval("(horstmann_walkthrough"+cWalkthrough+")["+(walkthroughCount-1)+"].line");
				prevGotoLine = eval("(horstmann_walkthrough"+cWalkthrough+")["+(walkthroughCount-1)+"].gotoline");
				prevRemove = eval("(horstmann_walkthrough"+cWalkthrough+")["+(walkthroughCount-1)+"].remove");
					console.log(prevGotoLine + " :prevGotoLine  <>  prevRemove: " + prevRemove + "   prevLine: "+prevLine)

				if (typeof prevGotoLine != "undefined" || typeof prevRemove != "undefined"/* || typeof prevLine != "undefined"*/)
				{
					prevLineNoMoveConstant = true;
				}
			}
			
			console.log("prevLineNoMoveConstant::: "+prevLineNoMoveConstant);

			if(typeof cVar !== "undefined"){ //Variable defined
				var tVar = cVar.toLowerCase();
				
				if (cAnswer+"" == "undefined" && cValue+"" != "undefined"){
					walkthrough_view.showInstruction(walkthroughId,"","");
				}else{
					if (tVar == 'output') {
						walkthrough_view.showInstruction(walkthroughId,horstmann_walkthrough.screenInstruction5,tVar);
					}else{
						walkthrough_view.showInstruction(walkthroughId,horstmann_walkthrough.screenInstruction1,cVar);	
					}
				}
				
				if(typeof cLine != "undefined"){
					//line defined within variable	
					eval("lLine"+cWalkthrough+" = "+cLine);
				}else{
					if (!prevLineNoMoveConstant)
					{
						console.log("updated here...")
						eval("lLine"+cWalkthrough+ " = lLine"+cWalkthrough+" + 1");
					}
				}
				console.log("next line to highlight::: "+eval("lLine"+cWalkthrough))
				if (showClipBackground)
					walkthrough_view.showClipwithBackground(walkthroughId,eval("lLine"+cWalkthrough));
				
				if(typeof cAnswer !== "undefined"){	//Answer defined
					//Check whether to create new row or not

					walkthrough_controller.getColumnNumberByVar(walkthroughId,cVar);
					
					

					var isRHSrowNotEmpty = false;
					var tableColumn = $(walkthroughId+ " table .row_"+eval("cRow"+cWalkthrough)+" ."+eval("cRow"+cWalkthrough)+"_"+(cColumn+1));
					var colCtr = cColumn+1;
					while (tableColumn.length != 0){
						if (tableColumn.text() != ""){
							isRHSrowNotEmpty = true;
						}
						++colCtr
						var tableColumn = $(walkthroughId+ " table .row_"+eval("cRow"+cWalkthrough)+" ."+eval("cRow"+cWalkthrough)+"_"+colCtr);
					}
					
					if($(walkthroughId+ " table .row_"+eval("cRow"+cWalkthrough)+" ."+eval("cRow"+cWalkthrough)+"_"+cColumn).text() != "" || isRHSrowNotEmpty){
						walkthrough_view.appendNewRow(cWalkthrough);
					}
					if (typeof cAnswer == "object"){
						walkthrough_view.addInputWithoutTimer(walkthroughId,cWalkthrough,cVar,cAnswer[0]);
					}else{
						walkthrough_view.addInputWithoutTimer(walkthroughId,cWalkthrough,cVar,cAnswer);
					}
					walkthrough_controller.bindInputEvents(walkthroughId);
					walkthrough_view.focusInput(cWalkthrough);

				}else if(typeof cValue !== "undefined"){ //Value defined	
					//Check whether to create new row or not
					walkthrough_controller.getColumnNumberByVar(walkthroughId,cVar);										
					if($(walkthroughId+ " table .row_"+eval("cRow"+cWalkthrough)+" ."+eval("cRow"+cWalkthrough)+"_"+cColumn).text() != ""){
						walkthrough_view.appendNewRow(cWalkthrough);
					}									
					walkthrough_view.addInputWithTimer(walkthroughId,cWalkthrough,cVar,cValue);
					clearTimeout(horstmann_walkthrough.setTimeoutInstance);
					horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){
						
						if(horstmann_walkthrough.setTimeoutInstance != null ){
							eval("walkthroughCount"+cWalkthrough+ "= walkthroughCount"+cWalkthrough+" + 1");
							walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+cWalkthrough),cWalkthrough);
							walkthrough_controller.bindWalkthroughLogic(cWalkthrough);
						}
					},2000);
				}			
			}else if(typeof cGotoline !== "undefined"){	//gotoline defined
				var count = 0;
				var i;
				for (i in cGotoLineLength) {
				    if (cGotoLineLength.hasOwnProperty(i)) {
				        count++;
				    }
				}
				
console.log("in gotoline..."+count+" - "+(typeof cLine))
				if(count > 1){
					walkthrough_view.showInstruction(walkthroughId,horstmann_walkthrough.screenInstruction4,"");
					if(typeof cLine != "undefined"){
						eval("lLine"+cWalkthrough+" ="+cLine);
						if (showClipBackground)
							walkthrough_view.showClipwithBackground(walkthroughId,cLine);
						
					}

					eval("aLineClick"+cWalkthrough+" = 1");
					walkthrough_controller.spanClick(walkthroughId, cWalkthrough);


				}else if(count == 1){
					if(typeof cLine != "undefined"){
						//line defined within variable	
						eval("lLine"+cWalkthrough+" ="+cLine);
					}else{
						if (!prevLineNoMoveConstant)
							eval("lLine"+cWalkthrough+ "= lLine"+cWalkthrough+" + 1");
					}
console.log("lline>>>> "+eval("lLine"+cWalkthrough));
					if (showClipBackground)
						walkthrough_view.showClipwithBackground(walkthroughId,eval("lLine"+cWalkthrough));

					walkthrough_view.showInstruction(walkthroughId,horstmann_walkthrough.screenInstruction2,"");
					
					eval("aLineClick"+cWalkthrough+" = 1");
					walkthrough_controller.spanClick(walkthroughId, cWalkthrough);
					
					//cLine = cLine - 1;
					
					//eval("lLine"+cWalkthrough+ "="+cLine);
				}
			

			}else if(typeof cRemove !== "undefined"){ //Only remove defined
				walkthrough_view.showInstruction(walkthroughId,horstmann_walkthrough.screenInstruction3,"");
			
				if(typeof cLine != "undefined"){
					eval("lLine"+cWalkthrough+" ="+cLine);
					
					//walkthrough_view.showClipwithBackground(walkthroughId,cLine);
				}else{
					if (!prevLineNoMoveConstant)
						eval("lLine"+cWalkthrough+ "= lLine"+cWalkthrough+" + 1");
				}

				if (showClipBackground)
					walkthrough_view.showClipwithBackground(walkthroughId,eval("lLine"+cWalkthrough));
				
				
				eval("aTableHClick"+cWalkthrough+" = 1");
				
				walkthrough_controller.tableHeadingClick(walkthroughId);
			} else if(typeof cLine !== "undefined"){	//Only line defined
				console.log("in...")
				eval("lLine"+cWalkthrough+" ="+cLine);
				//eval("lLine"+cWalkthrough+ "= lLine"+cWalkthrough+" + 1");
				
				walkthrough_view.showClipwithBackground(walkthroughId,cLine);

				walkthrough_view.showInstruction(walkthroughId,"","");
				clearTimeout(horstmann_walkthrough.setTimeoutInstance);

				horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){
					eval("walkthroughCount"+cWalkthrough+ "= walkthroughCount"+cWalkthrough+" + 1");
					walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+cWalkthrough),cWalkthrough);
					walkthrough_controller.bindWalkthroughLogic(cWalkthrough);
				},1500);

				//eval("aLineClick"+cWalkthrough+" = 1");
				//walkthrough_controller.spanClick(walkthroughId);
				//cLine = cLine - 1;
				//eval("lLine"+cWalkthrough+ "="+cLine);

			}else{
				console.log("Something went wrong at line: "+(eval("walkthroughCount"+cWalkthrough)+1)+" : ", JSON.stringify(eval("(horstmann_walkthrough"+cWalkthrough+")[walkthroughCount"+cWalkthrough+"]")));
			}
		}
	},

	//Get the coloumn number by variable
	getColumnNumberByVar:function(idWalkthrough,varVal){
		$(idWalkthrough+" table tr th").each(function(index){			
			if($(this).text() == varVal){				
				cColumn = index+1;
			}
		});		
	},

	//Bind events to input box
	bindInputEvents:function(idWalkthrough){		
	
		/******* Binding Events ************************************/
		
		var IdNumber = idWalkthrough.substr(12,idWalkthrough.length);
		eval("tries"+IdNumber+" = 0");
		$(idWalkthrough+" input").bind('focusin', walkthrough_controller.handleTextFieldEvents)
		$(idWalkthrough+" input").bind('keyup', walkthrough_controller.handleTextFieldEvents)
		$(idWalkthrough+" input").bind('keydown', walkthrough_controller.handleTextFieldEvents)
	},


	/****************** Start Handle text field events Method **********************/

	handleTextFieldEvents:function(e){
		e = e || window.event;
		var idWalkthrough = "#"+$(e.target).parents(".horstmann_walkthrough").attr('id');
		horstmann_walkthrough.vStepWalkthroughId = idWalkthrough;
		horstmann_walkthrough.currentInput = $(e.target);
		var inputOn = 1;
		var IdNumber = idWalkthrough.substr(12,idWalkthrough.length);
		var vValLen = $(e.target).val().length;
		//$(".debugDiv").text("KeyType::: "+e.type+"   keyCode::: "+e.keyCode);
		switch(e.type)
		{	
			case 'focusin':
				horstmann_walkthrough.textBlurScoreIncremented = false;
				if(vValLen > 0){   // check whether user has entered value? 
					if (!horstmann_walkthrough.oTimer.bPlaying()) {
						horstmann_walkthrough.oTimer.setTimerType("textEntry");
						horstmann_walkthrough.oTimer.start();
					}
				}
				$(e.target).unbind('focusout').bind('focusout', walkthrough_controller.handleTextFieldEvents)		
			break;

			case 'focusout':
				$(e.target).unbind('focusout')
				if(vValLen > 0){
					horstmann_walkthrough.oTimer.stop();
					horstmann_walkthrough.oTimer.reset();
					walkthrough_controller.executeStep(idWalkthrough,$(e.target)); // call execute step method
				}
				
			break;

			case 'keyup':
				if (typeof e.stopPropagation != "undefined") {
			        e.stopPropagation();
			    } else {
			        e.cancelBubble = true;
			    }
				
				if (vValLen > 0) {
					
					if (!horstmann_walkthrough.oTimer.bPlaying()) {
						
						horstmann_walkthrough.oTimer.setTimerType("textEntry");
						horstmann_walkthrough.oTimer.start();
					}
				}
				if(e.keyCode == 13 || lastKeycode == 13)
				{  
					horstmann_walkthrough.oTimer.reset(); //Reset Timer
					horstmann_walkthrough.oTimer.stop();  //Stop timer

					walkthrough_controller.executeStep(idWalkthrough,$(e.target)) // call execute step method 
					
				}
				else
				{	
					horstmann_walkthrough.oTimer.reset();
					
				}
			break;
			case 'keydown':
				lastKeycode = e.keyCode;
			    if (typeof e.stopPropagation != "undefined") {
			        e.stopPropagation();
			    } else {
			        e.cancelBubble = true;
			    }
			break;

		}
	},	
	/***************** End of Handle text field events **************************/


	/***************** Start Execute Step Method ***********************/
	
	executeStep:function(idWalkthrough, inputObj){
		var inputOn = 1;
		var IdNumber = idWalkthrough.substr(12,idWalkthrough.length);
		//---@SA modified
		var corrAns = (eval("cAnswer"+IdNumber));
		
		var userAns = String(inputObj.val());
		var ansCorrect = false;
		
		if(typeof(corrAns) != "object"){
			if (typeof(corrAns) == "number"){
				userAns = Number(userAns)
				corrAns = Number(corrAns);
			}else{
				userAns = $.trim(userAns.toLowerCase());
				corrAns = $.trim(corrAns.toLowerCase());
			}
			if(userAns == corrAns && String(inputObj.val()) != ""){
				inputObj.val(eval("cAnswer"+IdNumber));
				ansCorrect = true;
			}
		}else{
			
			for(m = 0; m < corrAns.length; m++){
				if (typeof(corrAns[m]) == "number"){
					userAns = Number(userAns)
					corrAnsVal = Number(corrAns[m]);
				}else{
					corrAnsVal = corrAns[m];
				}
				
				if(userAns == corrAnsVal && String(inputObj.val()) != ""){
					
					inputObj.val(eval("cAnswer"+IdNumber)[0]);
					ansCorrect = true
					break;
				}
			}
		}
		var element = getElement($(idWalkthrough))[0];
		
		//---[ Blank field check to fix issue PROD-60153]
		
		if(ansCorrect){
			element.correct++;
			$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
			//-- Modified by SA - to check for 0 also
			$(idWalkthrough+" .seeNextStep").css("display","none"); // hide next step button
			// Draw line-through in above row when value is entered in below row 
			var linethroughRow = parseInt(inputObj.parent().attr("class").split("_")[0]) - 1;
			var linethroughcolumn = parseInt(inputObj.parent().attr("class").split("_")[1]);	
			
			var heading = $(idWalkthrough+" th:nth-child("+linethroughcolumn+")").text().toLowerCase();
			
			for(var i=linethroughRow;i>0;i--)
			{						
				if($(idWalkthrough+" td."+i+"_"+linethroughcolumn).html() != "X" && heading != "output"){
					$(idWalkthrough+" td."+i+"_"+linethroughcolumn).css("text-decoration","line-through");
				}
			}
			//$("#warnMsg"+IdNumber).css('display','none')
			$("#warnMsg"+IdNumber).text("");
			$(idWalkthrough+" .trCrossImg").css("display","none");
			inputObj.parent().html(inputObj.val());	
			eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
			walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
			
			walkthrough_controller.bindWalkthroughLogic(IdNumber);														
		}else{
			
			if(inputObj.val().length > 0){				
				eval("tries"+IdNumber+ "= tries"+IdNumber+" + 1");
				
				if (horstmann_walkthrough.textLastInput != userAns){
					eval("score"+IdNumber+ "= score"+IdNumber+" + 1");	
					element.errors++;

					horstmann_walkthrough.textBlurScoreIncremented = true;
					clearTimeout(horstmann_walkthrough.setTimeoutInstance);
					horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){horstmann_walkthrough.textBlurScoreIncremented = false;},500)
				}
				
				$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
				inputOn = 0;
				inputObj.css("background","#f4d3dd");
				var spanID = $(inputObj).parent();	
				if(eval("tries"+IdNumber) >= horstmann_walkthrough.totalNoOfTries){
					var inputObject;
					if (inputObj.parent().attr("class").indexOf("hc-tablecell") != -1){
						inputObject = inputObj.parent().attr("class").split(" ")[0];
					}else{
						inputObject = inputObj.parent().attr("class");
					}
					$("#warnMsg"+IdNumber).html(gt.gettext("try_again_or_msg"));														
					$("#warnMsg"+IdNumber).css('display','block');
					$(idWalkthrough+" .trCrossImg").css("display","block");
					$(idWalkthrough+" .seeNextStep").css("display","block");
					var AnimationId = 0;
					walkthrough_view.fillNextStep(AnimationId,inputObject,idWalkthrough,IdNumber);
				}else
				{
					$("#warnMsg"+IdNumber).html(gt.gettext("try_again_msg"));
					$("#warnMsg"+IdNumber).css('display','block')
					$(idWalkthrough+" .trCrossImg").css("display","block");
				}

			}else
			{
				inputObj.css("background","#FFFFFF");
			
			}						
		}
		horstmann_walkthrough.textLastInput = userAns;
		
	},

	//Bind the click event on span 
	spanClick:function(idWalkthrough, rowNo){
		$(idWalkthrough + " .preTag .mainSpan").css("cursor","pointer");
		$(idWalkthrough + " .preTag .mainSpan").off("click");
		$(idWalkthrough + " .preTag .mainSpan").on("click",function(){
			
			//--Added to remove previous cross;
			if (horstmann_walkthrough.lineToResetObject != null){
				horstmann_walkthrough.lineToResetObject.css("visibility","hidden");		
				horstmann_walkthrough.lineToResetObject = null;
			}
			//---------------------------------------
			
		var bCorrectClicked = false;
			var AnimationId = $(this).parents(".horstmann_walkthrough").attr("id");
			
		console.log("spanClick..."+AnimationId)

			if(typeof AnimationId !== "undefined"){
				var IdNumber = AnimationId.substr(11,AnimationId.length);
				if(eval("aLineClick"+IdNumber) == "1"){
					var classArray = $(this).attr("class").split(" ");
					
					if(typeof eval("cGotoline"+IdNumber) !== "undefined"){
						var spanClicked = "span"+eval("cGotoline"+IdNumber);
						
						for(var i=0;i<classArray.length;i++){

							/*--[ STOP ELSE MATCHING, insted add array for correct options ]
							var elseMatch = false;
							if (classArray[i].indexOf("span")!=-1 && $(this).text() == "else"){
								var curSpanId = Number(classArray[i].substr(4,String(classArray[i]).length))+2;
								var reqSpanId = Number(spanClicked.substr(4,String(spanClicked).length));
								if (reqSpanId == curSpanId){
									elseMatch = true
								}
							}
							 || elseMatch
							*/

							var opeaningBraseMatch = false;
							if (classArray[i].indexOf("span")!=-1 && $(this).text() == "{"){
								var curSpanId = Number(classArray[i].substr(4,String(classArray[i]).length))+1;
								var reqSpanId = Number(spanClicked.substr(4,String(spanClicked).length));
								if (reqSpanId == curSpanId){
									opeaningBraseMatch = true;
								}
							}
							
							var multipleIdsMatch = false;
							if (spanClicked.indexOf(",") != -1){
								var spanIDs = spanClicked.split("span")[1].split(",");
								for (var s=0; s<spanIDs.length; s++){
									if (classArray[i] == "span"+spanIDs[s]){
										multipleIdsMatch = true;
										break;
									}
								}
							}
							
							if(classArray[i] == spanClicked || opeaningBraseMatch || multipleIdsMatch){
								$(idWalkthrough+" .instructions1").html("");
								
								$(idWalkthrough+" .seeNextStep").css("display","none");//hide next step button
								//$("#warnMsg"+IdNumber).css('display','none');
								$("#warnMsg"+IdNumber).text("");
								eval("tries"+IdNumber+" = 0");

								eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
								var goToLineNo = eval("cGotoline"+IdNumber);






								console.log("idWalkthrough::: "+idWalkthrough)
								//---SA: 09Feb16---changed from decreasing to increasing...
								var prevLineNoMoveConstant = false;
								if (IdNumber > 0)
								{
									prevGotoLine = eval("(horstmann_walkthrough"+IdNumber+")["+(rowNo-1)+"].gotoline");
									prevRemove = eval("(horstmann_walkthrough"+IdNumber+")["+(rowNo-1)+"].remove");
									console.log("From span click::: prevGotoLine: " + prevGotoLine + " <>  prevRemove: " + prevRemove)
									if (typeof prevGotoLine != "undefined" || typeof prevRemove != "undefined")
									{
										prevLineNoMoveConstant = true;
									}
								}
								console.log("prevLineNoMoveConstant: "+prevLineNoMoveConstant)
/*
								if (prevLineNoMoveConstant)
								{
									if (typeof(goToLineNo) == "number")
									{
										eval("lLine"+IdNumber+ "= cGotoline"+IdNumber);
									}else{
										eval("lLine"+IdNumber+ "= cGotoline"+IdNumber+"[0]");
									}
								}else{
									if (typeof(goToLineNo) == "number")
									{
										eval("lLine"+IdNumber+ "= cGotoline"+IdNumber+" + 1");
									}else{
										eval("lLine"+IdNumber+ "= cGotoline"+IdNumber+"[0] + 1");
									}
								}
								
	*/							
								if (typeof(goToLineNo) == "number")
								{
									eval("lLine"+IdNumber+ "= cGotoline"+IdNumber);
								}else{
									eval("lLine"+IdNumber+ "= cGotoline"+IdNumber+"[0]");
								}
								
								eval("aLineClick"+IdNumber+" = 0");
								
								//var walkthroughId = "#walkthrough"+cWalkthrough; 
								var cGotoline = eval("cGotoline"+IdNumber);
								
								if (typeof(cGotoline) == "object"){
									cGotoline = cGotoline[0];//Number(classArray[i].split("span")[1]);
								}
								
								var tickLine = cGotoline;//classArray[i].split("span")[1];//--New---//Changed---PROD-60491
								
								walkthrough_view.showClipwithBackground(idWalkthrough,cGotoline);
								//$(this).children("img:nth-child(3)").css("visibility","visible");//---PROD-60491
								$(idWalkthrough+" .span"+cGotoline+" img:nth-child(3)").css("visibility","visible");//---PROD-60491
								clearTimeout(horstmann_walkthrough.setTimeoutInstance);
								horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){
									walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
									walkthrough_controller.bindWalkthroughLogic(IdNumber);
								//	$(this).children("img:nth-child(3)").css("visibility","hidden");//--New
									
									$(idWalkthrough+" .span"+tickLine+" img:nth-child(3)").css("visibility","hidden");//--New
								},1500);
								
								bCorrectClicked = true;
								break;
							}
						}
						var element = getElement($(idWalkthrough))[0];
						
						if(!bCorrectClicked)
						{
							eval("tries"+IdNumber + " += 1");
							eval("score"+IdNumber+ "= score"+IdNumber+" + 1");
							element.errors++;
							//if (eval("score"+IdNumber) < 2)
							$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
							//eval("score"+IdNumber)+" "+gt.gettext("error_text"));
							/*else
								$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(eval("score"+IdNumber)+" "+gt.gettext("error_plural_text"));*/
							
							if (eval("tries"+IdNumber) >= horstmann_walkthrough.totalNoOfTries){
								var inputObject = "span";
								$("#warnMsg"+IdNumber).html(gt.gettext("wrong_line_msg")+" "+gt.gettext("try_again_or_msg"));
								$("#warnMsg"+IdNumber).css('display','block')
								$(idWalkthrough+" .seeNextStep").css("display","block"); // display see next step button
								walkthrough_view.fillNextStep(AnimationId,inputObject,idWalkthrough,IdNumber);
							}else{
								$("#warnMsg"+IdNumber).html(gt.gettext("wrong_line_msg")+" "+gt.gettext("try_again_msg"));
								$("#warnMsg"+IdNumber).css('display','block')
							}
							var spanID = $(this);
							$(this).children("img:nth-child(2)").css("visibility","visible");
							walkthrough_controller.resetLine(spanID);
//							setTimeout(function(){walkthrough_controller.resetLine(spanID)},500);
						}else{
							element.correct++;
							$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
						}

					}else{
						
						var spanClicked = "span"+eval("cLine"+IdNumber);
						
						for(var i=0;i<classArray.length;i++){
							if(classArray[i] == spanClicked){
								eval("tries"+IdNumber+" = 0");
								$(idWalkthrough+" .seeNextStep").css("display","none"); // hide next step button
								//$("#warnMsg"+IdNumber).css('display','none')
								$("#warnMsg"+IdNumber).text("");
								eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
								eval("aLineClick"+IdNumber+" = 0");								
								walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
								walkthrough_controller.bindWalkthroughLogic(IdNumber);
								bCorrectClicked = true;
								break;
							}
						}

						if(!bCorrectClicked)
						{	
							eval("tries"+IdNumber + " += 1");
							eval("score"+IdNumber+ "= score"+IdNumber+" + 1");
							element.errors++;
//							if (eval("score"+IdNumber) < 2)
							$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));//eval("score"+IdNumber)+" "+gt.gettext("error_text"));
/*							else
								$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(eval("score"+IdNumber)+" "+gt.gettext("error_plural_text"));*/
								
							if (eval("tries"+IdNumber) >= horstmann_walkthrough.totalNoOfTries) {
								var inputObject = "span";
								$("#warnMsg"+IdNumber).html(gt.gettext("wrong_line_msg")+" "+gt.gettext("try_again_or_msg"));
								$("#warnMsg"+IdNumber).css('display','block')
								$(idWalkthrough+" .seeNextStep").css("display","block");
								walkthrough_view.fillNextStep(AnimationId,inputObject,idWalkthrough,IdNumber);
							}else
							{
								$("#warnMsg"+IdNumber).html(gt.gettext("wrong_line_msg")+" "+gt.gettext("try_again_msg"));
								$("#warnMsg"+IdNumber).css('display','block')
							}
							var spanID = $(this)
							$(this).children("img:nth-child(2)").css("visibility","visible");
							clearTimeout(horstmann_walkthrough.setTimeoutInstance);
							horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){walkthrough_controller.resetLine(spanID)},500)
						}else{
							element.correct++;
							$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
						}

					}
				}
			}
		});
	},
	

	resetLine:function(obj)
	{		
		horstmann_walkthrough.lineToResetObject = obj.children("img:nth-child(2)");
	},

	resetThLine:function(obj)
	{
		horstmann_walkthrough.lineToResetObject = obj.children("img:nth-child(1)")
	},
	
	//Bind click event on the table Header
	tableHeadingClick:function(idWalkthrough){
		//--Start Timer for click remove
		
		horstmann_walkthrough.oTimer.stop();
		horstmann_walkthrough.oTimer.reset();
		//--[SA-11Dec: Timer for remove]---
		horstmann_walkthrough.oTimer.setTimerType("removeColumn");

		horstmann_walkthrough.oTimer.start();

		//-------------------------

		$(idWalkthrough+" table").css("cursor","pointer");
		$(idWalkthrough+" table").unbind("click").on("click",function(e,ui){
			var tablehdr;
			
			if ($(e.target).prop("tagName").toLowerCase() == "th"){
				tablehdr = $(e.target);
			}else{
				var classId = $(e.target).attr("class").split(" ")[0];
				var colId = Number(classId.split("_")[1])-1;
				
				tablehdr = $(e.target).parents(".Table").find("th:eq("+colId+")");
			}

			if (horstmann_walkthrough.lineToResetObject != null){
				horstmann_walkthrough.lineToResetObject.css("visibility","hidden");		
				horstmann_walkthrough.lineToResetObject = null;
			}
			var element = getElement($(idWalkthrough))[0];
			var bCorrect = false;
			var AnimationId = tablehdr.parents(".horstmann_walkthrough").attr("id");
			if(typeof AnimationId !== "undefined"){
				var IdNumber = AnimationId.substr(11,AnimationId.length);
				
				if(eval("aTableHClick"+IdNumber) == "1")
				{
					if (typeof(eval("cRemove"+IdNumber)) == "string"){
						if(tablehdr.text() == eval("cRemove"+IdNumber))
						{
							$(idWalkthrough+" .seeNextStep").css("display","none"); // hide see next step button
							//$("#warnMsg"+IdNumber).css('display','none') 
							
							$("#warnMsg"+IdNumber).text("");
							eval("tries"+IdNumber+" = 0"); // Reset vscore
							eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
	
							walkthrough_controller.getColumnNumberByVar("#"+AnimationId,eval("cRemove"+IdNumber))
							// insert new row if digit is filled
	
							var bAllFilled = false
							
							for(var i=eval("cRow"+IdNumber);i>0;i--)
							{			
								
								if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')
								{
									
									//bAllFilled = true;
									break;
								}
							}
							if($("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html()=='')
							{
								
								bAllFilled = true;
								
							}
							
							if(!bAllFilled)
							{
								
								walkthrough_view.appendNewRow(IdNumber);
							}

						
							/*for(var i=eval("cRow"+IdNumber);i>0;i--)
							{							
										
								if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')
								{								
									$("#"+AnimationId+" td."+i+"_"+cColumn).html("X"); // x is implemented here
								}
								bCorrect = true;
							}*/
							if($("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html()=='')
							{								
								$("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html("X"); // x is implemented here
							}
							//--Start Timer for click remove
							horstmann_walkthrough.oTimer.stop();
							horstmann_walkthrough.oTimer.reset();
							//
							bCorrect = true;
							$("#"+AnimationId+" table").off("click").css("cursor","default");
							$("#"+AnimationId+" table img").css("visibility","hidden");
							eval("aTableHClick"+IdNumber+" = 0");
							walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
							walkthrough_controller.bindWalkthroughLogic(IdNumber/*, false*/);
							
						}
					}else{
						//---Case Array---
						for (z=0;z<eval("cRemove"+IdNumber+".length");z++){
							
							var itemNotRemoved = true;
							for (r=0;r<eval("cRemoved"+IdNumber+".length");r++){
								if (tablehdr.text() == eval("cRemoved"+IdNumber)[r]){
									itemNotRemoved = false;
									bCorrect = true;
									break;
								}
							}



							
							if(tablehdr.text() == eval("cRemove"+IdNumber)[z] && itemNotRemoved)
							{

								$(idWalkthrough+" .seeNextStep").css("display","none"); // hide see next step button
								//$("#warnMsg"+IdNumber).css('display','none') 
								
								$("#warnMsg"+IdNumber).text("");
								eval("tries"+IdNumber+" = 0"); // Reset vscore
								
		
								walkthrough_controller.getColumnNumberByVar("#"+AnimationId,eval("cRemove"+IdNumber)[z])
								// insert new row if digit is filled
		
								var bAllFilled = false
								for(var i=eval("cRow"+IdNumber);i>0;i--)
								{			
									
									if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')
									{
										
										//bAllFilled = true;
										break;
									}
								}

								if($("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html()=='')
								{
									
									bAllFilled = true;
									
								}

								if(!bAllFilled)
								{
									
									walkthrough_view.appendNewRow(IdNumber);
								}
										
								if($("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html()=='')
								{								
									$("#"+AnimationId+" td."+eval("cRow"+IdNumber)+"_"+cColumn).html("X"); // x is implemented here
								}
								bCorrect = true;
							
								if(bCorrect){
									eval("cRemoved"+IdNumber).push(eval("cRemove"+IdNumber)[z]);
									$("#"+AnimationId+" table img").css("visibility","hidden");
								}
								var sortedRemove = eval("cRemove"+IdNumber).sort().join(",");
								var sortedRemoved = eval("cRemoved"+IdNumber).sort().join(",");
								
								if (sortedRemove == sortedRemoved){
									$("#"+AnimationId+" table").off("click").css("cursor","default");
									eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
									eval("aTableHClick"+IdNumber+" = 0");
									walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
									walkthrough_controller.bindWalkthroughLogic(IdNumber/*, false*/);
									//--Stop Timer for click remove
									horstmann_walkthrough.oTimer.stop();
									horstmann_walkthrough.oTimer.reset();
								}								
								break;
							}
						}
					}
				}

				if(!bCorrect)
				{
					//horstmann_walkthrough.vScore++;
					eval("tries"+IdNumber+" += 1");
					eval("score"+IdNumber+ "= score"+IdNumber+" + 1");
					element.errors++;


					
					if (eval("tries"+IdNumber) >= horstmann_walkthrough.totalNoOfTries) {
						var inputObject = "tableHeading";
						$("#warnMsg"+IdNumber).html(gt.gettext("wrong_variable_msg")+" "+gt.gettext("try_again_or_msg"));
						$("#warnMsg"+IdNumber).css('display','block')
						$(idWalkthrough+" .seeNextStep").css("display","block");
						horstmann_walkthrough.oTimer.stop();
						horstmann_walkthrough.oTimer.reset();
						walkthrough_view.fillNextStep(AnimationId,inputObject,idWalkthrough,IdNumber);
					}else
					{
						$("#warnMsg"+IdNumber).html(gt.gettext("wrong_variable_msg")+" "+gt.gettext("try_again_msg"));
						$("#warnMsg"+IdNumber).css('display','block')
						horstmann_walkthrough.oTimer.stop();
						horstmann_walkthrough.oTimer.reset();
						horstmann_walkthrough.oTimer.start();									

					}
					var spanID = tablehdr
					tablehdr.children("img:nth-child(1)").css("visibility","visible");
					clearTimeout(horstmann_walkthrough.setTimeoutInstance);
					horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){walkthrough_controller.resetThLine(spanID)},500)
				}else{
					element.correct++;

				}
				$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));
				
			}
		});
	},
	
	//Click on start button will call to restart the application
	Restart:function(i){		
		
		if (horstmann_walkthrough.setTimeoutInstance != null) {
			clearTimeout(horstmann_walkthrough.setTimeoutInstance);
			
		};
		clearTimeout(horstmann_walkthrough.setTimeoutInstanceB);
		clearTimeout(horstmann_walkthrough.setTimeoutInstanceC);
		//Defining variables going to used through out the walkthrough
		eval("Noofcolumns"+i+" = $('#walkthrough"+i+" table tr > th').size()");
		eval("walkthroughCount"+i+" = 0");
		eval("lLine"+i+" = 0");
		eval("cRow"+i+" = 1");
		eval("aLineClick"+i+" = 0");
		eval("aTableHClick"+i+" = 0");
		eval("tries"+i+" = 0");
		eval("score"+i+" = 0");
		window["oTimer"+i] = 0;

		//Hide scor feedback			
		$("#walkthrough"+i+" .feedback").hide();//.css("display","none");
		$("#walkthrough"+i+" .goodjob").hide();//.css("display","none"); 
		$("#walkthrough"+i+" .trCrossImg").hide();//.css("display","none"); 
//		$("#walkthrough"+i+" .warningMsg").hide();//.css("display","none"); 
		$("#walkthrough"+i+" .warningMsg").text("");

		//Hide Next Step and also off the attached event		
		$("#walkthrough"+i+" .seeNextStep").css("display","none");
		$("#walkthrough"+i+" .seeNextStep").off("click");
		$("#errorfeedbackwalkthrough"+i+" .nooferrors").html(walkthrough_controller.errorCount(0));//"0 "+gt.gettext("error_text"));
		$("#errorfeedbackwalkthrough"+i+" .timespent").html(" ");
		$("#errorfeedbackwalkthrough"+i).css("display","none");
		//$("#walkthrough"+i+" .preTag .mainSpan").css("background","#FFFFFF");  // change bg from yellow to white
		
		$("#walkthrough"+i+" .preTag .mainSpan").removeClass("hc-highlight");//.addClass("codeLineNormal");
//		$("#walkthrough"+i+" .preTag .mainSpan");//.addClass("codeLineNormal");
		
		$("#walkthrough"+i+" span img:nth-child(1)").css("visibility","hidden"); // hide clip bg image
		$("#walkthrough"+i+" span img:nth-child(2)").css("visibility","hidden"); // hide cross bg image
		$("#walkthrough"+i+" span img:nth-child(3)").css("visibility","hidden"); // hide tick bg image
		
		$("#walkthrough"+i+" table img").css("visibility","hidden");

		var element = getElement($("#walkthrough"+i))[0];
		element.errors=0;
		element.correct=0;

		setTimeout(function(){
			$("#walkthrough"+i+" table tr").each(function(index){
			if(index != 0){
				$(this).remove();
			}
		}); 
		content = "";
		content = content + "<tr class='row_1'>";	
		for (var k = 1; k <= eval("Noofcolumns"+i); k++) {			
			content = content + "<td align='center' class='1_"+k+" hc-tablecell'></td>";
		}		
		content = content + "</tr>";
		$("#walkthrough"+i+" table").append(content);
		if (horstmann_walkthrough.setTimeoutInstance != null) {
			clearTimeout(horstmann_walkthrough.setTimeoutInstance);
			horstmann_walkthrough.setTimeoutInstance=null;
		};
		},10);
		
		setTimeout(function(){
			$("#walkthrough"+i+" table tr").each(function(index){
				if(index != 0){
					$(this).children('td').html('');
				}
			});
		},10);

		//Append first row for each walkthrough 
		
		$("#startbtnWT"+i).removeAttr("style");
		walkthrough_view.showInstruction("#walkthrough"+i,gt.gettext("Press start to begin."),"")
		
	}

}


/************************************* walkthrough_view Class Start **********************************/

var walkthrough_view = {
	
	//Show the paperclip with yellow background
	showClipwithBackground:function(idWalkthrough,line){
		
		if(line <= $(idWalkthrough+" .preTag .mainSpan").size()){
			$(idWalkthrough+" .preTag .mainSpan").removeClass("hc-highlight");//.addClass("codeLineNormal")
			$(idWalkthrough+" .preTag .mainSpan img").css("visibility","hidden");
			$(idWalkthrough+" .span"+line).addClass("hc-highlight");//.removeClass("codeLineNormal")
			$(idWalkthrough+" .span"+line+" img:nth-child(1)").css("visibility","visible");
		}
	},
	
	//Show instruction accordingly
	showInstruction:function(idWalkthrough,instruction,varVal){
		if(varVal != ""){
			$(idWalkthrough+" .instructions1").text(instruction+" "+varVal+".");
		}else{
			$(idWalkthrough+" .instructions1").text(instruction);
		}
	},
	
	//Add input without timer
	addInputWithoutTimer:function(idWalkthrough,IdNumber,varVal,ansVal){
		walkthrough_controller.getColumnNumberByVar(idWalkthrough,varVal);
		$(idWalkthrough+" table .row_"+eval("cRow"+IdNumber)+" ."+eval("cRow"+IdNumber)+"_"+cColumn).append("<input  autocapitalize='off' autocorrect='off' autocomplete='off' autoformat='off' spellcheck='false' type='text' />"); // Removed lenght constraint from text input	
	},
	
	//Add input with automate fill in with timer
	addInputWithTimer:function(idWalkthrough,IdNumber,varVal,ansVal){
		walkthrough_controller.getColumnNumberByVar(idWalkthrough,varVal);
		
		clearTimeout(horstmann_walkthrough.setTimeoutInstanceB);
		horstmann_walkthrough.setTimeoutInstanceB = null;
		
		horstmann_walkthrough.setTimeoutInstanceB = setTimeout(function(){
			
			$(idWalkthrough+" table .row_"+eval("cRow"+IdNumber)+" ."+eval("cRow"+IdNumber)+"_"+cColumn).html(ansVal);
		},1000);
		//Draw line-through in above row when value is entered in below row 
		var linethroughRow = eval("cRow"+IdNumber)-1;
		var linethroughcolumn = cColumn;
		
		var heading = $(idWalkthrough+" th:nth-child("+linethroughcolumn+")").text().toLowerCase();
		for(var i=linethroughRow;i>0;i--)
		{			
			if($(idWalkthrough+" td."+i+"_"+linethroughcolumn).html() != "X" && heading != "output"){
				$(idWalkthrough+" td."+i+"_"+linethroughcolumn).css("text-decoration","line-through");
			}
		}
	},
	
	//Give focus to input box
	focusInput:function(IdNumber){
		$("#walkthrough"+IdNumber+" table tr td input").focus();
	},
	
	//Append new row within the table
	appendNewRow:function(IdNumber){
		eval("cRow"+IdNumber+ "= cRow"+IdNumber+" + 1");
		var cRow = eval("cRow"+IdNumber);
		content = "";
		content = content + "<tr class='row_"+cRow+"'>";

		for (var k = 1; k <= eval("Noofcolumns"+IdNumber); k++) {			
			content = content + "<td align='center' class='"+cRow+"_"+k+" hc-tablecell'></td>";
		}

		content = content + "</tr>";
		$("#walkthrough"+IdNumber+" table").append(content);
	},

	//Fill Answer on Next Step
	fillNextStep:function(AnimationId,inputObject,idWalkthrough,IdNumber){
	
		$(idWalkthrough+" .seeNextStep").unbind("click").on("click",function(event){
			var element = getElement($(this))[0];
			
			if (!horstmann_walkthrough.textBlurScoreIncremented)
			{
				eval("score"+IdNumber+ "= score"+IdNumber+" + 1");
				element.errors++;
			}
//			if (eval("score"+IdNumber) < 2)
				$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(walkthrough_controller.errorCount(element));//eval("score"+IdNumber)+" "+gt.gettext("error_text"));
/*			else
				$("#errorfeedbackwalkthrough"+IdNumber+" .nooferrors").html(eval("score"+IdNumber)+" "+gt.gettext("error_plural_text"));*/
				
			eval("walkthroughCount"+IdNumber+ "= walkthroughCount"+IdNumber+" + 1");
			//$("#warnMsg"+IdNumber).css('display','none')
			$("#warnMsg"+IdNumber).text("");
			eval("tries"+IdNumber+" = 0");
			$(idWalkthrough+" .trCrossImg").css("display","none");
			//unbind click event
			$(idWalkthrough+" .seeNextStep").off(event);

			if(inputObject == "tableHeading"){
				if (typeof(eval("cRemove"+IdNumber)) == "string"){
					walkthrough_controller.getColumnNumberByVar("#"+AnimationId,eval("cRemove"+IdNumber))
					
					// insert new row if digit is filled				
					var bAllFilled = false
					for(var i=eval("cRow"+IdNumber);i>0;i--)
					{			
						
						if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')
						{
							bAllFilled = true;
							break;
						}
					}
					if(!bAllFilled)
					{
						walkthrough_view.appendNewRow(IdNumber);
					}
					// end of insert new row if digit is filled
					for(var i=eval("cRow"+IdNumber);i>0;i--)
					{							
						if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')  // check for empty column
						{
							$("#"+AnimationId+" td."+i+"_"+cColumn).html("X"); // x is implemented here
						}	
						
					}
					
					eval("aTableHClick"+IdNumber+" = 0");
					$("#"+AnimationId+" table").off("click").css("cursor","default");
					walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
					walkthrough_controller.bindWalkthroughLogic(IdNumber/*, false*/);	
					
				}else{
					//---Case array
					var found
					for (z=0;z<eval("cRemove"+IdNumber).length;z++){
						found = false;
						for (f=0;f<eval("cRemoved"+IdNumber).length;f++){
							if (eval("cRemove"+IdNumber)[z] == eval("cRemoved"+IdNumber)[f]){
								found = true;
							}
						}
						
						if (!found){
						
							walkthrough_controller.getColumnNumberByVar("#"+AnimationId,eval("cRemove"+IdNumber)[z])
							
							// insert new row if digit is filled				
							var bAllFilled = false
							for(var i=eval("cRow"+IdNumber);i>0;i--)
							{			
								
								if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')
								{
									bAllFilled = true;
									break;
								}
							}
							if(!bAllFilled)
							{
								walkthrough_view.appendNewRow(IdNumber);
							}
							// end of insert new row if digit is filled
							for(var i=eval("cRow"+IdNumber);i>0;i--)
							{	
								if($("#"+AnimationId+" td."+i+"_"+cColumn).html()=='')  // check for empty column
								{
									$("#"+AnimationId+" td."+i+"_"+cColumn).html("X"); // x is implemented here
								}	
								
							}
							eval("cRemoved"+IdNumber).push(eval("cRemove"+IdNumber)[z])
			
							
						}
					}
					var sortedRemove = eval("cRemove"+IdNumber).sort().join(",");
					var sortedRemoved = eval("cRemoved"+IdNumber).sort().join(",");
					
					if (sortedRemove == sortedRemoved){
						
						eval("aTableHClick"+IdNumber+" = 0");
						$("#"+AnimationId+" table").off("click").css("cursor","default");
						walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
						walkthrough_controller.bindWalkthroughLogic(IdNumber/*, false*/);	
						
					}
				}
				$("#"+AnimationId+" table img").css("visibility","hidden");
			}else if(inputObject == "span"){

				if(typeof eval("cGotoline"+IdNumber) !== "undefined"){
					var goToLineNo = eval("cGotoline"+IdNumber);
					if (typeof(goToLineNo) == "number")
					{
						eval("lLine"+IdNumber+ "= cGotoline"+IdNumber);
					}else{
						eval("lLine"+IdNumber+ "= cGotoline"+IdNumber+"[0]");
					}
					eval("aLineClick"+IdNumber+" = 0");					
				}else{
					eval("aLineClick"+IdNumber+" = 0");			
				}

				var cGotoline = eval("cGotoline"+IdNumber);

				if (typeof(cGotoline) == "object")
					cGotoline = cGotoline[0];

				walkthrough_view.showClipwithBackground(idWalkthrough,cGotoline);

				$(idWalkthrough+" .instructions1").html("");

				$("#walkthrough"+IdNumber+" .span"+eval("cGotoline"+IdNumber)).children("img:nth-child(3)").css("visibility","visible");

				horstmann_walkthrough.setTimeoutInstance = setTimeout(function(){
					walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
					walkthrough_controller.bindWalkthroughLogic(IdNumber);
				},1500);
				
				$("#walkthrough"+IdNumber+" .preTag .mainSpan").off("click");
				$("#walkthrough"+IdNumber+" .preTag .mainSpan").css("cursor","default");

			}else{
				
				//Draw line-through in above row when value is entered in below row 
				var linethroughRow = parseInt(inputObject.split("_")[0]) - 1;
				var linethroughcolumn = parseInt(inputObject.split("_")[1]);	
				
				var heading = $(idWalkthrough+" th:nth-child("+linethroughcolumn+")").text().toLowerCase();
				
				for(var i=linethroughRow;i>0;i--)
				{						
					if($(idWalkthrough+" td."+i+"_"+linethroughcolumn).html() != "X" && heading != "output"){
						
						$(idWalkthrough+" td."+i+"_"+linethroughcolumn).css("text-decoration","line-through");
					}
				}

				if (typeof eval("cAnswer"+IdNumber) == "object"){
					$(idWalkthrough +" ."+inputObject).html(eval("cAnswer"+IdNumber)[0]).css("background","#E9EDF7");
				}else{
					$(idWalkthrough +" ."+inputObject).html(eval("cAnswer"+IdNumber)).css("background","#E9EDF7");	
				}
				
				walkthrough_controller.traverseWalkthrough(eval("walkthroughCount"+IdNumber),IdNumber);
				walkthrough_controller.bindWalkthroughLogic(IdNumber);	
			}
			//hide next button and also increase the score
			$(idWalkthrough+" .seeNextStep").css("display","none");
		});
	}
	
}

/************************************* walkthrough_preParser Class Start **********************************/

var walkthrough_preParser = {
			
	Parser:function(i){	

		var preLines = $("#walkthrough"+i+" .preTag pre").html().split("\n");
		
		for(var j=0;j<preLines.length;j++){
			var obj = $("#walkthrough"+i+" .preTag")[0]
			var sp = document.createElement('span')
			var textNode = document.createTextNode(preLines[j])
			$(sp).addClass("mainSpan");
			$(sp).append(preLines[j]);
			obj.appendChild(sp);
		}
		$("#walkthrough"+i+" .preTag pre").remove();
	}

}




/************** Logger ***************************/
var Logger = {
	debug:false, // false this variable to stop console log
	log:function(sLog,debug){
		if(debug)
		{
			console.log(sLog);
		}
	}
}
