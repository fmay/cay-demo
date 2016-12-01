(function(app){
	app.gridX; // set to width, height of hc-grid style
	app.gridY;
	app.animationSpeed = 2000;
	app.autoStepAnimationSpeed = 1000;
	app.getDataObject; // get data object to implement in Timer
})(Const=Const||{})

var Const;


var timer = function()
{
	var bStop = false;
	var nCurrentPassedSec = 0;
	var bPassTen = false;
	var bPassFifteen = false;
	var obs
	var steTimeoutInter

	function init()
	{
		obs = new Events();
	}

	function start()
	{
//		//console.log("start timer...")
		bStop = false;
		bPassTen = false;
		clearTimeout(steTimeoutInter);
		steTimeoutInter = setTimeout(incriment,1000);
	}

	function incriment() 
	{
		nCurrentPassedSec++;
		//console.log("incriment> "+nCurrentPassedSec)
		if(!bStop)
		{
			if(nCurrentPassedSec>=10 && !bPassTen)
			{
				bPassTen = true;
				obs.dispatchEvent('TenSec', {'nCurrentPassedSec':nCurrentPassedSec});	
			}
			if(nCurrentPassedSec>=14 && !bPassFifteen)
			{
				bPassFifteen = true;
				obs.dispatchEvent('FifteenSec', {'nCurrentPassedSec':nCurrentPassedSec});	
			}
			if(nCurrentPassedSec>=30 && bPassTen  && bPassFifteen)
			{
				bStop = true;
				bPassTen = true;
				obs.dispatchEvent('SubmitAnswer', {'nCurrentPassedSec':nCurrentPassedSec});	
			}
			clearTimeout(steTimeoutInter)			
			steTimeoutInter = setTimeout(incriment,1000);
		}
	}

	init();
	
	return{

		reset:function()
		{
			clearTimeout(steTimeoutInter);
			nCurrentPassedSec = 0;
			bPassTen = false;
			bPassFifteen = false;
		},
		start:function()
		{
			start()
		},
		stop:function()
		{
			clearTimeout(steTimeoutInter);
			bStop = true;
		},
		Evts:obs
	}
}


var Question = function(data,DVHolder,id)
{
	var stepNumbers = ["➊","➋","➌","➍","➎","➏","➐","➑","➒","➓","⓫","⓬","⓭","⓮","⓯","⓰","⓱","⓲","⓳","⓴"];
	var stepCtr = -1;
	var variables = (data.variables == undefined)?[]:data.variables;
	var objects = (data.objects == undefined)?[]:data.objects;
	var instructions = data.instructions;
	var holder = DVHolder
	var htmlData = "";
	var aVariables = new Array();
	var aObjects = new Array();
	var canvas;
	var stage;
	var num = id;
	var currentShape,oldX,oldY,newX,newY;
	var indCount = 0;
	var errorCount = 0;
	var timerCount = 0;
	var vRemoveCount = 0;
	var vRemCounter = 0; 
	var aRemovedObjectId = new Array();
	var dragItemID = "";
	var maxHeight;
	var autoPlayTimeout;
	var bottomMargin = 90;
	var vInvalidAttemptCounter = 0;
	var startConDiv = null;
	var endConDiv = null;
	var stepsRemovalCtr = 0;
	var timerObj;
	var timerObjTimeUp = false;
	var redCheck = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII='/>";
	var tempRemovedObjects = null;
	var lastStepReset = false;
	var addedElements = new Array();
	var lastFieldUpdated=null;
	var valueupdated = false;
	var activityAutoplay = false;
	var isEventsAdded = false;
	var initDivCon = null;
	var initDivParentContainer = null;
	var endDivCon = null;
	var arrowHead;
	var scribArrowDirection;
	var scribTarget = null;
	var scribTargetOffsetX; 
	var scribTargetOffsetY;
	var scribActive = false;
	//
	function fnErrorCount(err) {
		var cor = ($(holder)[0].correct == undefined)?0:$(holder)[0].correct;
		var err = ($(holder)[0].errors == undefined)?0:$(holder)[0].errors;

		return gt.strargs(
		gt.ngettext('One correct', '%1 correct', cor),
		cor) + ', ' + gt.strargs(
		gt.ngettext('One error', '%1 errors', err),
		err)
	}

	function initialize()
	{
		//--Get variable font width on startup and update Conts values---
		//$("#fontTest").html("0");
		Const.gridX = $("#fontTest").width();
		Const.gridY = $("#fontTest").height();
		
		//$("#fontTest").html("");
		
		//---End
		// create required div in the Holder
		$(holder).append('<div id="instructionsOd'+num+'" class="instructions hc-instructions hc-step"></div>')
		
		$("#instructionsOd"+num).append('<div id="goal_desc'+num+'" class="instructions1 hc-message"><span id="circledNum'+num+'" class="hc-circled-number instNumber"></span><div id="msg">'+gt.gettext("Press start to begin.")+'</div></div>');
		
		htmlData = jQuery('<div/>', {
			class: "drawing_area hc-code",
			id:'drawing'+num,
		});

		$("#instructionsOd"+num).append(
			'<span class="hc-button hc-start" id="startbtnOd'+num+'">'+gt.gettext("start_button")+'</span>'+
			'<div id="instMsgOd'+num+'" class="instructionMsg hc-message"><span id="msg"></span></div>'+
			'<div id="warnMsgOd'+num+'" class="warningMsg hc-message hc-retry"></div>'+
			'<span id="next'+num+'" class="hc-button hc-step btnNext">Next</span>'+
			'<span id="nextStepOd'+num+'" class="hc-button hc-retry seeNextStep">'+gt.gettext("next_step_button")+'</span>'+
			'<div id="goodJobOd'+num+'" class="goodjob"><img width="25" height="25" style="vertical-align:middle;position:absolute;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzMjRCMEREODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzMjRCMERFODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMyNEIwREI4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTMyNEIwREM4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5fkXkUAAAA+UlEQVR42mJM3ujOQA3ARKY+fiDOAeIVQCwKEmAhwxBdIN4CxHJAfBCIv5PjInsgPgw1pA+InYH4C6kuUoe6hAeIpwBxMTlhxAnEq6GGXEA3hBSDuqBhA/JGBBD/IscgGyDOhLKzgPgmOdHPBsRzgJgZiBdDMcF0xIxFvggayE+BuICYBAlKYA+B+DMQq0DFpIG4GslL74gxyBKqERQr85ECGMRfCcSbiM0iB6HOhwXuZCCOgsZSMSl5DZTMm5DEc6B0K5IFRGfauUB8B4l/B5oNSM79f6ExA6IfAXEQtoSHC6Dnta1ALA/EL6AGMpBrEAOxYYIOAAIMAHdiLpAopYgmAAAAAElFTkSuQmCC" /><span class="gJobText hc-message hc-good">'+gt.gettext("Good job")+'</span></div>'
		);
		// Add css to requied div
		$(".horstmann_objectdiagram > div:first-child").addClass("overall_description font-monospace");
		for (var i=0;i<instructions.length;i++)
		{
			if (typeof(instructions[i].value) == "boolean")
			{
				instructions[i].value = (instructions[i].value)?"true":"false";
		
			}

			
		}
		// construct variables
		constructVariables();
		
		// construct objects
		constructObjects();

		//add button
		addButtons();
		
		getMaxHeight();


		htmlData.css('height',maxHeight+'px') // Assigning dynamic height to drawing div
		
		$('#circledNum'+num).hide();

		setTimeout(function(){
			$('#TrashMaster'+num).css("top",(maxHeight-52)+'px')

			$('.'+num).attr('readonly',true);

		},100);


		
		setTimeout(function(){
			initializeVitalsourceData();
		},200);
		
	}

	function initializeVitalsourceData()
	{
		var maxScoreCount = 0;
		for (i=0;i<instructions.length;i++)
		{
			if (instructions[i].interactive !== false && instructions[i].interactive !== "false" && instructions[i].add === undefined)
				++maxScoreCount;
		}

		$(holder)[0].maxscore = maxScoreCount;
		$(holder)[0].correct = 0;
		$(holder)[0].errors = 0;
	}

	function updateInitialDisplay()
	{
		for (var i = 0; i < aVariables.length; i++) 
		{
			aVariables[i].populateInitialData();
		}

		for (var i = 0; i < aObjects.length; i++) 
		{
			aObjects[i].populateInitialData();
		}
	}

	function handleVariableDrawArrow(observable, eventType, data)
	{
		var initObj;
		for (var i = 0; i < aVariables.length; i++) 
		{
			if (data.initialObj == aVariables[i].getObj()){
				initObj = aVariables[i];
				
			}
		}
		
		var lblStr = num+'_'+data.targetObj[2].replace(/[\])}[{(]/g,'') + "_"  + data.targetObj[0] + "_" + data.targetObj[1];
		var targetLable = lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")

		var endObj
		for (var i = 0; i < aObjects.length; i++) 
		{
			if (targetLable == aObjects[i].getID()){
				endObj = aObjects[i];
				
			}
		}
		
		currentShape = new createjs.Shape();
		stage.addChild(currentShape);
		currentShape.graphics.setStrokeStyle(2, 'round', 'round');
		var color = createjs.Graphics.getRGB(0,0,0);
		currentShape.graphics.beginStroke(color);

		arrowHead = new createjs.Shape();
		stage.addChild(arrowHead);
		arrowHead.graphics.beginStroke("black").beginFill("#000");


		direction = createPath(currentShape, arrowHead, initObj, endObj);
		initObj.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":direction,"initObj":initObj, "endObj":endObj});
		endObj.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":direction,"initObj":initObj, "endObj":endObj});
	}

	function handleObjectDrawArrow(observable, eventType, data)
	{
		var initObj = data.initialObj

		var lblStr = num+'_'+data.targetObj[2].replace(/[\])}[{(]/g,'') + "_"  +data.targetObj[0] + "_" + data.targetObj[1];
		var targetLable = lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
		
		var endObj
		for (var i = 0; i < aObjects.length; i++) 
		{
			if (targetLable == aObjects[i].getID()){
				endObj = aObjects[i];
				
			}
		}
	
		currentShape = new createjs.Shape();
		stage.addChild(currentShape);
		currentShape.graphics.setStrokeStyle(2, 'round', 'round');
		var color = createjs.Graphics.getRGB(0,0,0);
		currentShape.graphics.beginStroke(color);

		arrowHead = new createjs.Shape();
		stage.addChild(arrowHead);
		arrowHead.graphics.beginStroke("black").beginFill("#000");

		direction = createPath(currentShape, arrowHead, initObj, endObj);

		initObj.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":direction,"initObj":initObj, "endObj":endObj});
		endObj.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":direction,"initObj":initObj, "endObj":endObj});
	}

	function startActivity()
	{
		$('#circledNum'+num).show();
		var date = new Date();
		timerCount = date.getTime();
		$('.'+num).attr('readonly', true);
		timerObj = new timer();
		timerObj.Evts.addEventListener("TenSec",onTenSecTimerUpdate);
		timerObj.Evts.addEventListener("FifteenSec",onFifteenSecTimerUpdate);

		timerObj.Evts.addEventListener("SubmitAnswer",onSubmitAnswerTimerUpdate);

		addItemsListeners();
				
		//$('#DVcanvasWrapper'+num).mousedown(function(e) {alert("start scrib...");startScrib(e);});
		//isCanvasVisible = 
		if (!scribActive)
		{
			scribActive = true;
			$('#DVcanvasWrapper'+num).unbind('mousedown touchstart').bind("mousedown touchstart",function(e) {
				e.preventDefault();
				startScrib(e);

			});
		}
		//stage.onMouseDown = startScrib;
		executeSteps();
		
	}

	function activateElemetsClick()
	{
		//if (!isIE())
			//return false;
		scribActive = false;
		$('#DVcanvasWrapper'+num).unbind('mousedown touchstart').bind('mousedown touchstart', function (e) {
			e.preventDefault();
			$(this).hide();
			var BottomElement = document.elementFromPoint(e.clientX, e.clientY);
			$(this).show();

			if(BottomElement.tagName == "input")
				$(BottomElement).focus();
			else
				$(BottomElement).trigger(e.type);
		});
	}


	function activateScrib()
	{
		
		//if (!isIE())
			//return false;
		if (!scribActive)
		{
			scribActive = true;
			$('#DVcanvasWrapper'+num).unbind('mousedown touchstart').bind("mousedown touchstart",function(e) {
				e.preventDefault();
				startScrib(e);
			});
		}
	}
	
	function activateRemove()
	{
		//if (!isIE())
			//return false;
		$('body').css({
				"-webkit-user-select": "none", 
				"-moz-user-select": "none", 
				"-ms-user-select": "none", 
				"-o-user-select": "none", 
				"user-select": "none"
			});
		scribActive = false;
		$('#DVcanvasWrapper'+num).unbind('mousedown touchstart').bind('mousedown touchstart', function (e) {
			e.preventDefault();
			$(this).hide();
			var BottomElement = $(document.elementFromPoint(e.clientX, e.clientY));
			$(this).show();
			

			if(BottomElement.attr("type") == "VariableObject"){
				if(BottomElement.parent().attr("type") == "CollectionObject"){
					BottomElement = BottomElement.parent();
				}
			}else if (BottomElement.attr("type") == "CollectionObject"){
			}else if(BottomElement.parent().attr("type") == "VariableObject"){
				if(BottomElement.parent().parent().attr("type") == "CollectionObject"){
					BottomElement = BottomElement.parent().parent();
				}else{
					BottomElement = BottomElement.parent();
				}
			}else if (BottomElement.parent().attr("type") == "CollectionObject"){
				BottomElement = BottomElement.parent();
			}else if(BottomElement.parent().parent().attr("type") == "VariableObject"){
				if(BottomElement.parent().parent().parent().attr("type") == "CollectionObject"){
					BottomElement = BottomElement.parent().parent().parent();
				}else{
					BottomElement = BottomElement.parent().parent();
				}
			}else if (BottomElement.parent().parent().attr("type") == "CollectionObject"){
				BottomElement = BottomElement.parent().parent();
			}else{
				return false;
			}

			BottomElement.css("z-index","1000");

			var coords = {
				clientX: e.clientX,
				clientY: e.clientY
			};

			// this actually triggers the drag start event
			BottomElement.simulate("mousedown", coords);
			
			$("body").bind('mouseup touchend', function (e) {
				BottomElement.css("z-index",auto);
				$("body").unbind('mouseup touchend');
			});
		});
	}

	function disableActivity()
	{
		stage.onMouseDown = null;
		scribActive = false;
		$('#DVcanvasWrapper'+num).unbind("mousedown touchstart");
	}
	
	// Method for find max height
	function getMaxHeight()
	{
		maxHeight = 0;
		// To find max variable object height
		for(var i=0;i<aVariables.length;i++)
		{
			if((aVariables[i].getTopPos() + aVariables[i].getHeight() + bottomMargin) > maxHeight)
			{
				maxHeight = aVariables[i].getTopPos() + aVariables[i].getHeight() + bottomMargin;
			}
		}
		
		// To find max Collection Object height
		for(var i=0;i<aObjects.length;i++)
		{
	
			if((aObjects[i].getTopPos()+aObjects[i].getHeight()+bottomMargin)>maxHeight)
			{
				maxHeight = aObjects[i].getTopPos() + aObjects[i].getHeight()+bottomMargin;
				
			}
		}
	}
	
	// Construct Variables Method
	function constructVariables()
	{			
		for (var i = 0; i < variables.length; i++) {
			var objVariables = new VariableObject(variables[i],num,undefined,0)
			objVariables.Evts.addEventListener(objVariables.CHANGED,handleVariableChanged);
			objVariables.Evts.addEventListener(objVariables.DRAW_ARROW,handleVariableDrawArrow);
			aVariables.push(objVariables);
			var varObj = aVariables[i].getObj();
			$(varObj).addClass("cVariable");
			htmlData.append(varObj);
		}
	}
	
	// Construct Objects Method
	function constructObjects()
	{			
		for (var i = 0; i < objects.length; i++) {
			var cObjects = new CollectionObject(objects[i], num);
			cObjects.Evts.addEventListener(cObjects.DRAW_ARROW,handleObjectDrawArrow);
			aObjects.push(cObjects);
			var Obj = aObjects[i].getObj();
			htmlData.append(Obj);
		}
	}

	function addItemsListeners()
	{		
		if (!isEventsAdded){
			for (var i = 0; i < aVariables.length; i++) {
				aVariables[i].Evts.addEventListener(aVariables[i].CHANGED,handleVariableChanged);
				aVariables[i].Evts.addEventListener(aVariables[i].UPDATED,handleValueUpdated);
				aVariables[i].Evts.addEventListener(aVariables[i].FOCUSED,handleObjectFocus);
			}
			
			for (var i = 0; i < aObjects.length; i++) {
				aObjects[i].Evts.addEventListener(aObjects[i].CHANGED,handleCollectionObjectChanged);
				aObjects[i].Evts.addEventListener(aObjects[i].UPDATED,handleValueUpdated);
				aObjects[i].Evts.addEventListener(aObjects[i].FOCUSED,handleObjectFocus);
			}
			isEventsAdded = true;

			
		}
		
	}
	function startTimerObj()
	{
		timerObj.reset();
		timerObj.start();
	}
	
	function onTenSecTimerUpdate(e)
	{
		var varRemove = instructions[indCount].remove;

		if (varRemove != undefined)
		{
			$('#warnMsgOd'+num).html(gt.gettext("more_trash_inst"));
		}else{
			$('#warnMsgOd'+num).html(gt.gettext("enter_press_inst"));
		}
		$('#warnMsgOd'+num).show();
	}

	function onFifteenSecTimerUpdate(e)
	{

//console.log("onFifteenSecTimerUpdate")
		// var varRemove = instructions[indCount].remove;
		// if (varRemove != undefined)
		// {
		// }else{
		// }
		$('#warnMsgOd'+num).html("");
		$('#warnMsgOd'+num).hide();
	}

	function onSubmitAnswerTimerUpdate(e)
	{	

		try{
				var varRemove = instructions[indCount].remove;

				if (varRemove != undefined)
				{
					$('#nextStepOd'+num).show();
					$('#nextStepOd'+num).unbind("click").click(function(){
						stopTimer();
						vInvalidAttemptCounter = 0;
						performRemoveStep();
					});
				}else{
					validateUserInputs(Const.getDataObject);					
					$('#nextStepOd'+num).unbind("click").click(function(){
						vInvalidAttemptCounter = 0;	// reset invalid attempt counter    
						var varStep = instructions[indCount];
						var cObj = getStepObj(varStep.set);
						displayCorrectAnswer(null,varStep,cObj);
						indCount++;
						executeSteps(); // Go to next step
						$(this).hide();
					});
				}
		}catch(e){

		}


	}
	function performRemoveStep()
	{
		$('#nextStepOd'+num).hide();
		var vObj;

		if (typeof(instructions[indCount].remove[0]) == 'object'){
			for(var k=0; k < instructions[indCount].remove.length; k++)
			{
				var remVar = instructions[indCount].remove[k];
				
				varObj = getStepObj(remVar);
				if($(varObj.getObj()).css("display") != "none"){
					vObj = varObj;
					break;
				}
			}
		}else{
			var remVar = instructions[indCount].remove;
			varObj = getStepObj(remVar);
			vRemoveCount=1;			
			if($(varObj.getObj()).css("display") != "none"){
				vObj = varObj;
				
			}
		}
		if (startConDiv != null){
			startConDiv.hideIncorrectMark();
			startConDiv = null;
		}
		$(vObj.getObj()).css("z-index","1000");		
		$(vObj.getObj()).animate({
			left: $('#TrashMaster'+num).position().left - ($(vObj.getObj()).width()/2),
			top: $('#TrashMaster'+num).position().top,// + ($(vObj.getObj()).height()/2),
		}, Const.animationSpeed, function() {
			var aConnectedObjects = vObj.getConnectionObj("all");
			
			if (aConnectedObjects.length>0){
				for (i=0;i<aConnectedObjects.length;i++)
				{
					aConnectedObjects[i].initObj.removeConnectionObj(aConnectedObjects[i]);
					aConnectedObjects[i].endObj.removeConnectionObj(aConnectedObjects[i]);
					stage.removeChild(aConnectedObjects[i].shape)
					stage.removeChild(aConnectedObjects[i].arrow)
					stage.update();
				}
			}
			$(vObj.getObj()).css("z-index","auto");
			$(vObj.getObj()).hide();
			$('#nextStepOd'+num).hide();
			$('#warnMsgOd'+num).hide();
			// To check wether removable vObjects are finished
			vRemCounter++; // Increment counter on delete vObject
			if(vRemoveCount == vRemCounter){  
				indCount++;
				executeSteps();
			}else{
				autoPlayTimeout = setTimeout(performRemoveStep,Const.autoStepAnimationSpeed);
			}
		});
	}
	function stopTimer()
	{
		timerObj.reset();
		timerObj.stop();
		timerObjTimeUp = false;
	}

	function removeItemsListeners()
	{
		if (isEventsAdded){
			for (var i = 0; i < aVariables.length; i++) {

				aVariables[i].Evts.removeEventListener(aVariables[i].CHANGED,handleVariableChanged);
				aVariables[i].Evts.removeEventListener(aVariables[i].UPDATED,handleValueUpdated);
				aVariables[i].Evts.removeEventListener(aVariables[i].FOCUSED,handleObjectFocus);
			}
			
			for (var i = 0; i < aObjects.length; i++) {
				aObjects[i].Evts.removeEventListener(aObjects[i].CHANGED,handleCollectionObjectChanged);
				aObjects[i].Evts.removeEventListener(aObjects[i].UPDATED,handleValueUpdated);
				aObjects[i].Evts.removeEventListener(aObjects[i].FOCUSED,handleObjectFocus);
			}
			isEventsAdded = false;
			stopTimer();
		}
	}

	function addButtons()
	{
		htmlData.append('<div id="TrashMaster'+num+'" class="trashMaster"></div>');	
		htmlData.append('<div id="PopUpDiv'+num+'" class="popUpDiv"></div>');
	}

	function handleVariableChanged(observable, eventType, data)
	{
//		console.log("handleVariableChanged");
		if (activityAutoplay)
			return false;

		if (timerObjTimeUp)
		{
			timerObjTimeUp = false;
			return false;

		}

		var varStep = instructions[indCount];

		var vObj = findObj(varStep);
		
		if (varStep != undefined && typeof(varStep.value) != "object" && vObj != null)
		{
			if ((varStep.value == data.data) && (varStep.interactive == undefined || varStep.interactive == false || varStep.interactive == "false") && vObj.getObj() == data.obj)
				valueupdated = true
			validateUserInputs(data);
		}
	}

	function handleCollectionObjectChanged(observable, eventType, data)
	{
//		console.log("handleCollectionObjectChanged")
		if (activityAutoplay)
			return false;

		if (timerObjTimeUp)
		{
			timerObjTimeUp = false;
			return false;

		}

		var varStep = instructions[indCount];

		if (varStep.set != undefined)
		{
			var cObj = getStepObj(varStep.set);
			
			if ((varStep.value == data.data) && (varStep.interactive == undefined || varStep.interactive == false || varStep.interactive == "false") && cObj.getObj() == data.obj)
			valueupdated = true

			validateUserInputs(data);
		}
	}

	function handleObjectFocus(observable, eventType, data)
	{
		
		if (activityAutoplay)
			return false;
		//lastFieldUpdated = null;
		resetLastStepDisplay(data.obj);

		var varStep = instructions[indCount];

		if (varStep.set != undefined)
		{
			var cObj = getStepObj(varStep.set);
		}
		for(var k=0;k<aVariables.length;k++)
		{
			if (aVariables[k] == cObj){
			}else{
				aVariables[k].setValue(aVariables[k].getObjDataValue());
				if (lastFieldUpdated != aVariables[k].getObj()){
					aVariables[k].hideIncorrectMark();
					aVariables[k].getObj().find("input").removeClass("hc-example-correct");
				}
			}
			if (lastFieldUpdated != aVariables[k].getObj())
			{
				aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
				aVariables[k].hideIncorrectMark();
			}
		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
			if (arrVariablesObj.length > 0)
			{
				for(var v=0;v<arrVariablesObj.length;v++)
				{
					if (arrVariablesObj[v] == cObj){
					}else{
						arrVariablesObj[v].setValue(arrVariablesObj[v].getObjDataValue());
						if (lastFieldUpdated != arrVariablesObj[v].getObj()){
							arrVariablesObj[v].hideIncorrectMark();
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct");
						}
						
					}
					if (lastFieldUpdated != arrVariablesObj[v].getObj())
					{
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect");
						arrVariablesObj[v].hideIncorrectMark();
					}
				}
			}
		}
		//lastFieldUpdated = null;
	}
	
	function handleValueUpdated(observable, eventType, data)
	{

//		console.log("handleValueUpdated")
		for(var k=0;k<aVariables.length;k++)
		{
			aVariables[k].getObj().find("input").removeClass("hc-example-correct").removeClass("hc-example-incorrect");

		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
			if (arrVariablesObj.length > 0)
			{
				for(var v=0;v<arrVariablesObj.length;v++)
				{
					arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct").removeClass("hc-example-incorrect");

				}
			}
		}

		startTimerObj();
		valueupdated = true;
		Const.getDataObject = data;
//		console.log("handleValueUpdated >>> DATA:::",data);
		

	}

	function validateUserInputs(data)
	{
		
//		console.log("validateUserInputs = ",data)
		lastFieldUpdated = data.obj;
		if(!valueupdated || data.data == '')
			return false;

		//--Stop timer before check; Will initialize again if value of field is updated.
		timerObj.stop();
		//
		valueupdated = false;

		var varStep = instructions[indCount];
		
		if (varStep.set != undefined)
		{
			var cObj = getStepObj(varStep.set);
		}
		var skipCheck = false;
		isAllCorrect = true;
		for(var k=0;k<aVariables.length;k++)
		{
			if (aVariables[k] == cObj){
				
				if (varStep.value == aVariables[k].getValue() && aVariables[k].getValue() != "")
				{
					aVariables[k].setObjDataValue(varStep.value);
					aVariables[k].hideIncorrectMark();
					aVariables[k].getObj().find("input").removeClass("hc-example-incorrect").addClass("hc-example-correct");

					removeLinkage(aVariables[k]);

				}else if (aVariables[k].getValue() == aVariables[k].getObjDataValue()){
					skipCheck = true;
				}else{
					isAllCorrect = false;
					if (data.obj == cObj.getObj())
					{

						aVariables[k].getObj().find("input").removeClass("hc-example-correct").addClass("hc-example-incorrect"); // Change input background to red
						aVariables[k].showIncorrectMark();
					}
					
				}
				//else if (aVariables[k].getConnectionObj('all').length != 0){
				//}

			}else if (aVariables[k].getObjDataValue() == aVariables[k].getObj().find("input").val()){
				aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
				aVariables[k].hideIncorrectMark();
			}else if (aVariables[k].getObj().find("input").val() == ""){
				aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
				aVariables[k].hideIncorrectMark();
			}else{

				isAllCorrect = false;
				aVariables[k].getObj().find("input").removeClass("hc-example-correct").addClass("hc-example-incorrect"); // Change input background to red
				aVariables[k].showIncorrectMark();
			}
		}

		for(var k=0;k<aObjects.length;k++)
		{
			var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
			if (arrVariablesObj.length > 0)
			{
				for(var v=0;v<arrVariablesObj.length;v++)
				{

					if (arrVariablesObj[v] == cObj){

						if (varStep.value == arrVariablesObj[v].getValue() && arrVariablesObj[v].getValue() != "")
						{
							arrVariablesObj[v].setObjDataValue(varStep.value);
							arrVariablesObj[v].hideIncorrectMark();
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect").addClass("hc-example-correct");
							removeLinkage(arrVariablesObj[v]);
						}else if (arrVariablesObj[v].getValue() == arrVariablesObj[v].getObjDataValue()){
							skipCheck = true;
						}else{

							isAllCorrect = false;
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct").addClass("hc-example-incorrect"); // Change input background to red
							
							arrVariablesObj[v].showIncorrectMark();
							
						}
						//else if (arrVariablesObj[v].getConnectionObj('all').length != 0){
						//}
					}else if (arrVariablesObj[v].getObjDataValue() == arrVariablesObj[v].getObj().find("input").val()){
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect")
						arrVariablesObj[v].hideIncorrectMark();
					}else if (arrVariablesObj[v].getObj().find("input").val() == ""){
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect");//.addClass("hc-example-correct");
						arrVariablesObj[v].hideIncorrectMark();
					}else{
						
						isAllCorrect = false;
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct").addClass("hc-example-incorrect"); // Change input background to red
						arrVariablesObj[v].showIncorrectMark();
						
					}
				}
			}
		}
		
		if (skipCheck && isAllCorrect)
			return false;

		if (isAllCorrect){


			$(holder)[0].correct++;
			$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount());
			disableAllFields();
			vInvalidAttemptCounter = 0; // reset invalid attempt counter 		
			indCount++;    // increament index counter 
			executeSteps();  // go to next step
		}else{

			$(holder)[0].errors++;
			++errorCount;
			$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount());
			
			if(vInvalidAttemptCounter == 1) // Check two invalid attempts
			{ 
				//console.log("vInvalidAttemptCounter == 1")
				$('#nextStepOd'+num).show();
				$('#warnMsgOd'+num).html(gt.gettext("try_again_or_msg"));
				$('#warnMsgOd'+num).show();
				
				// On click of nextStepOd execute current step and go to next step
				$('#nextStepOd'+num).unbind("click").click(function(){
					vInvalidAttemptCounter = 0;	// reset invalid attempt counter    
					displayCorrectAnswer(data,varStep,cObj);
					indCount++;					
					executeSteps(); // Go to next step
					$(this).hide();
				});
				stopTimer();
			
			}else
			{
//				console.log("vInvalidAttemptCounter++;")
				vInvalidAttemptCounter++;
				stopTimer();
				$('#warnMsgOd'+num).html(gt.gettext("try_again_msg"));
				$('#warnMsgOd'+num).show();
			}
		}
	}

	function removeLinkage(vObj)
	{
		var aConnectedObjects = vObj.getConnectionObj("all");
					

		if (aConnectedObjects.length>0)
		{
			for (i=0;i<aConnectedObjects.length;i++)
			{
				aConnectedObjects[i].initObj.removeConnectionObj(aConnectedObjects[i]);
				aConnectedObjects[i].endObj.removeConnectionObj(aConnectedObjects[i]);
				stage.removeChild(aConnectedObjects[i].shape)
				stage.removeChild(aConnectedObjects[i].arrow)
				stage.update();
			}
		}
	}

	function displayCorrectAnswer(data,varStep,cObj)
	{
//		console.log("displayCorrectAnswer")
		for(var k=0;k<aVariables.length;k++)
		{
			if (aVariables[k] == cObj){
				aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
				aVariables[k].hideIncorrectMark();
				aVariables[k].getObj().find("input").val(varStep.value);
				aVariables[k].setObjDataValue(varStep.value);
				//
				removeLinkage(aVariables[k]);
//else if (aVariables[k].getConnectionObj('all').length != 0){
//}
			}else if (aVariables[k].getObjDataValue() != aVariables[k].getObj().find("input").val()){
				aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
				aVariables[k].hideIncorrectMark();
				aVariables[k].getObj().find("input").val(aVariables[k].getObjDataValue());
				aVariables[k].setObjDataValue(aVariables[k].getObjDataValue());
				//
				removeLinkage(aVariables[k]);
			}
		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
			if (arrVariablesObj.length > 0)
			{
				for(var v=0;v<arrVariablesObj.length;v++)
				{
					if (arrVariablesObj[v] == cObj){
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect");
						arrVariablesObj[v].hideIncorrectMark();
						arrVariablesObj[v].getObj().find("input").val(varStep.value);
						arrVariablesObj[v].setObjDataValue(varStep.value);
						//else if (arrVariablesObj[v].getConnectionObj('all').length != 0){
						//}
						removeLinkage(arrVariablesObj[v]);
					}else if (arrVariablesObj[v].getObjDataValue() != arrVariablesObj[v].getObj().find("input").val()){
						arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect");
						arrVariablesObj[v].hideIncorrectMark();
						arrVariablesObj[v].getObj().find("input").val(arrVariablesObj[v].getObjDataValue());
						arrVariablesObj[v].setObjDataValue(arrVariablesObj[v].getObjDataValue());
						removeLinkage(arrVariablesObj[v]);
					}
				}
			}
		}
		disableAllFields();
	}

	function resetLastStepDisplay(currentField)
	{
		
		if (lastStepReset)
			return false;

		//$('#warnMsgOd'+num).hide();
		//$('#nextStepOd'+num).hide();
		//lastStepReset = true;

		var varStep = instructions[indCount];
		
		if (varStep.set != undefined)
		{
			var cObj = getStepObj(varStep.set);
		}


		for(var k=0;k<aVariables.length;k++)
		{
			if (aVariables[k] != cObj){
				if (lastFieldUpdated != aVariables[k].getObj())
				{
					
					aVariables[k].hideIncorrectMark();
					aVariables[k].getObj().find("input").removeClass("hc-example-incorrect");
					aVariables[k].getObj().find("input").removeClass("hc-example-correct");

				}//
			}else if (aVariables[k] == cObj && lastFieldUpdated == aVariables[k].getObj()){
				
					//aVariables[k].hideIncorrectMark();
				aVariables[k].getObj().find("input").removeClass("hc-example-correct");
			}
		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
			if (arrVariablesObj.length > 0)
			{
				for(var v=0;v<arrVariablesObj.length;v++)
				{
					if (arrVariablesObj[v] != cObj){
						if (lastFieldUpdated != arrVariablesObj[v].getObj())
						{
							
							arrVariablesObj[v].hideIncorrectMark();
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-incorrect");
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct");
						}//
					}else if (arrVariablesObj[v] == cObj){
						if (currentField == lastFieldUpdated){
							arrVariablesObj[v].getObj().find("input").removeClass("hc-example-correct");
						}

					}
				}
			}
		}
		//lastFieldUpdated = null;
	}

	function disableAllFields()
	{
		$('.'+num).attr('readonly',true);
	}

	// to find drwaing area height
	function getDrawingAreaHeight()
	{
		return Number($('#drawing'+num).height()) + 10;
	}

	//To find drawing area width
	function getDrawingAreaWidth()
	{
		return Number($('#drawing'+num).width()) + 5;
	}

	// To create canvas element
	//var hiddenDivsArr = new Array();
	function constructCanvas()
	{	
		/*
		if (hiddenDivsArr.length == 0)
		{
			var chkDiv = $('#drawing'+num);

			while ($(chkDiv)[0].nodeName != "html")
			{

				if (chkDiv.css("display") == "none")
				{
					hiddenDivsArr.push(chkDiv);
				}
				chkDiv = $(chkDiv).parent();
			}
		}
//		console.log("Hidden divs::: ",hiddenDivsArr)
		for (i=0;i<hiddenDivsArr.length;i++)
		{
			hidDiv = hiddenDivsArr[i];
			$(hidDiv).css("display","block");
			$(hidDiv).css("visibility","hidden");
		}
		//
		*/

		$('#drawing'+num).append('<div id="DVcanvasWrapper'+num+'"><canvas style="background-color: transparent;" id="canvas'+num+'" height="'+getDrawingAreaHeight()+'" width="'+getDrawingAreaWidth()+'"></canvas></div>');	

		/*for (i=0;i<hiddenDivsArr.length;i++)
		{
			hidDiv = hiddenDivsArr[i];
			$(hidDiv).css("visibility","visible");
			$(hidDiv).css("display","none");
		}*/
		canvas = document.getElementById("canvas"+num);
		stage = new createjs.Stage(canvas);
		stage.update();
		if (!isIE11()){
			createjs.Touch.enable(stage);
		}
		createjs.Ticker.setFPS(24);
		createjs.Ticker.addEventListener('tick',handleTick);
		
		$('#DVcanvasWrapper'+num).addClass("canvasWrapper");

		activateElemetsClick();
	}
	
	function handleTick(e)
	{
		stage.update();
	}

	function drawArrowHead(obj,x,y,isRightArrow){
		if (isRightArrow)
			obj.graphics.moveTo(x, y).lineTo(x, y+10).lineTo(x+10,y+5).lineTo(x, y);
		else
			obj.graphics.moveTo(x, y).lineTo(x, y+10).lineTo(x-10,y+5).lineTo(x, y);
	}

	function startScrib(e)
	{
		resetFieldsHighlight();
		if (e.touches != undefined)
		{
			if (e.pageX == undefined || e.pageY == undefined)
				e = e.touches[0];
		}

		if (e.originalEvent.touches != undefined)
		{
			if (e.pageX == undefined || e.pageY == undefined)
				e = e.originalEvent.touches[0];
		}

		if (e.pageX == undefined || e.pageY == undefined)
			e = e.originalEvent;
		
		

		scribTargetOffsetX = $('#DVcanvasWrapper'+num).offset().left;
		scribTargetOffsetY = $('#DVcanvasWrapper'+num).offset().top;

		scribTarget = e;
		
		if(startConDiv != null){
			startConDiv.hideIncorrectMark();
			startConDiv = null;
		}
		if(endConDiv != null){
			endConDiv.hideIncorrectMark();
			endConDiv = null;
		}

		currentShape = new createjs.Shape();
		stage.addChild(currentShape)
		oldX = e.pageX;
		oldY = e.pageY;

		
		oldX = e.pageX - scribTargetOffsetX;
		oldY = e.pageY - scribTargetOffsetY;
		arrowHead = new createjs.Shape();
		
		stage.addChild(arrowHead)

		$('#DVcanvasWrapper'+num).unbind("mousemove touchmove").bind("mousemove touchmove",function(e) {e.preventDefault();scrib(e);});
		$('#DVcanvasWrapper'+num).unbind("mouseup touchend").bind("mouseup touchend", function(e) {endScrib(e);});
		$('#DVcanvasWrapper'+num).unbind("mouseleave").bind("mouseleave", function(e) {endScrib(e);});
		
		var initDivContainer = hitTestPointer(oldX,oldY);
		var initDivContainerObj = null;

		if (initDivContainer != null)
			initDivContainerObj = initDivContainer.getObj();
		
		initDivParentContainer = null;
		if (initDivContainerObj != null){
			initDivParentContainer = initDivContainerObj;
			while (!initDivParentContainer.parent().hasClass("drawing_area")){
				initDivParentContainer = initDivParentContainer.parent();
			}
		}

		initDivCon = initDivContainer;
		
		if (initDivCon != null){
			if (initDivCon.getConnectionObj('all').length>0){
				tempRemovedObjects = initDivCon.getConnectionObj('all');
				for (cO=0;cO<tempRemovedObjects.length;cO++)
				{
					tempRemovedObjects[cO].arrow.visible = false;
					tempRemovedObjects[cO].shape.visible = false;
				}
			}
		}
	}
	
	function scrib(e)
	{
		resetLastStepDisplay();
		if (e.touches != undefined)
		{
			if (e.pageX == undefined || e.pageY == undefined)
				e = e.touches[0];
		}

		if (e.originalEvent.touches != undefined)
		{
			if (e.pageX == undefined || e.pageY == undefined)
				e = e.originalEvent.touches[0];
		}

		if (e.pageX == undefined || e.pageY == undefined)
			e = e.originalEvent;
		
		scribTarget = e;
		
		scribArrowDirection = null;
		arrowHead.graphics.clear();
		currentShape.graphics.clear();
		
		
		if (initDivCon == null)
		{
			stage.removeChild(currentShape);
			stage.removeChild(arrowHead); // To remove arrowhead
			return false;
		}
		
		if (initDivCon.getType() != "variableObject"){
			stage.removeChild(currentShape);
			stage.removeChild(arrowHead); // To remove arrowhead
			return false;
		}

		newX = e.pageX;
		newY = e.pageY;
		newX = e.pageX - scribTargetOffsetX;
		newY = e.pageY - scribTargetOffsetY;
		var endDivContainer = hitTestPointer(newX,newY);

		currentShape.graphics.setStrokeStyle(2, 'round', 'round');
		var color = createjs.Graphics.getRGB(0,0,0);
		currentShape.graphics.beginStroke(color);

		arrowHead.graphics.beginStroke("black").beginFill("#000");

		scribArrowDirection = createPath(currentShape, arrowHead, initDivCon, endDivContainer);
	}

	function createPath(currentShape, arrowHead, initDivCon, endDivContainer)
	{

		var arrowCurveMinLimit = 60;
		
		var initObj = null;
		if (initDivCon.getType() == "variableObject")
		{
			var initDivConObj = initDivCon.getObj()
			initObj = ($(initDivConObj).parent().attr("type") == "CollectionObject")?$(initDivConObj).parent():$(initDivConObj);
			var field = $(initDivConObj).find("input");

			var objPos = $(initDivConObj).position();
			objPos = getAbsFieldPos(initDivCon)
			currentShape.graphics.moveTo(objPos.left+(field.width()/2), objPos.top+(field.height()/2));


			if ($(initDivConObj).parent().attr("type") == "CollectionObject"){
				initDivParentContainer = $(initDivConObj).parent();
			}else{
				initDivParentContainer = $(initDivConObj);
			}

			var initDivParentContainerWidth = $(initDivParentContainer).width() + Number($(initDivParentContainer).css("padding-left").split("px")[0]) + Number($(initDivParentContainer).css("padding-right").split("px")[0])
			startX = ($(initDivParentContainer).position().left + initDivParentContainerWidth);
			
			startY = objPos.top+(field.height()/2);
			currentShape.graphics.lineTo(startX, startY);
		}
		var arrowDirection = null;
		var isSnapped = false;
		var snappedObj = null;
		var endPosX = stage.mouseX;
		var endPosY = stage.mouseY;

		if (scribTarget != null){
			endPosX = scribTarget.pageX - scribTargetOffsetX;
			endPosY = scribTarget.pageY - scribTargetOffsetY;
		}
		if (endDivContainer!=null){
			isSnapped = true;
			if ($(endDivContainer.getObj()).attr("type") == "CollectionObject"){
				endPosX = $(endDivContainer.getObj()).position().left;
				snappedObj = $(endDivContainer.getObj());

				if ((endPosX + (snappedObj.width() / 2)) > startX)
				{
					endPosY = $(endDivContainer.getObj()).position().top + (endDivContainer.getConnectionObj("left").length+1)*10;
				}else{
					endPosY = $(endDivContainer.getObj()).position().top + (endDivContainer.getConnectionObj("right").length+1)*10;
				}
			}else if ($(endDivContainer.getObj()).attr("type") == "VariableObject")
			{
				if ($(endDivContainer.getObj()).parent().attr("type") == "CollectionObject"){
					endPosX = $(endDivContainer.getObj()).parent().position().left;
					
					var containetColObj;
					for(var k=0;k<aObjects.length;k++)
					{ 
					   if($(aObjects[k].getObj()).attr("id") == $(endDivContainer.getObj()).parent().attr("id")){
							containetColObj = aObjects[k];
					   }
					}
					snappedObj = $(endDivContainer.getObj()).parent();
					if ((endPosX + (snappedObj.width() / 2)) > startX)
					{
						endPosY = $(endDivContainer.getObj()).parent().position().top + (containetColObj.getConnectionObj("left").length+1)*10;
					}else{
						endPosY = $(endDivContainer.getObj()).parent().position().top + (containetColObj.getConnectionObj("right").length+1)*10;
					}
					
				}else
				{
					isSnapped = false;
					snappedObj = null;
				}
			}
		}

		if (isSnapped)
		{
			
			if ((endPosX + (snappedObj.width() / 2)) > startX)
			{
				//---left
				var xDiff = endPosX - startX;
				xDiff = (xDiff < (arrowCurveMinLimit*2))?xDiff:(arrowCurveMinLimit*2)

				var xDiffMin = endPosX - startX;				
				xDiffMin = (xDiff < (arrowCurveMinLimit*2))?(arrowCurveMinLimit*2):xDiff
				//--[TODO]
				if (Math.abs(startY - endPosY) > 20)
				{
					currentShape.graphics.bezierCurveTo(startX+(xDiffMin), startY, endPosX-(xDiffMin), endPosY, endPosX-10, endPosY);
				}else{
					currentShape.graphics.bezierCurveTo(startX+(arrowCurveMinLimit), startY, endPosX-(arrowCurveMinLimit), endPosY, endPosX-10, endPosY);
				}

				drawArrowHead(arrowHead,endPosX-10,endPosY-4, true);
				arrowDirection = "left";

			}else{
				//---right
				//--Create part 2:
				var initObjWidth = initObj.width()+Number(initObj.css("padding-left").split("px")[0])+Number(initObj.css("padding-right").split("px")[0])
				var initObjHeight = initObj.height()+Number(initObj.css("padding-top").split("px")[0])+Number(initObj.css("padding-bottom").split("px")[0])

				var endObjWidth = snappedObj.width()+Number(snappedObj.css("padding-left").split("px")[0])+Number(snappedObj.css("padding-right").split("px")[0])
				var endObjHeight = snappedObj.height()+Number(snappedObj.css("padding-top").split("px")[0])+Number(snappedObj.css("padding-bottom").split("px")[0])

				var newStartEndPosY; 

				if(endPosY < (initObj.position().top + (initObjHeight/2)))
				{
					newStartEndPosY = initObj.position().top-4 
				}else{ 
					newStartEndPosY = initObj.position().top + initObjHeight + 5
				}
				
				var newEndPosX = endPosX + endObjWidth;
				if (initObj.attr("id") == snappedObj.attr("id")){
					currentShape.graphics.bezierCurveTo(newEndPosX + (arrowCurveMinLimit), startY, newEndPosX + (arrowCurveMinLimit), endPosY, newEndPosX+10, endPosY);
				}else if (newEndPosX > startX){
					currentShape.graphics.bezierCurveTo(newEndPosX + (arrowCurveMinLimit), startY, newEndPosX + (arrowCurveMinLimit), endPosY, newEndPosX+10, endPosY);
				}else if (newEndPosX+(initObjWidth/2) > startX){
					currentShape.graphics.bezierCurveTo(newEndPosX + (arrowCurveMinLimit), startY, newEndPosX + (arrowCurveMinLimit), endPosY, newEndPosX+10, endPosY);
				}else{
					currentShape.graphics.bezierCurveTo(startX + (arrowCurveMinLimit/2), startY, startX+(arrowCurveMinLimit/2), newStartEndPosY, startX, newStartEndPosY);
					currentShape.graphics.bezierCurveTo(newEndPosX + (arrowCurveMinLimit/2), newStartEndPosY, newEndPosX + (arrowCurveMinLimit), endPosY, newEndPosX+10, endPosY);
				}

				drawArrowHead(arrowHead,newEndPosX+10,endPosY-4, false);
				arrowDirection = "right";
			}

		
		}else{

			if (endPosX > startX)
			{
				
				var xDiff = endPosX - startX;
				xDiff = (xDiff < (arrowCurveMinLimit*2))?xDiff:(arrowCurveMinLimit*2)

				var xDiffMin = endPosX - startX;				
				xDiffMin = (xDiff < (arrowCurveMinLimit*2))?(arrowCurveMinLimit*2):xDiff
				
				currentShape.graphics.bezierCurveTo(startX+(xDiffMin), startY, endPosX-(xDiffMin), endPosY, endPosX, endPosY)	
				
			}else{
				//---Left
				//--Create part 2:
				currentShape.graphics.bezierCurveTo(startX + (arrowCurveMinLimit/2), startY, startX+(arrowCurveMinLimit/2), endPosY, startX, endPosY);

				currentShape.graphics.bezierCurveTo(startX, endPosY, endPosX, endPosY, endPosX, endPosY);
			}
			
			if (endPosX <= startX)
				drawArrowHead(arrowHead,endPosX+10,endPosY-4, false);
			else
				drawArrowHead(arrowHead,endPosX-10,endPosY-4, true);
			
		}
		if (arrowDirection != null)
			return arrowDirection;

		currentShape = null;
		arrowHead = null;
	}
	

	function getAbsFieldPos(obj)
	{
		var parentObjs = new Array();
		var fieldContainer = $(obj.getObj());
		parentObjs.push(fieldContainer);
		
		var field = fieldContainer.find("input");
		while (!fieldContainer.parent().hasClass("drawing_area")){
			fieldContainer = fieldContainer.parent();
			parentObjs.push(fieldContainer);
		}
		
		var posX;
		var posY;
		posX = $(field).position().left;
		posY = $(field).position().top;
		if (parentObjs.length > 1)
		{
			posX += Number($(obj.getObj()).css("margin-left").split("px")[0]);
			posY += Number($(obj.getObj()).css("margin-top").split("px")[0]);

		}
		for (var i=0;i<parentObjs.length;i++){
			posX += $(parentObjs[i]).position().left;
			posY += $(parentObjs[i]).position().top;
		}
		return {"left":posX, "top":posY};
	}

	// Amit logic for external execution
	function runStep(nID)
	{
		
		var oCurrentStep = instructions[nID]
		var bConnect = false
		if(isNaN(oCurrentStep.value))
		{
			bConnect = true;
		}

		if(instructions[nID].set.length > 2){
			var lblStr =  instructions[nID].set[2]+'_'+instructions[nID].set[0]+'_'+instructions[nID].set[1];
			var varSetLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")
		}else{
			var lblStr =  instructions[nID].set[0][2]+'_'+instructions[nID].set[0][0]+'_'+instructions[nID].set[0][1];
			var varSetLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")
		}
		
		var vObj1 = findObject(varSetLabel);

		var lblStr =  String(instructions[nID].value[2]+'_'+instructions[nID].value[0]+'_'+instructions[nID].value[1]).replace(/[\])}[{(]/g,'');
		var varValueLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
		if(bConnect)
		{
			var vObj2 = findObject(varValueLabel);
			var dv0 = vObj1.getID();
			var dv1 = vObj2.getID();
			
			$('#DVcanvasWrapper'+num).css('pointer-events','auto'); // To enable canvas element
			disableAllFields();
			currentShape = createArrow(dv0,dv1); //calling create arrow method
			dv0.setConnectionObj(currentShape);
			dv1.setConnectionObj(currentShape);
		}
		else
		{
			var vId = vObj1.getUniqueLabel();
			$('#'+vId+' input').val(varValueLabel);
		}
	}

	function endScrib(e,ev)
	{	
		
		$('#DVcanvasWrapper'+num).unbind('mousemove touchmove');
		$('#DVcanvasWrapper'+num).unbind('mouseup touchend');

		if (scribTarget == null){
			return false;
		}
		
		newX = stage.mouseX;
		newY = stage.mouseY;	
		newX = scribTarget.pageX - scribTargetOffsetX;
		newY = scribTarget.pageY - scribTargetOffsetY;

		// Find end div connection
		endDivCon = hitTestPointer(newX,newY);

		// To check whether connected object are correct as per the exection step
		if((initDivCon != null)&& (endDivCon  != null))
		{   
			if ($(endDivCon.getObj()).attr("type") == "VariableObject"){
				if ($(endDivCon.getObj()).parent().attr("type") == "CollectionObject"){
					for(var k=0;k<aObjects.length;k++)
					{ 
					   if($(aObjects[k].getObj()).attr("id") == $(endDivCon.getObj()).parent().attr("id")){
							endDivCon = aObjects[k];
					   }
					}
				}
			}

			checkConnection = connectTestPointer(initDivCon, endDivCon, indCount);

			if (checkConnection != null)
			{
				$('#DVcanvasWrapper'+num).css('pointer-events','none');
				$('.'+num).attr('readonly',true);
				vInvalidAttemptCounter = 0;	    // reset invalid attempt counter
				removePreviousShapes();//---Remove previously connected shape from object list.
				initDivCon.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":scribArrowDirection,"initObj":initDivCon, "endObj":endDivCon});
				endDivCon.setConnectionObj({"shape":currentShape, "arrow":arrowHead,"direction":scribArrowDirection,"initObj":initDivCon, "endObj":endDivCon});

				var initDivConObj = initDivCon.getObj()
				var field = $(initDivConObj).find("input");
				field.removeClass("hc-example-incorrect").addClass("hc-example-correct")
				field.val("");

				indCount++;
				executeSteps();

				$(holder)[0].correct++;
				$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount());
			}
			else
			{
				$(holder)[0].errors++;
				++errorCount;
				$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount(errorCount));
				
				stage.removeChild(currentShape); // To remove arrow
				stage.removeChild(arrowHead); // To remove arrowhead
				showPreviousShapes();

				if(vInvalidAttemptCounter == 1){  // If two invalid attempts occure
					
					$('#nextStepOd'+num).show();
					
					$('#warnMsgOd'+num).html(gt.gettext("try_again_or_msg"));
					$('#warnMsgOd'+num).show();
					
					$('#nextStepOd'+num).unbind("click").click(function(){
						vInvalidAttemptCounter = 0;
						if(startConDiv != null){
							startConDiv.hideIncorrectMark();
							startConDiv = null;
						}
						if(endConDiv != null){
							endConDiv.hideIncorrectMark();
							endConDiv = null;
						}
						// Get current setp object labels 
						var lblStr
						if(instructions[indCount].set.length > 2){
							lblStr =  instructions[indCount].set[2]+'_'+instructions[indCount].set[0]+'_'+instructions[indCount].set[1];
						}else{
							lblStr =  instructions[indCount].set[0][2]+'_'+instructions[indCount].set[0][0]+'_'+instructions[indCount].set[0][1];
						}
						var varSetLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")

						var lblStr =  String(instructions[indCount].value[2]+'_'+instructions[indCount].value[0]+'_'+instructions[indCount].value[1]).replace(/[\])}[{(]/g,'');
						var varValueLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");

						var vObj1 = findObject(varSetLabel);
						var vObj2 = findObject(varValueLabel);

						var dv0 = vObj1.getID();
						var dv1 = vObj2.getID();
						
						var varStep = instructions[indCount];
						var stratObj = getStepObj(varStep.set);
						var endObj = getStepObj(varStep.value);

						if (stratObj.getConnectionObj('all').length>0){
							tempRemovedObjects = stratObj.getConnectionObj('all');
							for (cO=0;cO<tempRemovedObjects.length;cO++)
							{
								tempRemovedObjects[cO].arrow.visible = false;
								tempRemovedObjects[cO].shape.visible = false;

							}
						}
						removePreviousShapes();

						
						currentShape = createArrow(stratObj,endObj);  // calling create arrow method
						stratObj.setConnectionObj(currentShape);
						endObj.setConnectionObj(currentShape);


						$('#nextStepOd'+num).hide();
						$('.'+num).attr('readonly',true);
						indCount++;
						executeSteps();
					});

				}else{

					
					vInvalidAttemptCounter++;
					$('#warnMsgOd'+num).html(gt.gettext("try_again_msg"));
					$('#warnMsgOd'+num).show();
					
				}
				
			}
		}else{
			
			stage.removeChild(currentShape);
			stage.removeChild(arrowHead); // To remove arrowhead
			showPreviousShapes();
		}
		
		scribTarget = null;
	} 
	 
	function showPreviousShapes()
	{
		if (tempRemovedObjects != null){
			for (cO=0;cO<tempRemovedObjects.length;cO++)
			{
				tempRemovedObjects[cO].arrow.visible = true;
				tempRemovedObjects[cO].shape.visible = true;
			}
			tempRemovedObjects = null;
		}
	}

	function removePreviousShapes()
	{
		if (tempRemovedObjects != null){

			for (cO=0;cO<tempRemovedObjects.length;cO++)
			{
				tempRemovedObjects[cO].initObj.removeConnectionObj(tempRemovedObjects[cO]);
				tempRemovedObjects[cO].endObj.removeConnectionObj(tempRemovedObjects[cO]);

				stage.removeChild(tempRemovedObjects[cO].arrow);
				stage.removeChild(tempRemovedObjects[cO].shape);
			}

			tempRemovedObjects = null;
		}
	}
	var autoCompleteStep
	// To execute steps accourding to Instruction set logic
	function executeSteps()
	{   
//		console.log("executeSteps")

		stopTimer();
		$('#next'+num).hide();
		$('#circledNum'+num).show();
		lastStepReset = false;
		vRemCounter = 0;
		removeItemsListeners();
		//$('.'+num).removeClass("hc-example-incorrect").removeClass("hc-example-correct")
		$('#DVcanvasWrapper'+num).css('pointer-events','none');
		
		activateElemetsClick();
		disableDragging();

		$('#warnMsgOd'+num).hide();
		$('#nextStepOd'+num).hide();
		$('#instMsgOd'+num).show();
		
		var i = indCount; 

		if(i < instructions.length) 
		{  
			var varSet = instructions[i].set;
			var varSetLabel;    	
			var varValue;			
			var varDesc = instructions[i].description;
			var varInteractive = instructions[i].interactive;
			var varAdd = instructions[i].add;
			var varRemove = instructions[i].remove;

			var varObj;


			autoCompleteStep = false;
			activityAutoplay = false;
			if(typeof(varDesc) == 'undefined' || varDesc == "" || varDesc == undefined)
			{
				removeItemsListeners();
				isEventsAdded = false;
				autoCompleteStep = true;
				$('#instMsgOd'+num).hide();
				//---Disable fields...
				$('.'+num).attr('readonly', true);
				//---Autoplay step...
				autoPlayActivity();
				return false;
			}

			if(typeof(varInteractive) != 'undefined')
			{
				if (varInteractive)
				{
					++stepCtr
				}
			}else{
				++stepCtr
			}

			if (varInteractive == false && i > 0)
			{
				if (typeof(instructions[i-1].interactive) == 'undefined' || instructions[i-1].interactive == true){
					++stepCtr
				}else if (varInteractive == false && typeof(varRemove) != undefined){
					++stepCtr
				}
			}

			if(typeof(varSet) != 'undefined')
			{
				
				var lblStr;
				if(instructions[i].set.length > 2)
				{
					lblStr =  instructions[i].set[2]+'_'+instructions[i].set[0]+'_'+instructions[i].set[1];
				}else
				{
					lblStr =  instructions[i].set[0][2]+'_'+instructions[i].set[0][0]+'_'+instructions[i].set[0][1];
				}
				varSetLabel =  lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");

				if(instructions[i].value.length > 0 && typeof(instructions[i].value) != "string")
				{
					varValue = instructions[i].value[2];
				}else{
					varValue = instructions[i].value;
				}

				varObj = findObject(varSetLabel);


				if(typeof(varDesc) != 'undefined' && varDesc != "")
				{	
				   var id = varObj.getID();

				   var stepObj = getStepObj(varSet);

				   //--$(stepObj.getObj()).find("input").removeAttr('readonly');
				   for(var k=0;k<aVariables.length;k++)
					{
						//if (aVariables[k].getConnectionObj('all').length == 0){
							$(aVariables[k].getObj()).find("input").removeAttr('readonly');
						//}
					}
				
					for(var k=0;k<aObjects.length;k++)
					{ 
						var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
						if (arrVariablesObj.length > 0)
						{
							for(var v=0;v<arrVariablesObj.length;v++)
							{
								//if (arrVariablesObj[v].getConnectionObj('all').length == 0){
									$(arrVariablesObj[v].getObj()).find("input").removeAttr('readonly');
								//}
							}
						}
					}
				   
				   
				   $('#goal_desc'+num+' #msg').html(varDesc);
				   
				   
				   $('#DVcanvasWrapper'+num).css('pointer-events','none');
					if(varObj != null)
					{	
						stepCtr = (stepCtr == -1)?0:stepCtr;
						switch(typeof(instructions[i].value))
						{
						case 'object':
							$('#DVcanvasWrapper'+num).css('pointer-events','auto');
							activateScrib();
							disableAllFields();
							$('#circledNum'+num).html(stepNumbers[stepCtr]);
							$('#instMsgOd'+num+" #msg").html(gt.gettext("od_draw_arrow"));//"Draw the arrow");
							$('#instMsgOd'+num).show();
							break;
						case 'number':
							$('#circledNum'+num).html(stepNumbers[stepCtr]);
							$('#instMsgOd'+num+" #msg").html(gt.gettext("od_enter_value"));//"Enter the new value");
							$('#instMsgOd'+num).show();
							addItemsListeners();
							break;
						case 'string':
							$('#circledNum'+num).html(stepNumbers[stepCtr]);
							$('#instMsgOd'+num+" #msg").html(gt.gettext("od_enter_value"));//"Enter the new value");
							$('#instMsgOd'+num).show();
							addItemsListeners();
							break;
						default:
							break;
						}
				   }
				}
				
				if(typeof(varInteractive) != 'undefined')
				{	
					$('#next'+num).show();
					$('#circledNum'+num).html(stepNumbers[stepCtr]);
					$('#instMsgOd'+num+" #msg").html(gt.gettext("od_click_next"));//"Click ");
					$('#instMsgOd'+num).show();
					var varStep = instructions[indCount];
					var varObj = findObj(varStep);
					
					
					if(varObj != null)
					{
						if(varObj.getType() == 'collectionObject')
						{
							var varObjItem = varObj.getLabelObj(varStep.set[1]);
							executeNextStep(varObj, varValue, varObjItem.getObj(),varStep);
							//varObj.getLabelObj(instructions[i].set[1]).getLabelForAutoFill()
						} else if(varObj.getType() == 'variableObject')
						{
							executeNextStep(varObj, varValue, varObj.getObj(),varStep);
						}
					}

					//--$(stepObj.getObj()).find("input").removeAttr('readonly');
					
				   for(var k=0;k<aVariables.length;k++)
					{
						//if (aVariables[k].getConnectionObj('all').length == 0){
							$(aVariables[k].getObj()).find("input").attr('readonly',true);
						//}
					}
				
					for(var k=0;k<aObjects.length;k++)
					{ 
						var arrVariablesObj = aObjects[k].getCollectionVariableObjs();
						if (arrVariablesObj.length > 0)
						{
							for(var v=0;v<arrVariablesObj.length;v++)
							{
								//if (arrVariablesObj[v].getConnectionObj('all').length == 0){
									$(arrVariablesObj[v].getObj()).find("input").attr('readonly',true);
								//}
							}
						}
					}
				}	
			}  
			if(typeof(varAdd) != 'undefined')
			{
				$('#next'+num).show();
				$('#next'+num).unbind('click').click(function(){
					if (Array.isArray(instructions[i].add[0]))
					{
						for (ad=0;ad<instructions[i].add.length;ad++)
						{
							addStageChild(instructions, i, instructions[i].add[ad], indCount);
						}
					}else{
						addStageChild(instructions, i, instructions[i].add, indCount);
					}
					

					getMaxHeight();

					htmlData.css('height',maxHeight+'px')
					stage.canvas.height = maxHeight;

					$('#TrashMaster'+num).css("top",(maxHeight-52)+'px')

					
					indCount++;

					executeSteps();
					
				});

				if (stepCtr<0)
					stepCtr = 0;
				$('#circledNum'+num).html(stepNumbers[stepCtr]);
				
				$('#instMsgOd'+num).show();

				$('#instMsgOd'+num+" #msg").html(gt.gettext("od_click_next"));//"Drag the variable(s)/object(s) to the trash");
				
				$('#instMsgOd'+num).show();
				$('#goal_desc'+num+' #msg').html(varDesc);
			}

			if(typeof(varRemove) != 'undefined')
			{

				
				$('#goal_desc'+num+' #msg').html(varDesc);
				$('#next'+num).hide(); 
				$('#TrashMaster'+num).show();
				vRemoveCount = instructions[i].remove.length;
				
				$('#circledNum'+num).html(stepNumbers[stepCtr]);
				
				if ((instructions[i].interactive == "false" || instructions[i].interactive == false) && instructions[i].interactive != undefined)
				{
					$('#instMsgOd'+num+' #msg').html("");
					stepsRemovalCtr = 0;
					$('#next'+num).show();
					$('#next'+num).unbind('click').click(function(){
						resetFieldsHighlight();

						removalAutoNonInteractive();
						$('#next'+num).hide();
						$('#instMsgOd'+num).hide();
					});
				}else{
					startTimerObj();
					$('#instMsgOd'+num).show();
					$('#instMsgOd'+num+" #msg").html(populateRemoveInstructionMsg(instructions[i].remove));//"Drag the variable(s)/object(s) to the trash");
					activateRemove();
					enableDragging();
					// To Droppable element into trash
					$('#TrashMaster'+num).droppable({
						tolerance: 'touch',
						drop: function( event, ui ) {
							startTimerObj();
							dragItemID = $(ui.draggable).attr("id");
							var matched = false;
							if (typeof(instructions[indCount].remove[0]) == 'object'){
								for(var k=0; k < instructions[indCount].remove.length; k++)
								{
									var remVar = instructions[indCount].remove[k];
									varObj = getStepObj(remVar);
									var id = varObj.getID();

									if (dragItemID == id){
										matched = true;
										break;
									}
								}
							}else{
								vRemoveCount = 1;
								var remVar = instructions[indCount].remove;
								varObj = getStepObj(remVar);
								var id = varObj.getID();
								if (dragItemID == id){
									matched = true;
								}
							}

							if($(ui.draggable).attr("type") == "VariableObject"){
								for(var k=0;k<aVariables.length;k++)
								{
									if(aVariables[k].getID() == dragItemID)
									{
//										console.log("aVariables[k].getID() == dragItemID")
										aVariables[k].showIncorrectMark();
										startConDiv = aVariables[k];
										break;
									}
								}
							}else{
								for(var k=0;k<aObjects.length;k++)
								{ 
								   if(aObjects[k].getID() == dragItemID)
									{
//										console.log("aObjects[k].getID() == dragItemID")

										aObjects[k].showIncorrectMark();
										startConDiv = aObjects[k];
										break;
									}
								}
							}

							if (matched)
							{
								vObj = findHtmlObj($(ui.draggable));
								var aConnectedObjects = vObj.getConnectionObj("all");
								

								if (aConnectedObjects.length>0)
								{
									for (i=0;i<aConnectedObjects.length;i++)
									{
										aConnectedObjects[i].initObj.removeConnectionObj(aConnectedObjects[i]);
										aConnectedObjects[i].endObj.removeConnectionObj(aConnectedObjects[i]);
										stage.removeChild(aConnectedObjects[i].shape)
										stage.removeChild(aConnectedObjects[i].arrow)
										stage.update();
									}
								}
								
								aRemovedObjectId.push(dragItemID);  // pushing removed object id in aRemovedObject Array

								$('#drawing'+num+' #'+dragItemID).hide();

								vInvalidAttemptCounter = 0;
								
								// To check wether removable vObjects are finished
								vRemCounter++; // Increment counter on delete vObject

								if(vRemoveCount == vRemCounter){  
									indCount++;
									executeSteps();
									$(holder)[0].correct++;
									$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount());
								}
							}else{
								++errorCount;
								$(holder)[0].errors++;
								$("#errorfeedbackOd"+(num)+" .nooferrors").html(fnErrorCount(errorCount));
								
								if(vInvalidAttemptCounter == 1){  // If two invalid attempts occure
									$('#warnMsgOd'+num).html(gt.gettext("try_again_msg"));
									$('#warnMsgOd'+num).show();
									
									$('#nextStepOd'+num).show();
									$('#nextStepOd'+num).unbind("click").click(function(){
										vInvalidAttemptCounter = 0;
										performRemoveStep();
										/*var vObj;

										if (typeof(instructions[indCount].remove[0]) == 'object'){
											for(var k=0; k < instructions[indCount].remove.length; k++)
											{
												var remVar = instructions[indCount].remove[k];
												
												varObj = getStepObj(remVar);
												if($(varObj.getObj()).css("display") != "none"){
													vObj = varObj;
													break;
												}
											}
										}else{
											var remVar = instructions[indCount].remove;
											varObj = getStepObj(remVar);
											if($(varObj.getObj()).css("display") != "none"){
												vObj = varObj;
												
											}
										}
										if (startConDiv != null){
											startConDiv.hideIncorrectMark();
											startConDiv = null;
										}

										$(vObj.getObj()).animate({
											left: $('#TrashMaster'+num).position().left - ($(vObj.getObj()).width()/2),
											top: $('#TrashMaster'+num).position().top,// + ($(vObj.getObj()).height()/2),
										}, Const.animationSpeed, function() {
											var aConnectedObjects = vObj.getConnectionObj("all");
											
											if (aConnectedObjects.length>0){
												for (i=0;i<aConnectedObjects.length;i++)
												{
													aConnectedObjects[i].initObj.removeConnectionObj(aConnectedObjects[i]);
													aConnectedObjects[i].endObj.removeConnectionObj(aConnectedObjects[i]);
													stage.removeChild(aConnectedObjects[i].shape)
													stage.removeChild(aConnectedObjects[i].arrow)
													stage.update();
												}
											}

											$(vObj.getObj()).hide();
											$('#nextStepOd'+num).hide();
											$('#warnMsgOd'+num).hide();
											// To check wether removable vObjects are finished
											vRemCounter++; // Increment counter on delete vObject
											if(vRemoveCount == vRemCounter){  
												indCount++;
												executeSteps();
											}
										});*/
									});
								}else{
									$('#warnMsgOd'+num).html(gt.gettext("try_again_msg"));
									$('#warnMsgOd'+num).show();
									++vInvalidAttemptCounter
								}
							}
						}
					});
				}
			}
		
		}else{
			var date = new Date();
			endTime = date.getTime();
			var timeDiff = endTime - timerCount;
			var tSeconds = Math.floor(timeDiff/1000);
			$("#errorfeedbackOd"+num+" .timespent").html(", "+tSeconds+" seconds");
			$("#goal_desc"+num+' #msg').hide();
			$("#goodJobOd"+num).show();
			//$('.'+num).removeClass("hc-example-correct").removeClass("hc-example-incorrect");
			$('#circledNum'+num).html("");
			$('#circledNum'+num).hide();
			$('#instMsgOd'+num+" #msg").html("");
			$('#instMsgOd'+num).hide();

			$('#TrashMaster'+num).hide();
			$('#BtnReplay'+num).show();
			$('#next'+num).hide();
			$('#warnMsgOd'+num).hide();
			$('#nextStepOd'+num).hide();
			
			disableActivity();
		}
	}

	function resetFieldsHighlight()
	{
		lastFieldUpdated = null;
		lastStepReset = false;
		resetLastStepDisplay(null);
	}

	function removalAutoNonInteractive(){
		var varStepLength = (typeof(instructions[indCount].remove[0]) == 'object')?instructions[indCount].remove.length : 1;

		if (stepsRemovalCtr < varStepLength){
			autoPlayTimeout = setTimeout(performAutoRemoveNonInteractive,0);
		}else{
			$('#TrashMaster'+num).hide();
			++indCount
			autoPlayTimeout = setTimeout(executeSteps,0);
		}
	}

	function performAutoRemoveNonInteractive()
	{
		var vObj = (typeof(instructions[indCount].remove[0]) == 'object')?getStepObj(instructions[indCount].remove[stepsRemovalCtr]):getStepObj(instructions[indCount].remove);
		$(vObj.getObj()).css("z-index","1000");
		$(vObj.getObj()).animate({
			left: $('#TrashMaster'+num).position().left - ($(vObj.getObj()).width()/2),
			top: $('#TrashMaster'+num).position().top,// + ($(vObj.getObj()).height()/2),
		}, Const.animationSpeed, function() {

			var aConnectedObjects = vObj.getConnectionObj("all");
			if (aConnectedObjects.length>0){
				for (r=0;r<aConnectedObjects.length;r++)
				{

					stage.removeChild(aConnectedObjects[r].shape)
					stage.removeChild(aConnectedObjects[r].arrow)
					stage.update();
				}
			}
			$(vObj.getObj()).css("z-index","auto");

			$(vObj.getObj()).hide();
			++stepsRemovalCtr
			removalAutoNonInteractive()
		});
	}

	function addStageChild(instructions, i, addObj, indCount)
	{
		
		var objShown = false;

		for (var m=0;m<variables.length;m++)
		{
			if (variables[m]+"" != "undefined")
			{
				if (variables[m].join(",") == addObj.join(","))
				{
					for (var v=0;v<aVariables.length;v++)
					{
						lbl = aVariables[v].getUniqueLabel();
						var objLbl = (num+"_"+addObj[2]+"_"+addObj[0]+"_"+addObj[1]).replace(/[\])}[{(]/g,'').replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")
						if (lbl == objLbl){
							aVariables[v].resetObj();
							$(aVariables[v].getObj()).show();
							objShown = true;
						}
					}
					
				}
			}
		}

		if (!objShown)
		{
			for (var m=0;m<objects.length;m++)
			{
				if (objects[m]+"" != "undefined")
				{
					if (objects[m].join(",") == addObj.join(","))
					{
						for (var v=0;v<aObjects.length;v++)
						{
							lbl = aObjects[v].getUniqueLabel();
							var objLbl = (num+"_"+addObj[2]+"_"+addObj[0]+"_"+addObj[1]).replace(/[\])}[{(]/g,'').replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "")
							if (lbl == objLbl){
								aObjects[v].resetObj();
								$(aObjects[v].getObj()).show();
								objShown = true;
							}
						}
					}
				}
			}
		}

		if (!objShown)
		{
			var Obj
			if (addObj.length==4)
			{
				variables.push(addObj);

				var objVariables = new VariableObject(addObj,num,undefined,0)

				objVariables.Evts.addEventListener(objVariables.DRAW_ARROW,handleVariableDrawArrow);
				objVariables.Evts.addEventListener(objVariables.CHANGED,handleVariableChanged);
				objVariables.Evts.addEventListener(objVariables.UPDATED,handleValueUpdated);
				objVariables.Evts.addEventListener(objVariables.FOCUSED,handleObjectFocus);

				aVariables.push(objVariables);
				Obj = objVariables.getObj();
				$(Obj).addClass("cVariable");
				objVariables.populateInitialData();

			}else{

				objects.push(addObj);

				var cObjects = new CollectionObject(addObj, num);

				cObjects.Evts.addEventListener(cObjects.DRAW_ARROW,handleObjectDrawArrow);
				cObjects.Evts.addEventListener(cObjects.CHANGED,handleCollectionObjectChanged);
				cObjects.Evts.addEventListener(cObjects.UPDATED,handleValueUpdated);
				cObjects.Evts.addEventListener(cObjects.FOCUSED,handleObjectFocus);

				aObjects.push(cObjects);
				cObjects.populateInitialData();
				Obj = cObjects.getObj();
			}
			sObj = $(htmlData).find(".trashMaster");
			Obj.insertBefore(sObj);

			addedElements.push({"indCount":indCount, "obj":Obj});
		}
	}

	function populateRemoveInstructionMsg(arrRemoveObjs)
	{	
		var variableCt = 0;
		var objectCt = 0;
		if (typeof(arrRemoveObjs[0]) == 'object'){
			//---Multiple objects
			for(var m=0;m<arrRemoveObjs.length;m++)
			{
				for(var k=0;k<variables.length;k++)
				{
					if (arrRemoveObjs[m] == variables[k]){
						variableCt++;
					}
				}

				for(var k=0;k<objects.length;k++)
				{ 
					if (arrRemoveObjs[m] == objects[k]){
						objectCt++;
					}
				}
			}
		}else{
			//---Single object
			for(var k=0;k<variables.length;k++)
			{
				if (arrRemoveObjs == variables[k]){
					variableCt++;
				}
			}

			for(var k=0;k<objects.length;k++)
			{ 
				if (arrRemoveObjs == objects[k]){
					objectCt++;
				}
			}
		}
		if (variableCt > 0 && objectCt > 0)
			return gt.gettext("od_remove_variable_object");
		if (variableCt ==1 && objectCt == 0)
			return gt.gettext("od_remove_variable");
		if (variableCt >1 && objectCt == 0)
			return gt.gettext("od_remove_variables");
		if (variableCt ==0 && objectCt == 1)
			return gt.gettext("od_remove_object");
		if (variableCt ==0 && objectCt > 1)
			return gt.gettext("od_remove_objects");
	}
	
	function enableDragging(){
		for(var k=0;k<aVariables.length;k++)
		{
			if($(aVariables[k].getObj()).hasClass('ui-draggable'))
				$(aVariables[k].getObj()).draggable( "enable" );
			else
				$(aVariables[k].getObj()).draggable({start:doStartDrag, revert:doVarRevert});
		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			if($(aObjects[k].getObj()).hasClass('ui-draggable'))
				$(aObjects[k].getObj()).draggable( "enable" );
			else
				$(aObjects[k].getObj()).draggable({start:doStartDrag, revert:doObjRevert});
		}
	}

	function disableDragging(){
		for(var k=0;k<aVariables.length;k++)
		{
			if($(aVariables[k].getObj()).hasClass('ui-draggable'))
			$(aVariables[k].getObj()).draggable( "disable" );
		}
		for(var k=0;k<aObjects.length;k++)
		{ 
			if($(aObjects[k].getObj()).hasClass('ui-draggable'))
				$(aObjects[k].getObj()).draggable( "disable" );
		}
	}

	function doStartDrag()
	{
		resetFieldsHighlight();
		if (startConDiv != null){
			startConDiv.hideIncorrectMark();
			startConDiv = null;
		}
	}

	function doVarRevert()
	{
		return true;
	}

	function doObjRevert()
	{
		return true;
	}
	var autoExecStepInst
   // onclick of next button execute next instruction set step
	function executeNextStep(vObj, vVal, variableObj, instructions)
	{
//		console.log("executeNextStep")

		autoExecStepInst = instructions;
		
		$('#next'+num).unbind('click').click(function(){

			$(this).hide();
			$('#instMsgOd'+num).hide();
			lastFieldUpdated = null;
			lastStepReset = false;
			resetFieldsHighlight();

			vInvalidAttemptCounter = 0;
			if(startConDiv != null){
				startConDiv.hideIncorrectMark();
				startConDiv = null;
			}
			if(endConDiv != null){
				endConDiv.hideIncorrectMark();
				endConDiv = null;
			}
			
			varStep = autoExecStepInst;
			if (typeof(varStep.value) == "object")
			{
				var stratObj = getStepObj(varStep.set);
				var endObj = getStepObj(varStep.value);
				

				if (stratObj.getConnectionObj('all').length>0){
					tempRemovedObjects = stratObj.getConnectionObj('all');
					for (cO=0;cO<tempRemovedObjects.length;cO++)
					{
						tempRemovedObjects[cO].arrow.visible = false;
						tempRemovedObjects[cO].shape.visible = false;

					}
				}
				removePreviousShapes();			
				currentShape = createArrow(stratObj,endObj);
				stratObj.setConnectionObj(currentShape);
				endObj.setConnectionObj(currentShape);
				var field = $(stratObj.getObj()).find("input");
				field.val("");
			}else{
				if (vObj.getType() != "variableObject")
				{
					var arrVariablesObj = vObj.getCollectionVariableObjs();
					if (arrVariablesObj.length > 0)
					{
						for(var v=0;v<arrVariablesObj.length;v++)
						{
							if (arrVariablesObj[v].getObj() == variableObj)
							{
								arrVariablesObj[v].setObjDataValue(vVal);
								removeLinkage(arrVariablesObj[v]);
								break;
							}
						}
					}
				}else{
					vObj.resetObj();
					vObj.setObjDataValue(vVal);
				}
				$(variableObj).find('input').val(vVal);
				$(variableObj).find('input').addClass("hc-example-correct");
			}
			
			indCount++;
			//executeSteps();
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(executeSteps,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(executeSteps,Const.animationSpeed);
			}
		});
	}
  
	//findObject return object matching with label
	function findObject(vsLabel)
	{	

		var vSL = num+'_'+vsLabel.replace(/[\])}[{(]/g,'');
		for(var i=0;i<aVariables.length;i++)
		{
			var objLabel = aVariables[i].getUniqueLabel();
			if(vSL == objLabel)
			{
				return aVariables[i];
			}
		}

		for(var i=0;i<aObjects.length;i++)
		{ 
		   var objLabel = aObjects[i].getUniqueLabel();
		   if(vSL == objLabel)
			{
				return aObjects[i];
			}
		}	

	   return null;
	} 
	
	function findObjVar(instStep)
	{
		if (instStep.set == undefined)
			return undefined;

		if (instStep.set.length == 2){
			for (var i = 0; i < objects.length; i++) {
				if (instStep.set[0] == objects[i]){
					return aObjects[i].getLabelObj(instStep.set[1]);
				}
			}
		}else{
			for (var i = 0; i < variables.length; i++) {
				if (instStep.set == variables[i]){
					return aVariables[i];
				}
			}
		}
	}
	
	function findObj(instStep)
	{
		if (instStep.set != undefined){
			if (instStep.set[0].length > 2){
				for (var i = 0; i < objects.length; i++) {
					if (instStep.set[0] == objects[i]){
						return aObjects[i];
					}
				}
			}else{
				for (var i = 0; i < variables.length; i++) {
					if (instStep.set == variables[i]){
						return aVariables[i];
					}
				}
			}
		}else{
			return null
		}
	}

	function findHtmlObj(htmlObj)
	{
		for (var i = 0; i < aObjects.length; i++) {
			
			if (htmlObj.attr("id") == $(aObjects[i].getObj()).attr("id")){
				return aObjects[i];
				break;
			}
		}

		for (var i = 0; i < aVariables.length; i++) {
			
			if (htmlObj.attr("id") == $(aVariables[i].getObj()).attr("id")){
				return aVariables[i];
				break;
			}
		}
	}
	function getStepObj(varStep)
	{
		if (varStep.length == 2){
			obj = varStep[0];
			for (var i = 0; i < objects.length; i++) {
				if (obj == objects[i]){
					return aObjects[i].getLabelObj(varStep[1]);
					break;
				}
			}
		}else{
			obj = varStep;

			for (var i = 0; i < objects.length; i++) {
				if (obj == objects[i]){
					return aObjects[i];
					break;
				}
			}

			for (var i = 0; i < variables.length; i++) {
				if (obj.join(",") == variables[i].join(",")){
					return aVariables[i];
					break;
				}
			}
			
		}
		return null;
	}

	// Check wether connected divs are as per the instruction set
	function connectTestPointer(dv0,dv1,indCount)
	{ 

		var varStep = instructions[indCount];
		var stratObj = getStepObj(varStep.set);
		var endObj = getStepObj(varStep.value);
		var id0 = String($(dv0.getObj()).attr("id"));
		var id1 = String($(dv1.getObj()).attr("id"));
		var crossDisplayed = false;
		if (id0!=id1 && id0.indexOf(id1) == -1 && id1.indexOf(id0) == -1){
			if (dv0 != stratObj){
				crossDisplayed = true;
				dv0.showIncorrectMark();
				startConDiv = dv0;
			}
			if (dv1 != endObj){
				if (!crossDisplayed)
				{
					crossDisplayed = true;
					dv1.showIncorrectMark();
				}
				endConDiv = dv1;
			}
		}else{
			startConDiv = dv0;
			dv0.showIncorrectMark();
		}
		if (dv0 == stratObj && dv1 == endObj)
			return true;
		else 
			return null;
	}		
	
	function hitTestPointer(x,y)
	{
		for(var i=0;i<aVariables.length;i++)
		{
			var objInitX = $('#'+aVariables[i].getID()).position().left + Number($('#'+aVariables[i].getID()).css('padding-left').split("px")[0]);
			var objInitY = $('#'+aVariables[i].getID()).position().top + Number($('#'+aVariables[i].getID()).css('padding-top').split("px")[0]);
			var objMaxX = $('#'+aVariables[i].getID()).position().left+$('#'+aVariables[i].getID()).width() + Number($('#'+aVariables[i].getID()).css('padding-left').split("px")[0]) + Number($('#'+aVariables[i].getID()).css('padding-right').split("px")[0]);
			var objMaxY = $('#'+aVariables[i].getID()).position().top+$('#'+aVariables[i].getID()).height() + Number($('#'+aVariables[i].getID()).css('padding-top').split("px")[0]) + Number($('#'+aVariables[i].getID()).css('padding-bottom').split("px")[0]);
			
			if((x>=objInitX)&&(x<=objMaxX)&&(y>=objInitY)&&(y<=objMaxY))
			{
				
				return aVariables[i];
			}
		}

		for(var i=0;i<aObjects.length;i++)
		{   
			varObjDiv = aObjects[i].getObjDiv(x,y);
			
			if(varObjDiv != null)
			{
			  
			  return varObjDiv
			  
			}else
			{	
				var objInitX = $('#'+aObjects[i].getID()).position().left - (Number($('#'+aObjects[i].getID()).css('padding-left').split("px")[0])/2);
				var objInitY = $('#'+aObjects[i].getID()).position().top - Number($('#'+aObjects[i].getID()).css('padding-top').split("px")[0])/2;
				var objMaxX = $('#'+aObjects[i].getID()).position().left+$('#'+aObjects[i].getID()).width() + Number($('#'+aObjects[i].getID()).css('padding-left').split("px")[0]) + Number($('#'+aObjects[i].getID()).css('padding-right').split("px")[0]);
				var objMaxY = $('#'+aObjects[i].getID()).position().top+$('#'+aObjects[i].getID()).height() + Number($('#'+aObjects[i].getID()).css('padding-top').split("px")[0]) + Number($('#'+aObjects[i].getID()).css('padding-top').split("px")[0]);//+40;
				if((x>=objInitX)&&(x<=objMaxX)&&(y>=objInitY)&&(y<=objMaxY))
				{
					return aObjects[i];
				}
			}
		}
				
		return null;
	}
	
	// Create Dynamic Arrow
	function createArrow(dv0,dv1)
	{

		var startObj = dv0.getObj();
		var endObj = dv1.getObj();
		
		var x1, x2, y1, y2; 
		
		currentShape = new createjs.Shape();
		stage.addChild(currentShape);
		currentShape.graphics.setStrokeStyle(2, 'round', 'round');
		var color = createjs.Graphics.getRGB(0,0,0);
		currentShape.graphics.beginStroke(color);

		arrowHead = new createjs.Shape();
		stage.addChild(arrowHead);
		arrowHead.graphics.beginStroke("black").beginFill("#000");

		var direction = createPath(currentShape, arrowHead, dv0, dv1);
		return {"shape":currentShape,"arrow":arrowHead,"direction":direction,"initObj":dv0,"endObj":dv1};
	}
	
	function constructBottomSection(){
		$(holder).append("<div class='bottomDv hc-bottom'></div>")

		$(holder).children(".bottomDv").append('<div class="errorfeedback hc-message hc-errors" id="errorfeedbackOd'+num+'"><span class="nooferrors">'+fnErrorCount(0)+'</span><span class="timespent"></span></div>')
		
		$(holder).children(".bottomDv").append('<span id="BtnReplay'+num+'" class="hc-button hc-step btnPlay">Play</span>');
		
		$(holder).children(".bottomDv").append("<span class='hc-button hc-start btnStartOver' id='startOvrOd"+num+"'>"+gt.gettext("Start over")+"</span>");
		
		$('#startOvrOd'+num).css('display','none');
	}

	// To start again on click of startover button
	function addButttonEvents(){
		
		$("#BtnReplay"+num).unbind("click").on("click touch", function(){

			restartActivity();
			$("#goal_desc"+num+' #msg').show();
			$("#startbtnOd"+num).hide();
			$("#errorfeedbackOd"+num).show();
			$("#startOvrOd"+num).show();
			$("#goal_desc"+num+' #msg').text("Self animated sequence.");
			
			autoPlayActivity()
		});
		
		$("#startbtnOd"+num).unbind("click").on("click touch",function(){
			var buttonID = $(this).attr("id"); 				
			buttonID = buttonID.substring(10,buttonID.length);				
			$(this).hide();
			
			horstmann_objectdiagram.aQuestions[buttonID].startActivity();
			
			$('#startOvrOd'+buttonID).show();
			$("#errorfeedbackOd"+buttonID).show();
		});
		
		$('#startOvrOd'+num).unbind('click').click(function(){
			stopTimer();
			$("#goal_desc"+num+' #msg').show();
			restartActivity();
			removeItemsListeners();
		});
		//
		setTimeout(updateInitialDisplay,200);
	}
	
	function restartActivity(){
//		console.log("restartActivity")

		disableDragging();
		activityAutoplay = false;
		autoCompleteStep = false;
		stepCtr = -1;
		$('#DVcanvasWrapper'+num).unbind('mousemove touchmove');
		$('#DVcanvasWrapper'+num).unbind('mouseup touchend');
		$('#DVcanvasWrapper'+num).unbind('mouseleave');

		clearTimeout(autoPlayTimeout);
		var vIdCount = aRemovedObjectId.length;
		for(var i=0; i<vIdCount;i++ ){
			try{
				$('#'+aRemovedObjectId[i]).draggable( "destroy" );	
				$('#'+aRemovedObjectId[i]).show();
			}
			catch(e){}
		}

		for(var k=0;k<aVariables.length;k++)
		{
			$(aVariables[k].getObj()).stop();
			aVariables[k].resetObj();
			$(aVariables[k].getObj()).show();
		}

		for(var k=0;k<aObjects.length;k++)
		{ 
			$(aObjects[k].getObj()).stop();
			aObjects[k].resetObj();
			$(aObjects[k].getObj()).show();
		}

		for(var k=0;k<addedElements.length;k++)
		{ 
			
			$(addedElements[k].obj).hide();
		}

		$('.'+num).val('');
		
		$('#nextStepOd'+num).hide();
		$('#startOvrOd'+num).hide();
		$('#next'+num).hide();
		$('#BtnReplay'+num).hide();
		$('#TrashMaster'+num).hide();
		$("#errorfeedbackOd"+num+" .nooferrors").html(fnErrorCount(0));
		$("#errorfeedbackOd"+num+" .timespent").html(" ");
		$("#errorfeedbackOd"+num).hide();
		$("#goal_desc"+num+' #msg').text(gt.gettext("Press start to begin."));
		$("#startbtnOd"+num).show();
		$("#goodJobOd"+num).hide();
		$('#warnMsgOd'+num).html("");
		$('#warnMsgOd'+num).hide();
		$('#instMsgOd'+num).hide();
		$('#circledNum'+num).html('');
		$('#circledNum'+num).hide();
		$('#instMsgOd'+num+" #msg").html('');
		
		indCount = 0;
		stepsRemovalCtr = 0;
		errorCount = 0;
		timerCount = 0;
		vRemoveCount = 0;
		vRemCounter = 0;
		vInvalidAttemptCounter = 0;

		$(holder)[0].errors = 0;
		$(holder)[0].correct = 0;

		canvas = document.getElementById("canvas"+num);
		stage = new createjs.Stage(canvas);
		
		stage.update();
		if (!isIE11()){
			createjs.Touch.enable(stage);
		}
		createjs.Ticker.setFPS(24);
		createjs.Ticker.addEventListener('tick',handleTick);

		$('#DVcanvasWrapper'+num).addClass("canvasWrapper");
		$('#DVcanvasWrapper'+num).css('pointer-events','none');

		setTimeout(updateInitialDisplay,200);
	}
	function isIE() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
			return true;
		}

		return false;
	}
	
	function isIE11() {
	  if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
	  return true;
		}
		return false;
	}
	function autoPlayActivity(){
		$('#circledNum'+num).show();
		if (indCount > 0)
		{
			if (instructions[indCount-1]!=undefined)
			{
				var varStep = instructions[indCount-1];
				
				var vObj = findObjVar(varStep);
				if (vObj != undefined)
				{
					var inputField = $(vObj.getObj()).find("input");
					
					if (inputField != undefined)
					{
						inputField.removeClass("hc-example-correct");
					}
				}
			}
		}
		autoCompleteStepAutoPlay = false;
		if (instructions[indCount] != undefined)
		{
			var varDesc = instructions[indCount].description;
			if(typeof(varDesc) == 'undefined' || varDesc == "" || varDesc == undefined)
			{
				
				autoCompleteStepAutoPlay = true;
			}
		}
		activityAutoplay = true;
		if (!autoCompleteStep && !autoCompleteStepAutoPlay)
		{
			if(instructions[indCount] != undefined){
				var varInteractive = instructions[indCount].interactive;
				if(typeof(varInteractive) != 'undefined')
				{
					if (varInteractive)
					{
						++stepCtr
					}
				}else{
					++stepCtr
				}
			}

			if (stepCtr == -1)
				stepCtr = 0;

			if (varInteractive == false && indCount > 0)
			{
				if (typeof(instructions[indCount-1].interactive) == 'undefined'){
					++stepCtr
				}
			}
		
			$('#next'+num).hide();
			$('#next'+num).css("cursor","pointer");
		}else{
			for(var k=0;k<aVariables.length;k++)
			{
				$(aVariables[k].getObj()).find("input").removeClass("hc-example-incorrect");
				$(aVariables[k].getObj()).find("input").removeClass("hc-example-correct");
			}

			for(var k=0;k<aObjects.length;k++)
			{ 
				$(aObjects[k].getObj()).find("input").removeClass("hc-example-incorrect");
				$(aObjects[k].getObj()).find("input").removeClass("hc-example-correct");
			}
		}
		horstmann_objectdiagram.aQuestions[num].disableActivity();

		if (indCount < instructions.length){
			if (!autoCompleteStep && !autoCompleteStepAutoPlay)
			{
				if (instructions[indCount].description != undefined){
					$('#goal_desc'+num+' #msg').html(instructions[indCount].description);
				}
				$('#instMsgOd'+num).hide();
			}

			var varValue = instructions[indCount].value;
			var varInteractive = instructions[indCount].interactive;
			var varRemove = instructions[indCount].remove;
			var varAdd = instructions[indCount].add;

			if(typeof(varValue) == 'object')
			{	
				//---Connect line
				if (!autoCompleteStep && !autoCompleteStepAutoPlay)
				{
					$('#circledNum'+num).html(stepNumbers[stepCtr]);
					$('#instMsgOd'+num+" #msg").html(gt.gettext("od_draw_arrow"));
				}

			}else if(typeof(varRemove) != 'undefined'){
				//---Remove
				$('#TrashMaster'+num).show();
				if (!autoCompleteStep && !autoCompleteStepAutoPlay)
				{
					$('#circledNum'+num).html(stepNumbers[stepCtr]);
					$('#instMsgOd'+num+" #msg").html(populateRemoveInstructionMsg(instructions[indCount].remove));
				}
				
			}else if(typeof(varValue) != 'object')
			{	
				if(typeof(varInteractive) != 'undefined')
				{
					if (!autoCompleteStep && !autoCompleteStepAutoPlay)
					{
						$('#circledNum'+num).html(stepNumbers[stepCtr]);
						$('#instMsgOd'+num+" #msg").html(gt.gettext("od_click_next"));
					}
					//$('#next'+num).show();
					$('#next'+num).unbind('click')
					$('#next'+num).css("cursor","default");

					if(typeof(varAdd) != 'undefined'){
						$('#next'+num).hide();
						$('#instMsgOd'+num+" #msg").html(instructions[indCount].description);
					}
				}
				else{
					if (!autoCompleteStep && !autoCompleteStepAutoPlay)
					{
						$('#circledNum'+num).html(stepNumbers[stepCtr]);
						$('#instMsgOd'+num+" #msg").html(gt.gettext("od_enter_value"));
					}
				}


			}
			else if(typeof(varAdd) != 'undefined'){
				$('#next'+num).hide();
			}
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(performAutoPlayStep,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(performAutoPlayStep,Const.animationSpeed);
			}
		}else{
			$('#circledNum'+num).html("");
			$('#instMsgOd'+num+" #msg").html("");
			$('#goal_desc'+num+' #msg').html(gt.gettext("od_start_over_msg"));//"Press Start Over button to restart activity.");
			$('#BtnReplay'+num).show();
			activityAutoplay = false;
		}
		
	}

	function performAutoPlayStep(){
		var varSet = instructions[indCount].set;
		var varValue = instructions[indCount].value;
		var varDesc = instructions[indCount].description;
		var varInteractive = instructions[indCount].interactive;
		var varAdd = instructions[indCount].add;
		var varRemove = instructions[indCount].remove;
		var varObj;
		var varStep = instructions[indCount];
		i = indCount;
		stepsRemovalCtr = 0;
		$('#instMsgOd'+num).hide();

		if(typeof(varValue) == 'object')
		{	
			//---Connect line
			$('#circledNum'+num).html(stepNumbers[stepCtr]);
			$('#instMsgOd'+num+" #msg").html(gt.gettext("od_draw_arrow"));
			var stratObj = getStepObj(varStep.set);
			var endObj = getStepObj(varStep.value);
			

			if (stratObj.getConnectionObj('all').length>0){
				tempRemovedObjects = stratObj.getConnectionObj('all');
				for (cO=0;cO<tempRemovedObjects.length;cO++)
				{
					tempRemovedObjects[cO].arrow.visible = false;
					tempRemovedObjects[cO].shape.visible = false;

				}
			}
			removePreviousShapes();			
			currentShape = createArrow(stratObj,endObj);
			stratObj.setConnectionObj(currentShape);
			endObj.setConnectionObj(currentShape);
			var field = $(stratObj.getObj()).find("input");
			field.val("");

			++indCount
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(executeSteps,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(autoPlayActivity,Const.animationSpeed);
			}
		}else if(typeof(varAdd) != 'undefined')
		{
			var objShown = false;
			
			if (Array.isArray(instructions[i].add[0]))
			{
				for (ad=0;ad<instructions[i].add.length;ad++)
				{
					addStageChild(instructions, i, instructions[i].add[ad], indCount);
				}
			}else{
				addStageChild(instructions, i, instructions[i].add, indCount);
			}
			getMaxHeight();
			htmlData.css('height',maxHeight+'px')
			stage.canvas.height = maxHeight;

			$('#circledNum'+num).html(stepNumbers[stepCtr]);
			
			$('#instMsgOd'+num+" #msg").html(instructions[indCount].description);
			
			++indCount
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(executeSteps,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(autoPlayActivity,Const.animationSpeed);
			}
		}
		else if(typeof(varRemove) != 'undefined')
		{
			//---Remove
			autoStepRemoval();
		
		}else if(typeof(varValue) != 'object')
		{	
			$('#circledNum'+num).html(stepNumbers[stepCtr]);
			$('#instMsgOd'+num+" #msg").html(gt.gettext("od_enter_value"));
			//---Set value line
			var vObj = findObjVar(varStep);
			if (vObj != undefined)
			{
				var inputField = $(vObj.getObj()).find("input");
				inputField.val(varStep.value);
				vObj.setObjDataValue(varStep.value);
				inputField.addClass("hc-example-correct");
				++indCount

				removeLinkage(vObj);
			}
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(executeSteps,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(autoPlayActivity,Const.animationSpeed);
			}
		}
	}
	
	function autoStepRemoval(){
		var varStepLength = (typeof(instructions[indCount].remove[0]) == 'object')?instructions[indCount].remove.length : 1;

		if (stepsRemovalCtr < varStepLength){
			autoPlayTimeout = setTimeout(performAutoRemoveStep,Const.animationSpeed);
		}else{
			$('#TrashMaster'+num).hide();
			++indCount
			if (autoCompleteStep)
			{
				autoPlayTimeout = setTimeout(executeSteps,Const.autoStepAnimationSpeed);
			}else{
				autoPlayTimeout = setTimeout(autoPlayActivity,Const.animationSpeed);
			}
		}
	}
	
	function performAutoRemoveStep()
	{
		var vObj = (typeof(instructions[indCount].remove[0]) == 'object')?getStepObj(instructions[indCount].remove[stepsRemovalCtr]):getStepObj(instructions[indCount].remove);
		$(vObj.getObj()).css("z-index","1000");
		$(vObj.getObj()).animate({
			left: $('#TrashMaster'+num).position().left - ($(vObj.getObj()).width()/2),
			top: $('#TrashMaster'+num).position().top,// + ($(vObj.getObj()).height()/2),
		}, Const.animationSpeed, function() {

			var aConnectedObjects = vObj.getConnectionObj("all");
			if (aConnectedObjects.length>0){
				for (r=0;r<aConnectedObjects.length;r++)
				{
					stage.removeChild(aConnectedObjects[r].shape)
					stage.removeChild(aConnectedObjects[r].arrow)
					stage.update();
				}
			}
			$(vObj.getObj()).hide();
			++stepsRemovalCtr
			autoStepRemoval()
		});
	}
	
	initialize();
	// add Custom Events here
	function QuestionEventDispatcher() {};
	QuestionEventDispatcher.prototype.events = {};
	
	addQuestionEventListener = QuestionEventDispatcher.prototype.addEventListener = function (key, func) {
		if (!QuestionEventDispatcher.prototype.events.hasOwnProperty(key)) {
			QuestionEventDispatcher.prototype.events[key] = [];
		}
		QuestionEventDispatcher.prototype.events[key].push(func);
	};

	removeQuestionEventListener = QuestionEventDispatcher.prototype.removeEventListener = function (key, func) {
		if (QuestionEventDispatcher.prototype.events.hasOwnProperty(key)) {
			for (var i in QuestionEventDispatcher.prototype.events[key]) {
				if (QuestionEventDispatcher.prototype.events[key][i] === func) {
					QuestionEventDispatcher.prototype.events[key].splice(i, 1);
				}
			}
		}
	};

	dispatchQuestionEvent = QuestionEventDispatcher.prototype.dispatchEvent = function (key, dataObj) {
		if (QuestionEventDispatcher.prototype.events.hasOwnProperty(key)) {
			dataObj = dataObj || {};
			dataObj.currentTarget = this;
			dataObj.type = key;
			for (var i in QuestionEventDispatcher.prototype.events[key]) {
				QuestionEventDispatcher.prototype.events[key][i](dataObj);
			}
		}
	};
	// end custom events
	return{
		
		
		getObj:function()
		{
			return htmlData;
		},
		
		addCanvas:function()
		{
			 constructCanvas();
		},
		addButttonEvents:function()
		{
			addButttonEvents();
		}, 
		addBottomDiv:function()
		{
			constructBottomSection();
		}, 
		createArrow:function(dv0,dv1)
		{
			createArrow(dv0,dv1);
		},
		
		runStep:function(nID)
		{
			runStep(nID)
		},
		
		variables:variables,
		objects:objects,
		instructions:instructions,
		holder:holder,
		colObjects:aObjects,
		colVariables:aVariables,		
		
		startActivity:function()
		{
			startActivity();
		},
		disableActivity:function()
		{
			disableActivity();
		},
		autoPlayActivity:autoPlayActivity,
		// for custom events
		removeQuestionEventListener : function(key, func)
		{
			QuestionEventDispatcher.prototype.removeEventListener(key, func)
		},
		
		addQuestionEventListener : function(key, func)
		{
			QuestionEventDispatcher.prototype.addEventListener(key, func)
		},
		vInvalidAttemptCounter:vInvalidAttemptCounter
	}
}



var CollectionObject = function(data,num)
{
	var objData = data;

	var gridLeft = objData[0]
	var gridTop = objData[1]
	var vLeft = objData[0] * Const.gridX;
	var vTop = objData[1] * Const.gridY;
	var htmlData = "";
	var DRAW_ARROW = 'draw_arrow';
	var CHANGED = 'changed';
	var UPDATED = 'updated';
	var FOCUSED = 'focused';
	var vId;
	var aVarObj = new Array();
	var vLabel = '';
	var vDataLength =  objData.length;
	var vHeight
	var obs;
	var vNum = num;
	var oConnectedLeftObj = new Array();
	var oConnectedRightObj = new Array();
	var redCheck = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII='/>";
	function initialize()
	{
		 obs = new Events();
		 console.log("Object title>>> ",objData[2])
		if (objData[2] != "")
		{
			labelstr = "<span class='objectTitle'>"+objData[2]+"</span>"
			labelstr += "<div style='clear:both;'></div><div class='cObjSplitLine'></div>"
		}else{
			labelstr = "";
			//labelstr = "<span class='objectTitle'>"+objData[2]+"</span>"
			//labelstr += "<div style='clear:both;'></div><div class='cObjSplitLine'></div>"
		}
		vLabel = objData[2].replace(/[\])}[{(]/g,'');

		
		var lblStr = vNum+'_'+vLabel+'_'+gridLeft+'_'+gridTop;  // Assigning Unique Id for each Collection Object Div
		//vId = lblStr.replace(" ", "_").replace(".", "");
		vId = lblStr.replace(/\ /g, '_');
		vId = vId.replace(/\./g, '');
		
		//
		htmlData = jQuery('<div/>', {
			id: vId,
			type:'CollectionObject'
		}).html(labelstr)
		
		htmlData.addClass("cObject");
		htmlData.css('left',vLeft+5)
		htmlData.css('top',vTop+10)


		var tickSpan = $("<span class='crossMark'>"+redCheck+"</span>");
		tickSpan.appendTo(htmlData);

		//Code start to find dynamic height for collection object div
		var vDL = vDataLength - 3;     
		vHeight = 20 * vDL;
		
		var top = 12;
		
		var lbl = 0;
		for(var i = 3; i < vDataLength;i++)
		{	
			var left = 5;
			var label = objData[i];
			var answer = objData[i+1];
			var arrayElement = new VariableObject([top,left,label,answer], num, vId, lbl);
			arrayElement.Evts.addEventListener(arrayElement.CHANGED,handleVariableChanged);
			arrayElement.Evts.addEventListener(arrayElement.UPDATED,handleVariableUpdated);
			arrayElement.Evts.addEventListener(arrayElement.FOCUSED,handleObjectFocus);
			aVarObj.push(arrayElement);
			var arrayElementHtml = arrayElement.getObj(); 
			$(arrayElementHtml).css("position","relative");
			$(arrayElementHtml).css("display","block");
			$(arrayElementHtml).css("top","0");
			$(arrayElementHtml).css("left","0");
			$(arrayElementHtml).addClass("cObjVariable");
			$(arrayElementHtml).css('text-align',"right");
			
			if(i == 3 && labelstr == "")
			{
				$(arrayElementHtml).css("margin-top","0px");
			}
			else if(i == 3)
			{
				$(arrayElementHtml).css("margin-top","22px");
			}
			else
			{
				$(arrayElementHtml).css("margin-top","10px");
			}
			
			htmlData.append(arrayElementHtml);
			top = top + 7;
			i++;
			lbl++;
		}
	}

	function hitObjTestPointer(x,y){
		for(var o=0;o<aVarObj.length;o++)
		{
			var objInitX = $('#'+aVarObj[o].getID()).position().left + 
				Number($('#'+aVarObj[o].getID()).css('margin-left').split("px")[0]) + 
				$('#'+aVarObj[o].getID()).parent().position().left;

			var objInitY = $('#'+aVarObj[o].getID()).position().top + 
				Number($('#'+aVarObj[o].getID()).css('margin-top').split("px")[0]) + 
				$('#'+aVarObj[o].getID()).parent().position().top;

			var objMaxX = $('#'+aVarObj[o].getID()).position().left+
				Number($('#'+aVarObj[o].getID()).css('margin-left').split("px")[0])+
				$('#'+aVarObj[o].getID()).parent().position().left+
				$('#'+aVarObj[o].getID()).width();

			var objMaxY = $('#'+aVarObj[o].getID()).position().top+
				Number($('#'+aVarObj[o].getID()).css('margin-top').split("px")[0])+
				$('#'+aVarObj[o].getID()).parent().position().top+
				$('#'+aVarObj[o].getID()).height();

			
			if((x>=objInitX)&&(x<=objMaxX)&&(y>=objInitY)&&(y<=objMaxY))
			{
				return aVarObj[o];
			} 
		}
		return null;
	}

	// findObject return object matching with label
	function findObject(vSL){
		
		vSL = vSL.replace(/[\])}[{(]/g,'');

		for(var i=0;i<aVarObj.length;i++)
		{ 
			var varObjLabel = aVarObj[i].getLabel();
			if (varObjLabel == vSL)
			{
				return aVarObj[i];
			};
		}
	}
	
	function handleVariableChanged(observable, eventType, data)
	{
		obs.dispatchEvent(CHANGED, {'data':data.data, 'label':data.label,  'seq':data.seq, 'obj':data.obj});	
	}
	function handleVariableUpdated(observable, eventType, data)
	{
		obs.dispatchEvent(UPDATED, {'data':data.data, 'label':data.label,  'seq':data.seq, 'obj':data.obj});	
	}
	function handleObjectFocus(observable, eventType, data)
	{
		obs.dispatchEvent(FOCUSED, {'data':data.data, 'label':data.label,  'seq':data.seq, 'obj':data.obj});	
	}
	initialize();

	return{
		getObj:function()
		{
			return htmlData;
		},
		getCollectionObj:function(id)
		{
			return aVarObj[id];
		},
		getCollectionVariableObjs:function()
		{
			return aVarObj;
		},
		getID:function(){
			return vId;
		},
		getType:function()
		{
			return 'collectionObject'
		},
		getLabel:function(){
			var vLbl = vLabel.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
			return vLbl;
		},
		getUniqueLabel:function(){
			return (vNum+'_'+vLabel+'_'+(vLeft/Const.gridX)+'_'+(vTop/Const.gridY)).replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");

		},
		Evts:obs,
		CHANGED:CHANGED,
		UPDATED:UPDATED,
		FOCUSED:FOCUSED,
		DRAW_ARROW:DRAW_ARROW,
		getObjDiv:function(x,y)
		{
			return hitObjTestPointer(x,y)
		},
		getLabelObj:function(vSL)
		{
			return findObject(vSL)
		},	
		getTopPos:function()
		{
			return vTop;
		},
		getHeight:function()
		{
			return vHeight;
		},
		populateInitialData:function()
		{
			for(var i = 3; i < objData.length;i++){
				
				if (objData[i+1] != null){
					if (typeof(objData[i+1]) != 'object')
					{
						for(var v = 0; v < aVarObj.length;v++){
							if (objData[i] == aVarObj[v].getVariableLabel()){
								aVarObj[v].setValue(objData[i+1]);
								break;
							}
						}
					}else{
						for(var v = 0; v < aVarObj.length;v++){
							if (objData[i] == aVarObj[v].getVariableLabel()){
								obs.dispatchEvent(DRAW_ARROW, {'initialObj':aVarObj[v], 'targetObj':objData[i+1]});
							}
						}
					}
				}
				i++
			}
		},
		resetObj:function()
		{
			htmlData.css('left',vLeft + 5);
			htmlData.css('top',vTop + 10);
			for (v=0;v<aVarObj.length;v++){
				aVarObj[v].resetObj();
				var arrayElementHtml = aVarObj[v].getObj(); 
				$(arrayElementHtml).css("position","relative");
				$(arrayElementHtml).css("display","block");
				$(arrayElementHtml).css("top","0");
				$(arrayElementHtml).css("left","0");
			}
			oConnectedLeftObj = [];
			oConnectedRightObj = [];
			$(htmlData).find(".crossMark").hide();
		},

		setConnectionObj:function(obj)
		{
			if (obj.direction == "left")
				oConnectedLeftObj.push(obj);
			else
				oConnectedRightObj.push(obj);
		},
		
		removeConnectionObj:function(obj)
		{
			var itemRemoved = false;
			var tempArr = [];
			for (r=0;r<oConnectedLeftObj.length;r++){
				if (obj.shape == oConnectedLeftObj[r].shape && obj.arrow == oConnectedLeftObj[r].arrow)
				{
					itemRemoved = true;
				}else{
					tempArr.push(oConnectedLeftObj[r]);
				}
			}
			oConnectedLeftObj = tempArr;

			var tempArr = [];
			if (!itemRemoved){
				for (r=0;r<oConnectedRightObj.length;r++){
					if (obj.shape == oConnectedRightObj[r].shape && obj.arrow == oConnectedRightObj[r].arrow)
					{
					}else{
						tempArr.push(oConnectedRightObj[r]);
					}
				}
			}
			oConnectedRightObj = tempArr;
		},
		
		getConnectionObj:function(direction)
		{
			if (direction == "left"){
				return oConnectedLeftObj;
			}
			else if (direction == "right"){
				return oConnectedRightObj;
			}
			else if (direction == "all"){
				var variableConnectedObjs = [];
				for (v=0;v<aVarObj.length;v++){
					var vobjsConn = aVarObj[v].getConnectionObj("all");
					if (vobjsConn.length > 0){
						for (vc=0;vc<vobjsConn.length;vc++){
							variableConnectedObjs.push(vobjsConn[vc])
						}
					}
				}
				return $.merge($.merge(oConnectedLeftObj,oConnectedRightObj),variableConnectedObjs)
			}

		},
		showIncorrectMark:function(){
			$(htmlData).find(".crossMark").show();
		},
		hideIncorrectMark:function(){
			$(htmlData).find(".crossMark").hide();
		}
	}
}


var VariableObject = function(data,num,pId,seq)
{
	var VALUE_CHANGED = 'VALUE_CHANGED';
	var objData = data;
	var htmlData = "";
	var CHANGED = 'changed';
	var UPDATED = 'updated';
	var FOCUSED = 'focused';
	var DRAW_ARROW = 'draw_arrow';
	var vLabel = ''
	var variableLabel
	var obs;
	var vId
	var vNum = num;
	var vLeft =  objData[0];
	var vTop =  objData[1];
	var vHeight = 42;
	var sequenceNum = seq;
	var oConnectedLeftObj = new Array();
	var oConnectedRightObj = new Array();
	var sNewDataValue = null;
	var inputField;
	var redCheck = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII='/>";
	function initialize()
	{
		variableLabel = objData[2];
		
		vLabel = variableLabel.replace(/[\])}[{(]/g,'');
				
		var answer = objData[3];
		
		obs = new Events();

		var lblStr = vNum + "_" + vLabel +'_'+vLeft+'_'+ vTop;// Create a unique id name for each div 
		vId = lblStr.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
		if(pId!=undefined)
		{
			vId+='_'+pId;
		}
		htmlData = jQuery('<div/>', {
			id: vId,
			type:'VariableObject'
		}).html(variableLabel + " = ")
		
		htmlData.css('position','absolute');
		htmlData.css('left', vLeft * Const.gridX+5);
		htmlData.css('top', vTop * Const.gridY + 10);
		htmlData.css('white-space', "nowrap");

		inputField = jQuery('<input/>',{
			type:'text',
			seq:sequenceNum,
			qId:vNum,
			class:vNum  //--- To empty field on reset question
		}).appendTo(htmlData);
		
		$(htmlData).addClass("variableContent")
		
		var tickSpan = $("<span class='mark'>"+redCheck+"</span>");
		tickSpan.appendTo(htmlData);
		inputField.bind('keydown', onInputKeyDown);
		inputField.bind('keyup', onInputChanged); // binding keyup event to each input
		inputField.bind('blur', onInputFocusOut);  // binding blur event to each input
		inputField.bind('focus', onInputFocus);  // binding focus event to each input
		inputField.bind('click', onInputFocus);
	}
	
	function onInputKeyDown(e)
	{
		e = e || window.event;
		if (typeof e.stopPropagation != "undefined") {
	        e.stopPropagation();
	    } else {
	        e.cancelBubble = true;
	    }
	}

	function onInputChanged(e)
	{
		e = e || window.event;
		if (typeof e.stopPropagation != "undefined") {
	        e.stopPropagation();
	    } else {
	        e.cancelBubble = true;
	    }

		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
		{
			//--- If Return key
			obs.dispatchEvent(CHANGED, {'data':$(this).val(), 'label':objData[2], 'seq':$(this).attr('seq'), 'obj':htmlData});	
		}else if (code == 9 || code == 16 || code == 17 || code == 18){
		}else{
			obs.dispatchEvent(UPDATED, {'data':$(this).val(), 'label':objData[2], 'seq':$(this).attr('seq'), 'obj':htmlData});	
		}
//		console.log("onInputChanged")
	}
	
	function onInputFocusOut(e)
	{
		
		obs.dispatchEvent(CHANGED, {'data':$(this).val(), 'label':objData[2], 'seq':$(this).attr('seq'), 'obj':htmlData});	
	}

	function onInputFocus(e)
	{
		
		obs.dispatchEvent(FOCUSED, {'data':$(this).val(), 'label':objData[2], 'seq':$(this).attr('seq'), 'obj':htmlData});	
	}

	initialize();
	// end custom events
	
	return{
		// Returning html div
		getObj:function()  
		{
			return htmlData;
		},		
		// Return Id
		getID:function()
		{
			return vId;
		},
		getVariableLabel:function(){
			return variableLabel;
		},
		setValue:function(val){
			htmlData.find("input").val(val);
		},
		getValue:function(val){
			return htmlData.find("input").val();
		},
		// Return Variable Object Label
		getLabel:function(){
			var vLbl = vLabel.replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
			return vLbl;
		},
		// Reurtn Variable Object Unique
		getUniqueLabel:function(){
			return (vNum+"_"+vLabel+'_'+(vLeft)+'_'+(vTop)).replace(/\ /g, '_').replace(/\./g, '');//.replace(" ", "_").replace(".", "");
		},
		// Return Label for Autofill
		getLabelForAutoFill:function(){
			return vNum + "_" + vLabel+'_'+(vLeft)+'_'+(vTop);
		},

		vLabel:vLabel,
		
		Evts:obs,
		
		CHANGED:CHANGED,
		UPDATED:UPDATED,
		FOCUSED:FOCUSED,
		DRAW_ARROW:DRAW_ARROW,

		getTopPos:function()
		{
			return vTop * Const.gridY;
		},
		getType:function()
		{
			return 'variableObject'
		},
		getHeight:function()
		{
			return vHeight;
		},
		populateInitialData:function()
		{
			
			if (typeof(objData[3]) != 'object')
			{
				htmlData.find('input').val(objData[3]);
			}else{
				if (objData[3] != null)
					obs.dispatchEvent(DRAW_ARROW, {'initialObj':htmlData, 'targetObj':objData[3]});
			}

			sNewDataValue = null;
		},
		resetObj:function()
		{
			$(htmlData).find("input").removeClass("hc-example-incorrect");
			$(htmlData).find("input").removeClass("hc-example-correct");
			htmlData.css('left', vLeft * Const.gridX + 5);
			htmlData.css('top', vTop * Const.gridY + 10);
			$(htmlData).find("input").attr('readonly',true);

			oConnectedLeftObj = [];
			oConnectedRightObj = [];
			//
			$(htmlData).find(".mark").hide();
			//
			sNewDataValue = null;


			//

			if (typeof(objData[3]) != 'object')
			{
				htmlData.find('input').val(objData[3]);
			}
			
		},
		
		setObjDataValue:function(val)
		{
			sNewDataValue = val;
		},

		getObjDataValue:function()
		{
			if (sNewDataValue != null){
				return sNewDataValue;
			}else if (typeof(objData[3]) != 'object')
			{
				return objData[3];
			}else{
				return "";
			}
		},
		resetObjData:function()
		{
			if (typeof(objData[3]) != 'object')
			{
				htmlData.find('input').val(objData[3]);
			}
		},
		setConnectionObj:function(obj)
		{
			if (obj.direction == "left")
				oConnectedLeftObj.push(obj);
			else
				oConnectedRightObj.push(obj);
		},
		removeConnectionObj:function(obj)
		{
			var itemRemoved = false;
			var tempArr = [];
			for (r=0;r<oConnectedLeftObj.length;r++){
				if (obj.shape == oConnectedLeftObj[r].shape && obj.arrow == oConnectedLeftObj[r].arrow)
				{
					itemRemoved = true;
				}else{
					tempArr.push(oConnectedLeftObj[r]);
				}
			}
			oConnectedLeftObj = tempArr;

			var tempArr = [];
			if (!itemRemoved){
				for (r=0;r<oConnectedRightObj.length;r++){
					if (obj.shape == oConnectedRightObj[r].shape && obj.arrow == oConnectedRightObj[r].arrow)
					{
					}else{
						tempArr.push(oConnectedRightObj[r]);
					}
				}
			}
			oConnectedRightObj = tempArr;
		},
		getConnectionObj:function(direction)
		{
			if (direction == "left"){
				return oConnectedLeftObj;
			}
			else if (direction == "right"){
				return oConnectedRightObj;
			}
			else if (direction == "all"){
				return $.merge(oConnectedLeftObj,oConnectedRightObj)
			}
		},
		showIncorrectMark:function(){
			$(htmlData).find(".mark").show();
		},
		hideIncorrectMark:function(){
			$(htmlData).find(".mark").hide();
		}
	}
}


var horstmann_objectdiagram;

(function(app){
	
	app.setup = new Array();
	var aQuestions = new Array();
	var pendingOdHiddenApps;
	app.aQuestions = aQuestions;
	
	
	$(document).ready(function()
	{
		//---Dynamically create dymmy div for font size initialization
		$('body').append('<div id="fontTest" class="hc-grid" style="visibility:hidden">A0</div>');		
		setTimeout(initializeObjectDiagram,500);
	});

	function initializeObjectDiagram()
	{

		//
		i=0;
		pendingOdHiddenApps = new Array();
		var hiddenWrapper, thisObjWrapper;
		$('.horstmann_objectdiagram').each(function()
		{
			//Add vst-draggable
			if (!$(this).hasClass("vst-draggable"))
			{
				$(this).addClass("vst-draggable").addClass("vstdonthighlight");
			}
			//---Prechek if any of the parent wrapper is hidden
			var hiddenWrapper = null;
			var thisObjWrapper = $(this).parent();
			while ((thisObjWrapper[0].nodeName).toLowerCase() != "body")
			{
				if (thisObjWrapper.css("display") == "none")
				{
					hiddenWrapper = thisObjWrapper;
					break;
				}else{
					thisObjWrapper = thisObjWrapper.parent();
				}
			}
			//
			$(this).attr("id","horstmann_objectdiagram_"+(i+1));
			//
			if (hiddenWrapper == null)
			{
				var oQuestion = new Question(app.setup[i],$(this),i)
				aQuestions.push(oQuestion)
				$(this).append(oQuestion.getObj());	
				oQuestion.addCanvas();
				oQuestion.addBottomDiv();
				oQuestion.addButttonEvents();
			}else{
				pendingOdHiddenApps.push({i:i, obj:$(this)});
			}
			i++;
		});
		//---Remove dynamically created div after initialization
		$("#fontTest").remove();
		//$("#fontTest").hide();
		//
		$('.content001').on('objectShown',initializeHiddenObjectDiagramHold);
	}

	function initializeHiddenObjectDiagramHold(){
		//---Dynamically create dymmy div for font size initialization
		$('body').append('<div id="fontTest" class="hc-grid" style="visibility:hidden">A0</div>');

		setTimeout(function(){
			initializeHiddenObjectDiagram();

		},500)		
	}
	function initializeHiddenObjectDiagram()
	{

		for (h=0;h<pendingOdHiddenApps.length;h++)
		{
			dataObj = pendingOdHiddenApps[h];
//			console.log("dataObj",dataObj)
			i = dataObj.i;
			var oQuestion = new Question(app.setup[i],$(dataObj.obj),i)
			aQuestions.push(oQuestion)
			$(dataObj.obj).append(oQuestion.getObj());	
			oQuestion.addCanvas();
			oQuestion.addBottomDiv();
			oQuestion.addButttonEvents();
		}
		//---Remove dynamically created div after initialization
		$("#fontTest").remove();
		//
		$('.content001').off('objectShown',initializeHiddenObjectDiagramHold);
	}
	
})(horstmann_objectdiagram=horstmann_objectdiagram||{})

/***************************************************************
*
*   Events
*
***************************************************************/
var Events;
(Events = function() {
}).prototype = {
	addEventListener: function(type, method, scope, context) {
		var listeners, handlers, scope;
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
	removeEventListener: function(type, method, scope, context) {
		delete this.listeners[type]
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
			if (handler.method.call(
				handler.scope, this, type, data
			)===false) {
				return false;
			}
		}
		return true;
	}
};
