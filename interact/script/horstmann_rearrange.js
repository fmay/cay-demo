(function(rearrange_player)
{
//	rearrange_player.hmText = new Gettext({ domain : 'horstmannDomain', locale_data : horstmann_data});
	var currentCode;
var rev=false;
var noofAnimations=1;
var animation=1;

var setupArray=[];

var currentAnimation=1;
var holder=null;
var parentContainer="";
var draggableOptions="";
var droplocation=0;
var dragID=0;
var updateholder=0;

var currheight=0;
var optionsText = [];

var tempAnswerArray=[];
var sub_tempAnswerArray=[];
var maximumTry=2;
var noOftryArray=[];
rearrange_player.currentAttempt = 0

var dropLocation="";

var prevMargin=prevDroplocation=0;
var itemSorted;
var sections="";
var distracterLineAdded = false;
var hiddenRearrangeActivities = [];
var activitiesGenerated = false;
var generatePendingActivities = false;
var goodJob = '<div class="goodjob hc-good"><div align="center"><a class="closePopup" href="javascript:void(0)" onClick="" style=""><img src="images/X.png" /></a></div><p><img src="images/check_mark.png" style="vertical-align:middle;margin-right:20px"/>'+gt.gettext("Good job")+'</p></div>';

var loading = '<div class="loading"><div align="center"><p><img src="images/loading.gif" style="vertical-align:middle;margin-right:20px"/></p></div</div>';

var greenCheck = "<img src='images/close_green.png'/>";
var redCheck = "<img style='width:23px; height:27px' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII='/>";

var dropSection = '<div class="drop-section" ><div style="" class="dummyLevels"><div style=""></div><div style=""></div><div style=""></div><div style=""></div></div><div class="itemDropable"><div class="placeholder"><span class="mark"></span></div></div></div>'
var timerArrayRe=[];

Array.prototype.unique =
function() {
var a = [];
var l = this.length;
for(var i=0; i<l; i++) {
  for(var j=i+1; j<l; j++) {
    // If this[i] is found later in the array
    if (this[i] === this[j])
      j = ++i;
  }
  a.push(this[i]);
}
return a;
};
function updateActivityHeight()
{
	console.log("upde 2")
	//setTimeout(function(){
	dragSection=$("#"+currentCode+" .section-2");
	dropSection=$("#"+currentCode+" .drop-section");

	totalHeight=0;
	$("#"+currentCode+" .section-2").children("div").each(function(){
		totalHeight=totalHeight+$(this).height();
	});
	
	console.log("totalHeight = ",totalHeight,dropSection.height())

	//totalHeight = (totalHeight > dropSection.height())?totalHeight:dropSection.height();
	if(dragSection.height() > dropSection.height()){
		dragSection.addClass("section-2-border");
		console.log("drag height");
		dropSection.removeClass("section-1-border");

		$("#"+currentCode+" .drop-section .dummyLevels div").css('height', (dragSection.height()+20)+"px");
	}else
	{
		dropSection.addClass("section-1-border");
		console.log("drop height");


		dragSection.removeClass("section-2-border");

		$("#"+currentCode+" .drop-section .dummyLevels div").css('height', (dropSection.height()+10)+"px");
	}
	//dragSection.css('min-height',totalHeight);

	//},0);

}
function initializeVitalsourceData(element, divObj)
{
	
	var maxScoreCount = 0;
 	for (i=0;i<divObj.length;i++)
	{
		charSymbol = divObj[i].slice(0,1)
		if (charSymbol != "+" && charSymbol != "^" && charSymbol != "-")
			maxScoreCount++;
	}
	element.maxscore = maxScoreCount;
    element.correct = 0;
   	element.errors = 0;
}

$(document).ready(function(){
	if (!$('.content001').is(":visible") || $('.content001').length > 0)
	{
		$('.content001').on('objectShown',wrapperDisplayed);
	}

	initializeRearrange();
});

function wrapperDisplayed()
{
	generatePendingActivities = true;
	chkForPendingRearrange()
}

function chkForPendingRearrange()
{
	if (activitiesGenerated && generatePendingActivities)
	{
		initializePendingRearrange();
	}
}
function initializePendingRearrange()
{
	for (r=0;r<hiddenRearrangeActivities.length;r++)
	{
		animation = hiddenRearrangeActivities[r]+1;
		currentCode="rearrangecode-"+animation;
		updateActivityHeight();
	}
	$('.content001').off('objectShown',wrapperDisplayed);
}

function initializeRearrange()
{
	hiddenRearrangeActivities = [];

	rearrange_player.preSectionClass = new Array();
	noofAnimations = $(".horstmann_rearrange").size();

	setupArray.push({});	
	timerArrayRe.push(0);

	// Take data from pre and convert to div
	$(".horstmann_rearrange PRE").reformatPre();
	
	var divStr;
	
	$(".horstmann_rearrange").each(function(i,element)
	{
		var thisObjWrapper = $(this).parent();
		while ((thisObjWrapper[0].nodeName).toLowerCase() != "body")
		{
			if (thisObjWrapper.css("display") == "none")
			{
				hiddenRearrangeActivities.push(i);
				break;
			}else{
				thisObjWrapper = thisObjWrapper.parent();
			}
		}
		//--Add vstdonthighlight and vst-draggable
		$(this).append("<div class='vst-draggable vstdonthighlight'></div>");
	 	window['errorCount'+i] = 0;
	 	window['timerCount'+i] = i;

		var aCurrentArray = parsePre($($(this).children('pre')));

	 	initializeVitalsourceData(element,aCurrentArray);

		var classPre = $(this).children('pre').attr('class');
		horstmann_rearrangecode.preSectionClass.push(classPre);
		var oMasterDiv = document.createElement('div');
		oMasterDiv.setAttribute('class','section-2');
		var aDivData = new Array();

		for(var i=0;i<aCurrentArray.length;i++)
		{
			if(aCurrentArray[i]!=" " || aCurrentArray[i]==null || aCurrentArray[i]==undefined)
			{
				var oSubMaster = document.createElement('div')
				var preClassAddon;

				if (classPre == undefined){
					preClassAddon = "hc-code";
				}else{
					preClassAddon = classPre;
				}
			
				oSubMaster.setAttribute('class',preClassAddon + " hc-draggable");

				var txt = aCurrentArray[i].split("&amp;").join("&");
				
				var newTextNode = document.createTextNode(txt);
				oSubMaster.appendChild(newTextNode);
				aDivData.push(oSubMaster);
			}
		}
		
		for(var i=0;i<aDivData.length;i++)
		{
			oMasterDiv.appendChild(aDivData[i]);
		}

		$(this).find(".vst-draggable")[0].appendChild(oMasterDiv);
		
	 });

	$('.horstmann_rearrange PRE').remove();
	$('.horstmann_rearrange pre').remove();
	

	var ctr = 0;
    $(".horstmann_rearrange").each(function (index, element) {
		
		$(this).find(".vst-draggable").prepend(dropSection);
		++ctr;
		
		$(this).find(".vst-draggable").append("<div class='bottomDv hc-bottom'></div>")
        index = index + 1;
        $(this).attr("id", "rearrangecode-" + index);       
        currentCode = "rearrangecode-" + index;
       	var element = getElement($(this))[0];
		$("#" + currentCode).children(".vst-draggable").children(".bottomDv").append('<div class="errorfeedback hc-message hc-errors" id="errorfeedbackRe'+index+'"><span class="nooferrors">'+controller.errorCount(element)+'</span><span class="timespent"></span></div>')
		$("#" + currentCode).children(".vst-draggable").children(".bottomDv").append("<span class='hc-button hc-start' id='buttonRe"+index+"'>"+gt.gettext("Start over")+"</span>");
		$('#buttonRe'+index).css('display','none');
		$("#" + currentCode ).find(".vst-draggable").append("<span class='hc-button hc-step done' align='center'>"+gt.gettext("Done")+"</span>");

        noOftryArray.push(0);

        if (index == noofAnimations) {
            controller.initialise(1);
        }
//return false;
		$(this).find(".vst-draggable").prepend('<div id="instDvRe'+index+'" class="instructions hc-instructions hc-step"></div>');

		$("#instDvRe"+index).append('<div class="instructions1 hc-message">'+gt.gettext("Press start to begin.")+'</div>');
		$("#instDvRe"+index).append('<span class="hc-button hc-start" id="startbtnRe'+index+'">'+gt.gettext("start_button")+'</span>');
		$("#instDvRe"+index).append('<div id="warnMsgRe'+index+'" class="warningMsg hc-message hc-retry"></div>');
		$("#instDvRe"+index).append('<span class="hc-button hc-retry seeNextStep" >'+gt.gettext("next_step_button")+'</span>'+
			'<div class="goodjob"><img width="25" height="25" style="vertical-align:middle;position:absolute;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzMjRCMEREODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzMjRCMERFODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMyNEIwREI4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTMyNEIwREM4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5fkXkUAAAA+UlEQVR42mJM3ujOQA3ARKY+fiDOAeIVQCwKEmAhwxBdIN4CxHJAfBCIv5PjInsgPgw1pA+InYH4C6kuUoe6hAeIpwBxMTlhxAnEq6GGXEA3hBSDuqBhA/JGBBD/IscgGyDOhLKzgPgmOdHPBsRzgJgZiBdDMcF0xIxFvggayE+BuICYBAlKYA+B+DMQq0DFpIG4GslL74gxyBKqERQr85ECGMRfCcSbiM0iB6HOhwXuZCCOgsZSMSl5DZTMm5DEc6B0K5IFRGfauUB8B4l/B5oNSM79f6ExA6IfAXEQtoSHC6Dnta1ALA/EL6AGMpBrEAOxYYIOAAIMAHdiLpAopYgmAAAAAElFTkSuQmCC" /><span class="gJobText hc-message hc-good">'+gt.gettext("Good job")+'</span></div>'	
		);
    			   
		

		$(".horstmann_rearrange #buttonRe"+index).on("click touch",function(){				

			var buttonID = $(this).attr("id"); 	


			buttonID = buttonID.substring(8,buttonID.length);

			noOftryArray[buttonID]=0;

			$("#warnMsgRe"+buttonID).html("");
			$("#warnMsgRe"+buttonID).hide();
			horstmann_rearrangecode.currentAttempt = 0;

			
			$("#rearrangecode-"+buttonID+" .drop-section .itemDropable").find(".hc-tile").remove();
			
			$("#rearrangecode-"+buttonID+" .drop-section .itemDropable .mark").find("img").remove();
			
			 $("#rearrangecode-"+buttonID+" .section-2").children("div").each(function(){
				 if ($(this).attr("datasign") != "^")
					$(this).show();
				if ($(this).attr("actualdatasign") != undefined)
				{
					$(this).attr("datasign", $(this).attr("actualdatasign"));
				}
			 });
			 
			 $("#rearrangecode-"+buttonID+" .goodjob").hide();

			 controller.resetRearangecode(buttonID);

			 $("#rearrangecode-"+buttonID+" .instructions1").html(gt.gettext("Press start to begin."));
			 
//			 $("#rearrangecode-"+buttonID+" .drop-section .blockedItems").hide();
				if (isIE() < 9 && isIE()){
					$(".warningMsg").html(gt.gettext("browserwarning"));//gt.gettext("try_again_msg"));
					$(".warningMsg").css("float","none");
					$(".warningMsg").show();
				}
		});
	});	


	$(".horstmann_rearrange .done").on("click",function(){
		$("#warnMsgRe"+currentAnimation).html("");
		
		var curId = $(this).parent().parent().attr('id').substring(14,$(this).parent().parent().attr('id').length)
		controller.updateLiPositions();
		setTimeout(function(){
			checkAnswers(currentAnimation-1,curId);
		},100)
			
	});
	
	licnt=1;
	
	$(".horstmann_rearrange .seeNextStep").on("click",function(){
		
		var element = getElement($(this))[0];
		element.errors++;
		++window['errorCount'+(currentAnimation-1)];
		$("#errorfeedbackRe"+(currentAnimation)+" .nooferrors").html(controller.errorCount(element));

		$(this).hide();
		$("#warnMsgRe"+currentAnimation).html("");
		horstmann_rearrangecode.currentAttempt = 0;
		noOftryArray[currentAnimation]=0;
		noOfLi=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").size();

		

		var ansArray = tempAnswerArray[currentAnimation-1]
		
		totalLength=tempAnswerArray[currentAnimation-1].length;
	 	answerseq=1;
	  	currentLi=0;
	    dummyHolder=false;
	    blankContainer=false;
		currentOl=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable");
		
		
		//---Remove place holders
		currentOl.find(".dummy_placeholder").remove();
		currentOl.find(".placeholder").remove();
		
		var ans = null;
		var incorrectRemoved = false;
		if (currentOl.find(".hc-tile").length == 0)
		{
			//--Add first item if no item added
			answerseq=ansArray[0].answer;
			indentLevel=ansArray[0].level;
			
			if(indentLevel>0)	
				leftMargin=indentLevel*35;
			else
				leftMargin=indentLevel*35;
			
			var pixels=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").width()-leftMargin-50;
			var screenWidth = $("#rearrangecode-"+currentAnimation+" .drop-section").width();
			var width = 100-(( screenWidth - pixels ) / screenWidth)*100;
			

			var currTextHtml = "";
			
			if(answerseq.toString().indexOf("^|^")!=-1)
			{
				answerseq_split=answerseq.split("^|^");
				for (var i=0; i<answerseq_split.length; i++)
				{
					$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
					{
						if(cleanStr($(this).attr("sequnce"))==cleanStr(answerseq_split[i]) && $(this).css("display") != "none")
						{
							currTextHtml=$(this).html();
							datasign=$(this).attr("datasign");
							ans = answerseq_split[i];
							$(this).hide();
							return false;
						}
					});
					if (currTextHtml != "")
						break;
				}
			}else{

				$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
				{
					if(cleanStr($(this).attr("sequnce"))==cleanStr(answerseq) && $(this).css("display") != "none")
					{
						currTextHtml=$(this).html();
						datasign=$(this).attr("datasign");
						ans = answerseq;
						$(this).hide();
						return false;
					}
				});
			}
			var preClassAddon;
			if(horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1] == undefined){
				preClassAddon = "hc-code";
			}else{
				preClassAddon = horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1]
				
			}
			
			$("<div id='droppedItem_"+currentAnimation+"_"+(1)+"' datasign='"+datasign+"' indentLevel='"+indentLevel+"' animation='"+currentAnimation+"'></div>").attr("answer", ans).attr("useranswer",ans).html(currTextHtml).appendTo(currentOl).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"}).addClass("hc-draggable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>").attr("data-user-dropped","false").addClass("non-sortable").addClass("hc-example-correct").addClass("hc-tile");


			
		}else{
			//---Case multiple items
			//---Find first incorrect item at any location
			var incorrectAns = true;
			var incorrectLevel = false;
			var stepOptionFixed = false;


			$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").each(function(i){
				if ($(this).attr("datasign")=="-")
				{
					var curOlDiv = $(this);
					$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function(cursubI)
					{
						if (cleanStr(getAllDivsContent(curOlDiv)) == cleanStr($(this).attr("sequnce")) && $(this).css("display") == "none" && $(this).attr("datasign")=="-"){
							$(this).show();
							return false;
						}
					});

					curOlDiv.remove();
					incorrectRemoved = true;
					return false;
				}
			});

			$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").each(function(i){
				var curOlDiv = $(this);
				answerseq=(ansArray[i] != undefined)?ansArray[i].answer:null;

				if (answerseq == null){
					$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function(cursubI)
					{
						if (cleanStr(getAllDivsContent(curOlDiv)) == cleanStr($(this).attr("sequnce")) && $(this).css("display") == "none"){
							$(this).show();
							return false;
						}
					});
					$(this).remove();
					incorrectRemoved = true;
					return false;
				}else{
					indentLevel=ansArray[i].level;
					
					if(indentLevel>0)	
						leftMargin=indentLevel*35;
					else
						leftMargin=indentLevel*35;
					
					var pixels=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").width()-leftMargin-50;
					var screenWidth = $("#rearrangecode-"+currentAnimation+" .drop-section").width();
					width = 100-(( screenWidth - pixels ) / screenWidth)*100;
					//
					stepOptionFixed = false;
					incorrectLevel = false;
					if(answerseq.toString().indexOf("^|^")!=-1)
					{
						//--Case multiple answers
						var correctOptMissing = true;
						answerseq_split=answerseq.split("^|^");
						for (x=0; x<answerseq_split.length; x++)
						{
							if (cleanStr($(this).attr("useranswer")) == cleanStr(answerseq_split[x])){
								correctOptMissing = false;
								if ($(this).attr("indentLevel") != indentLevel){
									incorrectLevel = true;
									//---Fix indent
									$(this).attr("indentLevel", indentLevel);
									$(this).css("margin-left",leftMargin+"px");
									//$(this).css("width",width+"%");
									$(this).find(".mark img").remove();
									$(this).attr("data-user-dropped","false");
									$(this).removeClass("hc-example-incorrect").addClass("hc-draggable");
									stepOptionFixed = true;
									$(this).addClass("non-sortable").addClass("hc-example-correct");
								}
								break;
							}
						}
						
						if (correctOptMissing && !incorrectLevel){
							//---Find missing correct option
							var missingOpt = null;
							var isFound
							for (x=0; x<answerseq_split.length; x++)
							{
								isFound = false;
								$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").each(function(curI){
									if (curI >= (i - answerseq_split.length)){
										if (curI < i){
											if (cleanStr($(this).attr("useranswer")) == cleanStr(answerseq_split[x])){
												isFound = true;
												return false;
											}
										}else{
											//---Remove if found at incorrect location ahead
											if (cleanStr($(this).attr("useranswer")) == cleanStr(answerseq_split[x])){
												//---Reset section 2 div
												$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function(cursubI)
												{
													if (cleanStr(answerseq_split[x]) == cleanStr($(this).attr("sequnce")) && $(this).css("display") == "none"){
														$(this).show();
														return false;
													}
												});
												$(this).remove();
												isFound = false;
												return false;
											}
										}
									}
								});
								if (!isFound){
									missingOpt = answerseq_split[x];
									break;
								}
							}
							//---Reset section 2 div
							$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
							{
								if (cleanStr(getAllDivsContent(curOlDiv)) == cleanStr($.trim(getAllDivsContent($(this)))) && $(this).css("display") == "none"){
									$(this).show();
									return false;
								}
							});
							//
							$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
							{
								
								
								if (cleanStr($.trim(getAllDivsContent($(this)))) == cleanStr(missingOpt) && $(this).css("display") != "none"){
									
									ans = missingOpt
									curOlDiv.attr("indentLevel", indentLevel);
									curOlDiv.attr("answer", missingOpt);
									curOlDiv.attr("useranswer",missingOpt);
									curOlDiv.attr("datasign",$(this).attr("datasign"));

									curOlDiv.attr("data-user-dropped","false");
									
									$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
									{
										if (cleanStr($.trim(getAllDivsContent($(this)))) == cleanStr(missingOpt))
										{
											curOlDiv.html($(this).html());
										}
									});
									//curOlDiv.text(missingOpt);
									curOlDiv.css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"});
									curOlDiv.removeClass("hc-example-incorrect").addClass("hc-draggable");

									curOlDiv.addClass("non-sortable").addClass("hc-example-correct");

									$(this).hide();
									stepOptionFixed = true;
									return false;
								}
							});
						}
					}else{
						
						//--Case single answer
						if (cleanStr($(this).attr("useranswer")) == cleanStr(answerseq)){
							if ($(this).attr("indentLevel") != indentLevel){
								incorrectLevel = true;
								//---Fix indent
								$(this).attr("indentLevel", indentLevel);
								$(this).css("margin-left",leftMargin+"px");
								//$(this).css("width",width+"%");
								$(this).find(".mark img").remove();
								$(this).attr("data-user-dropped","false");
								$(this).removeClass("hc-example-incorrect").addClass("hc-draggable");
								stepOptionFixed = true;
								$(this).addClass("non-sortable").addClass("hc-example-correct");
							}
						}
	
						if (cleanStr($(this).attr("useranswer")) != cleanStr(answerseq) && !incorrectLevel){
							//---Remove section 1 wrong div-- Remove item if available below
							$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").each(function(curI)
							{
								if (curI >= i){
									
									if (cleanStr(answerseq) == cleanStr($.trim(getAllDivsContent($(this))))){
										
										//---Reset section 2 div
										$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
										{
											if (cleanStr(answerseq) == cleanStr($.trim(getAllDivsContent($(this)))) && $(this).css("display") == "none"){
												$(this).show();
												return false;
											}
										});
										$(this).remove();
										return false;
									}
								}
							});
							//-----------------------------------
							//---Reset current ol div in section 2
							var olTxt = getAllDivsContent($(this))
							$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
							{
								if (cleanStr($.trim(olTxt)) == cleanStr($(this).attr("sequnce")) && $(this).css("display") == "none"){
									$(this).show();
									return false;
								}
							});
							$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
							{
								//---Find div in section 2
								if (cleanStr($(this).attr("sequnce")) == cleanStr(answerseq) && $(this).css("display") != "none"){
									ans = answerseq;
									curOlDiv.attr("indentLevel", indentLevel);
									curOlDiv.attr("answer", answerseq);
									curOlDiv.attr("useranswer",answerseq);
									curOlDiv.attr("datasign",$(this).attr("datasign"));
									
									
									curOlDiv.html($(this).html());
									curOlDiv.css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"});
									curOlDiv.removeClass("hc-example-incorrect").addClass("hc-draggable");

									curOlDiv.addClass("non-sortable").addClass("hc-example-correct");

									curOlDiv.attr("data-user-dropped","false");

									$(this).hide();
									stepOptionFixed = true;
									return false;
								}
							});
						}
					}
					
					if (ans != null || incorrectLevel || stepOptionFixed){
						return false;
					}
				}
			});
			datasign = undefined;
			currTextHtml = undefined;
			if (ans == null && !incorrectLevel && !stepOptionFixed && !incorrectRemoved){
				noOfLi=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").size();
				
				answerseq=ansArray[noOfLi].answer;
				indentLevel=ansArray[noOfLi].level;
				
				if(indentLevel>0)	
					leftMargin=indentLevel*35;
				else
					leftMargin=indentLevel*35;
				
				var pixels=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").width()-leftMargin-50;
				var screenWidth = $("#rearrangecode-"+currentAnimation+" .drop-section").width();
				width = 100-(( screenWidth - pixels ) / screenWidth)*100;

				if(answerseq.toString().indexOf("^|^")!=-1)
				{
					answerseq_split=answerseq.split("^|^");
					var optionFound = false;
					var totalLi = $("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").length;
					for (x=0; x<answerseq_split.length; x++)
					{
						optionFound = false;
						$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").each(function(curI)
						{
							if (curI>=(totalLi - answerseq_split.length)){
								if (cleanStr($(this).attr("useranswer")) == cleanStr(answerseq_split[x])){
									optionFound = true
									return false;
								}
							}
						});
						
						if (!optionFound){
							ans = answerseq_split[x];
							break;
						}
					}
				}
				else
				{
					ans = answerseq;
				}

				$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
				{
					
					if(cleanStr($(this).attr("sequnce"))==cleanStr(ans) && $(this).css("display") != "none" && $(this).attr("datasign") != "-")
					{
						currTextHtml=$(this).html();
						datasign=$(this).attr("datasign");
						$(this).hide();
						return false;
					}
				});
				
				var preClassAddon;
				if(horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1] == undefined){
					preClassAddon = "hc-code";
				}else{
					preClassAddon = horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1]
					
				}
				
				$("<div id='droppedItem_"+currentAnimation+"_"+(1)+"' datasign='"+datasign+"' indentLevel='"+indentLevel+"' animation='"+currentAnimation+"'></div>").attr("answer", ans).attr("useranswer",ans).html(currTextHtml).appendTo(currentOl).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"}).addClass("hc-draggable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>").attr("data-user-dropped","false").addClass("non-sortable").addClass("hc-example-correct").addClass("hc-tile");
			}
		}
		
		currentOl.append("<div class='dummy_placeholder'><span class='mark'></span></div>");
	});
	
	
}


function parsePre(preTag)
{
			
	var preLines = preTag.text().split("\n");
	
	formattedPreLines=[];
	for(var i=0;i<preLines.length;i++)
	{
		trimmedValue=$.trim(preLines[i]);
		if (trimmedValue.length > 0) {
			
			
			if (trimmedValue.indexOf("&")!=-1){
				trimmedValue = trimmedValue.split("&").join("&amp;");
			}
			
		   formattedPreLines.push(trimmedValue);
		}
	}
	
	return formattedPreLines.filter(function(n){return n}); // to remove empty data from array
}


var controller = {
	errorCount:function(element) {

		var cor = (element.correct == undefined)?0:element.correct;
		var err = (element.errors == undefined)?0:element.errors;

		return gt.strargs(
        gt.ngettext('One correct', '%1 correct', cor),
        cor) + ', ' + gt.strargs(
        gt.ngettext('One error', '%1 errors', err),
        err)
	},
	
	//Initialize the Animations
	initialise: function(i) {
		animation=i;
		//
		isHidden = false;
		for (r=0;r<hiddenRearrangeActivities.length;r++)
		{
			if (i == hiddenRearrangeActivities[r])
			{
				isHidden = true;
				break;
			}
		}
		if (!isHidden)
		{
			if (animation < noofAnimations){
				//controller.initialise(animation+1);
			}

			//return false;
		}
		

		optionsText[animation] = [];
		answerArray=[];
		indentingLevelArr=[];
		currentCode="rearrangecode-"+animation;
		
		timerArrayRe[animation]=0;
		noOftryArray.push(0)
		var innerArray = new Array();

		dragSection=$("#"+currentCode+" .section-2");
		dropSection=$("#"+currentCode+" .section-1");
		totalHeight=0;
		

		
		$("#"+currentCode+" .section-2").children("div").each(function(){
			totalHeight=totalHeight+$(this).height()+42;			  
		});
		
		indentingLevel="";
		
		//Start Traversing the walkthroughs
		
		setTimeout(function(){
			
		
						$(".horstmann_rearrange #startbtnRe"+animation).unbind("click").on("click touch",function(){
							
							var date = new Date();
							startTime = date.getTime();
							currentAnimation=$(this).parent().parent().parent().attr("id").split("-")[1];
							
							timerArrayRe[currentAnimation]=startTime;
							var buttonID = $(this).attr("id"); 				
							buttonID = buttonID.substring(10,buttonID.length);				
							$(this).hide();
							$("#warnMsgRe"+currentAnimation).show()
							$("#buttonRe"+buttonID).css("display","inline-block");
							$("#errorfeedbackRe"+buttonID).css("display","block");
							controller.start(buttonID);
//							$("#rearrangecode-"+buttonID+" .drop-section .blockedItems").show();
						});
						
						
						//$("#"+currentCode).css("min-height",(totalHeight-255)+"px");
						//$("#"+currentCode).children(".bottomDv").css("top",totalHeight-45+"px")
						answerString=""
						len=dragSection.children("div").size();
						var dotIndex = 0;
						var combineDataArray = [];
						var skippedFixedLines = 0;//--Added to remove fixed lines count from dot index value.
						var skippedNRLines = [];

						
						var prevLineIndentLevel = 0
						var inGrpIndent = 0;
						var inGrpLinesArray = new Array();
						var indentingArrIndex = 0;
						var answerArrayIndex = 0;
						var totalDivChildren = dragSection.children("div").length;
						dragSection.children("div").each(function(index){
							
							optionsText[animation].push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
							
							currCharacter=($(this).html()).charAt(0);
							
							if(currCharacter.toString()=="."){
								distracterLineAdded = false;
								combineDataArray = null;
								combineDataArray = [];
								
								//answerArray.push((index+1));
								answerArray.push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
								combineDataArray.push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
								//--Remove fixed lines count and point to index
								dotIndex = index;//-skippedFixedLines;
							}
								
							else if(currCharacter.toString()==","){
								
								//answerArray.push((index+1));
								//
								//
								//answerArray[answerArrayIndex]
								answerArray.push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
								combineDataArray.push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));

								
								for (var di=dotIndex; di<=index; di++){
									
									var skipLine = false;
									for (s=0;s<skippedNRLines.length;s++){
										if (di == skippedNRLines[s])
											skipLine = true;
									}
									if (!skipLine){
										answerArray[(di)] = combineDataArray.join("^|^");
									}
								}
								
							}
							else if(currCharacter.toString()=="^"){
								++skippedFixedLines;//--Increment fixed lines count
								combineDataArray = null;
								combineDataArray = [];
								dotIndex = index;
								answerArray.push("");
								combineDataArray.push($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
							}
							else if(currCharacter.toString()=="-"){
								distracterLineAdded = true;
								answerArray.push("");
								skippedNRLines.push(index);
							}else if(currCharacter.toString()=="+"){
								answerArray.push("");
								skippedNRLines.push(index);
							}
							
							
							//---Removed code to block indent lever for fixed lines...
							// && currCharacter.toString()!="^" && currCharacter.toString()!="+"
							//---Add above condition to the below check...
							if(currCharacter.toString()!="-"){
								indentingLevel=($(this).html()).slice(1).split(/[^ \t\r\n]/)[0].length;

								if(currCharacter.toString()!="^" && currCharacter.toString()!="+")
									indentingLevelArr.push(indentingLevel);
							}
							
							var divContent = $.trim(($(this).html()).slice(1));
							//--11/04: To word-wrap from white space. Now working because of following replacement.
							//divContent = String(divContent).split(" ").join("&#160;");
							
							

							if(currCharacter.toString()=="+"){
								addedDiv = addDivContent(prevDivObj, divContent, "append",0);
								minDivLevel = (minDivLevel < indentingLevel)?minDivLevel:indentingLevel;

								inGrpLinesArray.push({"div":addedDiv, "indent":indentingLevel});

								if (!distracterLineAdded)
								{
								answerArray[answerArrayIndex] = answerArray[answerArrayIndex] + "-*-" + ($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));

								combineDataArray[combineDataArray.length-1] = answerArray[answerArrayIndex];

								//combineDataArray[answerArrayIndex] = answerArray[answerArrayIndex] + "-*-" + ($.trim(getDivContent($(this)).replace(/[.,-^+]/,'')));
								
								ansArrSplit = answerArray[answerArrayIndex].split("^|^");


								$(prevDivObj).attr("sequnce", ansArrSplit[ansArrSplit.length-1]);
								}
							}

							if(currCharacter.toString()!="+" || totalDivChildren == index+1){
								//--Arrange previous group indent
								if (inGrpLinesArray.length>0)
								{
									
									var newIndentLevel=0;
									var startLineIndentLevel = 0;
									var indentReduced = 0;
									for (i=0;i<inGrpLinesArray.length;i++)
									{
										if (startDivLevel > inGrpLinesArray[i].indent)
										{
											diff = startDivLevel - inGrpLinesArray[i].indent
											newIndentLevel = startDivLevel - diff;
											
										}
										var thisObj = $(inGrpLinesArray[i].div);
										var diff = inGrpLinesArray[i].indent - minDivLevel;
										diffLeftMargin=(diff*35);
										diffLeftMargin = (diffLeftMargin<30)?0:diffLeftMargin;
										
										//
										newLeftPos = Number(thisObj.css("padding-left").split("px")[0])+diffLeftMargin;
										thisObj.css("padding-left",newLeftPos + "px");

										
									}
									inGrpLinesArray = []
									indentingLevelArr[indentingArrIndex] = minDivLevel;
								}
							}

							if(currCharacter.toString()!="+"){
								addedDiv = addDivContent($(this), divContent, "add");
								indentingArrIndex = indentingLevelArr.length-1;
								answerArrayIndex = answerArray.length-1;
								prevDivObj = $(this);
								//
								if(currCharacter.toString()=="."){
									minDivLevel = indentingLevel;
									maxDivLevel = indentingLevel;
									startDivLevel = indentingLevel;
									inGrpLinesArray = [];
									inGrpLinesArray.push({"div":addedDiv, "indent":indentingLevel});
								}
							}

							$(this).addClass("dragDiv").attr("holder",0).attr("dropLocation",0).attr("sequnceId",(index+1)).attr("sequnce",($.trim(getDivContent($(this))))).attr("datasign",currCharacter).attr("animation",animation);
							
							if(currCharacter.toString()=="^"){
								$(this).hide();
								$(this).removeClass("dragDiv");
								
								if(indentingLevel>0)	
									leftMargin=indentingLevel*35;
								else
									leftMargin=indentingLevel*30;
								
								var pixels=$("#rearrangecode-"+animation+" .drop-section .itemDropable").width()-leftMargin-50;
								var screenWidth = $("#rearrangecode-"+animation+" .drop-section").width();
								var width = 100-(( screenWidth - pixels ) / screenWidth)*100;
								
								var preClassAddon;
								if(horstmann_rearrangecode.preSectionClass[Number(animation)-1] == undefined){
									preClassAddon = "hc-code";
								}else{
									preClassAddon = horstmann_rearrangecode.preSectionClass[Number(animation)-1]
								}
								
								var dropSec=$("#rearrangecode-"+animation+" .drop-section");
								
								if(dropSec.find(".blockedItems").length == 0){
									dropSec.prepend('<div class="blockedItems"></div>');
								}
								currentOl = $("#rearrangecode-"+animation+" .drop-section .blockedItems")
								ans = $.trim(getDivContent($(this)));
								currTextHtml = $(this).html();
								
								$("<div id='droppedItem_"+animation+"_"+(1)+"_fixed' datasign='"+currCharacter+"' indentLevel='"+indentingLevel+"' animation='"+animation+"'></div>").attr("answer", ans).attr("useranswer",ans).html(currTextHtml).appendTo(currentOl).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px","display":"block"}).addClass("hc-draggable").addClass("non-sortable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>");
								
							}
							if(currCharacter.toString()!="+"){
								innerArray.push($(this));
							}else{
								$(this).remove();
							}
								
						});
						
						//---Remove balnk items from answerArray
						var tmpArr = []
						for (ri=0;ri<answerArray.length;ri++)
						{
							if (answerArray[ri] != "")
								tmpArr.push(answerArray[ri])
						}
						answerArray = [];
						answerArray = tmpArr;
						
				setupArray[animation] = innerArray;
				arrLoc="animation"+animation;
				
				dummyArr=[];
				
				for(var i=0;i<answerArray.length;i++)
				{
					dummyArr.push({"answer":answerArray[i],"level":indentingLevelArr[i]})
					if(i==answerArray.length-1){
						tempAnswerArray[animation-1] = dummyArr;
					}
				}
				
		},100);
		
		setTimeout(function(){
				
				totalLength=setupArray[animation].length;
				
				withoutcurrlyBraceArray=[];
				currlyBraceArray=[];
				linecurrlyBraceArray=[];

				for(var i=0;i<totalLength;i++)
				{
					var currentString=setupArray[animation][i].text().toString();
					checkforbraces=$.trim(currentString);
					
					if((checkforbraces.charAt(0)=="{") && checkforbraces.length==1)
					{
						currlyBraceArray.push(setupArray[animation][i])
					}else if(checkforbraces.charAt(0)=="{" && checkforbraces.charAt(checkforbraces.length-1)=="}" && checkforbraces.length>1){
						linecurrlyBraceArray.push(setupArray[animation][i]);
					}else{
						withoutcurrlyBraceArray.push(setupArray[animation][i]);
					}
				}
				//---For sorting curly braces
				for(var i=0;i<totalLength;i++)
				{
					var currentString=setupArray[animation][i].text().toString();
					checkforbraces=$.trim(currentString);
					if((checkforbraces.charAt(0)=="}") && checkforbraces.length==1)
					{
						currlyBraceArray.push(setupArray[animation][i])
					}
				}
				
				dropSection.html("");
				
				shuffle(withoutcurrlyBraceArray);
				totalLength=withoutcurrlyBraceArray.length;
				cnt=1;
				
				for(var i=0;i<totalLength;i++)
				{
					
					dragSection.append(withoutcurrlyBraceArray[i]);//append elements to draggable section
					dropSection.append("<div class='drop-container-"+(cnt)+"' id='drop_"+animation+"_"+(cnt)+"' holder="+(cnt)+"></div>");
					
					dropSection.children("div.drop-container-1").show();
					cnt++;
				}
				
				shuffle(linecurrlyBraceArray);
				totalLength=linecurrlyBraceArray.length;

				for(var i=0;i<totalLength;i++)
				{
					
					dragSection.append(linecurrlyBraceArray[i]);//append elements to draggable section
					dropSection.append("<div class='drop-container-"+(cnt)+"' id='drop_"+animation+"_"+(cnt)+"' holder="+(cnt)+"></div>");
					cnt++;
				}
				
				totalLength=currlyBraceArray.length;
				for(var i=0;i<totalLength;i++)
				{
					dragSection.append(currlyBraceArray[i]);//append elements to draggable section
					dropSection.append("<div class='drop-container-"+(cnt)+"' id='drop_"+animation+"_"+(cnt)+"' holder="+(cnt)+"></div>");
					
				}
				
				dragSection.children("div").each(function(index){
					$(this).attr("id","drag_"+animation+"_"+(index+1))
				
				})
							
		},200);
		setTimeout(function () {
				
				cuurDragAnswer="";			 
			 	draggableOptions={
				refreshPositions: true,
				start:function(event,ui){
					
					$("#rearrangecode-"+currentAnimation+" .seeNextStep").hide();
					$("#warnMsgRe"+currentAnimation).html("");
					horstmann_rearrangecode.currentAttempt = 0;
					$(this).removeAttr("width");
					$(this).hide();
					noOftryArray[currentAnimation]=0;
					currentAnimation=$(this).attr("animation");		
					currentCode="rearrangecode-"+currentAnimation;
					holder=$(this).attr("holder");
					cuurDragAnswer=$("#drop_"+animation+"_"+holder).attr("useranswer");
					$("#drop_"+animation+"_"+holder).attr("useranswer","null");
					resetColor();
					rev=false;
					$($(ui.helper)).css({"position":"absolute","padding":"5px 10px","height":"auto","width":"380px"}).addClass("hc-draggable");;
					
					//
					var addedClass = $(this).parent().attr("class").split(" ").join("").split("section-2").join("").split("ui-droppable").join("")
					$($(ui.helper)).addClass(addedClass);

					$("#" + currentCode+" .drop-section .dummyLevels").show();
					$("#rearrangecode-"+currentAnimation+" .dummy_placeholder .mark").html("");
					updateActivityHeight();
				
				},
				
				revert: function(e,ui) {		
				
					if(rev==false){
						$(this).parent().attr("useranswer",cuurDragAnswer).css({"border":"none"});
						$(this).show().css({"border":"none"});
						$("#" + currentCode+" .drop-section .dummyLevels").hide();
						$("#" + currentCode+" .section-2").css("border-left","0.12em solid #1A3459");
					}
				}
					
			}
			currentCode="rearrangecode-"+animation;
			dragSection=$("#"+currentCode+" .section-2");
			dropSection=$("#"+currentCode+" .section-1");
			
			var vDvSection2Height =  dragSection.height()+ 10 + ($(".done").height()+50);
			var vDvSection2ParentHeight = vDvSection2Height + 50 + ($(".done").height()+50);
			//dragSection.css('min-height',vDvSection2Height); // set dynamic height to section-2 div
			//dropSection.css('min-height',vDvSection2Height); // set dynamic height to drop-section	
			//$("#"+currentCode+" .drop-section").css('min-height',(vDvSection2Height+10)); // set dynamic height to drop-section	
			//$("#"+currentCode).css('min-height',vDvSection2ParentHeight); // set dynamic height to rearrangecode 1, 2 etc div
			
			//$("#"+currentCode+" .drop-section .dummyLevels div").css('min-height',vDvSection2ParentHeight-104); // set dynamic height to rearrangecode 1, 2 etc div	
			if ($("#rearrangecode-"+animation+" .drop-section .blockedItems").height() != null){
				
				$("#"+currentCode+" .drop-section .dummyLevels div").css("top",-($("#rearrangecode-"+animation+" .drop-section .blockedItems").height()))
			}
			

			updateActivityHeight();
		},300);
		
		//next initialization
		setTimeout(function () {
			controller.dragDrop();
			
			if (animation < noofAnimations){
				controller.initialise(animation+1);
			}else{
				activitiesGenerated = true;
				chkForPendingRearrange();
			}
		 }, 400);
		 
		 
		setTimeout(function () {
			if (isIE() < 9 && isIE()){
				$(".warningMsg").html(gt.gettext("browserwarning"));
				//gt.gettext("try_again_msg"));
				$(".warningMsg").css("float","none");
				$(".warningMsg").show();
			}
		}, 500);
	},
	dragDrop:function(){
		$(".section-2").droppable({
			 tolerance:"pointer",
			 drop: function (event, ui) {
				 
				 ans=ui.helper.attr('useranswer');
				 $("#" + currentCode+" .section-2").children("div").each(function(){
					seq=$(this).attr("sequnce");
					if(cleanStr(ans)==cleanStr(seq) && $(this).css("display") == "none")
					{
						$(this).show();
						ui.helper.remove();
						controller.updateLiPositions();
						return false;
					}
				 });
			 }
		});

		$(".drop-section .itemDropable").droppable({
			 accept: ":not(.ui-sortable-helper)",
			 tolerance:"pointer",
			 drop: function (e, ui) {
			 	nextSiblingSortable = true;
			 	 $(this).children('.hc-tile').each(function () {
					 if ($(this).offset().top >= ui.offset.top) //compare
					 {
				 		if ($(this).hasClass("non-sortable")){
				 			nextSiblingSortable = false;
				 			return;
				 		}
					 }
				});

				if (!nextSiblingSortable)
					return false;


				 var parentOffset = $(this).offset();
				 var relX = ui.offset.left-parentOffset.left;
				 leftMargin=calculate_margin(relX).split(",")[0];
				 dropLocation=calculate_margin(relX).split(",")[1];
				 var pixels=$("#" + currentCode+" .drop-section").width()-leftMargin-50;
				 var screenWidth = $("#" + currentCode+" .drop-section").width();
				 width = 100-(( screenWidth - pixels ) / screenWidth)*100;
				 
				$("#" + currentCode+" .drop-section .dummyLevels").hide();
				
				currentAnimation=ui.helper.attr("animation");
				answerseq=ui.helper.attr("sequnce");
				
				rev=true;
				$(this).find(".dummy_placeholder").remove();
				
				if ($(this).find(".placeholder").length > 0) //add first element when section is empty
				{
					$(this).find(".placeholder").remove();
					
					var preClassAddon;
					if(horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1] == undefined){
						preClassAddon = "hc-code";
					}else{
						preClassAddon = horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1]
						
					}
					addedDiv = $("<div animation='"+currentAnimation+"'></div>").attr("useranswer",answerseq).html(ui.draggable.html()).appendTo(this).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"}).attr("indentLevel",dropLocation).attr("datasign", ui.helper.attr("datasign")).addClass("hc-draggable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>").attr("data-user-dropped","true");
				}else{
				
				 var i = 0; //used as flag to find out if element added or not
					
				 $(this).children('.hc-tile').each(function () {
					 if ($(this).offset().top >= ui.offset.top) //compare
					 {
						 var preClassAddon;
						if(horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1] == undefined){
							preClassAddon = "hc-code";
						}else{
							preClassAddon = horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1]
							
						}
						addedDiv = $("<div animation='"+currentAnimation+"'></div>").attr("useranswer",answerseq).html(ui.draggable.html()).insertBefore($(this)).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"}).attr("indentLevel",dropLocation).attr("datasign", ui.helper.attr("datasign")).addClass("hc-draggable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>").attr("data-user-dropped","true");
						 i = 1;
						 controller.updateLiPositions();
						 return false; //break loop
					 }
				 })
	
					 if (i != 1) //if element dropped at the end of section
					 {

						  controller.updateLiPositions();
						  
						var preClassAddon;
						if(horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1] == undefined){
							preClassAddon = "hc-code";
						}else{
							preClassAddon = horstmann_rearrangecode.preSectionClass[Number(currentAnimation)-1]
						}
						  
						addedDiv = $("<div animation='"+currentAnimation+"'></div>").attr("useranswer",answerseq).html(ui.draggable.html()).appendTo(this).css({/*"width":width+"%",*/"position":"relative","margin-left":leftMargin+"px"}).attr("indentLevel",dropLocation).attr("datasign", ui.helper.attr("datasign")).addClass("hc-draggable").addClass(preClassAddon).addClass("hc-tile").append("<span class='mark'></span>").attr("data-user-dropped","true");	 
					 }
					 
				 }
			 
			 $(this).find(".hc-tile").attr("actualwidth", $(this).width() + "px");
			 
			 controller.updateLiPositions();
			 $(this).append("<div class='dummy_placeholder'><span class='mark'></span></div>");

			 updateActivityHeight();


			$(addedDiv).mousedown(function() {
				//--Reset margin and add equal value left for initial pickup at same mouse location...
				itemSorted = false;
				var mL = $(this).css("margin-left");
				$(this).css("margin-left","auto");
				$(this).css("left",mL);
			});

			$(addedDiv).mouseup(function() {
				//--Reset margin and add equal value left for initial pickup at same mouse location...
				if (!itemSorted)
				{
					var mL = $(this).css("left");
					$(this).css("left","auto");
					$(this).css("margin-left",mL);
				}
			});
         }
     }).sortable({
         items: ".hc-tile",
		 cursor: "move",
		 cancel: ".non-sortable",
		 change:function(e,ui){
			
		 },

		start:function(e,ui){
			itemSorted = true;
			resetColor();
			$("#rearrangecode-"+currentAnimation+" .seeNextStep").hide();
			$(" #warnMsgRe"+currentAnimation).html("");
			horstmann_rearrangecode.currentAttempt = 0;
			$(ui.item).css("width", ($(ui.item).parent().width()-20)+"px");

			noOftryArray[currentAnimation]=0;
			$(this).find(".mark").html("");
			$("#rearrangecode-"+currentAnimation+" .drop-section .dummyLevels").show();
			$(ui.item).addClass("hc-draggable");
			
		},
		stop:function(e,ui){
			//---Remove left before calculation...
			$(ui.item).css("left","0px");
			//
		 	var nextSibling = ui.item[0].nextElementSibling;
		 	if ($(nextSibling).hasClass("non-sortable"))
		 	{
		 		$(".drop-section .itemDropable").sortable('cancel');
		 	}
			 var parentOffset = $(this).offset();				 

			 var relX = ui.offset.left-parentOffset.left;
			 
 			 $("#rearrangecode-"+currentAnimation+" .drop-section .dummyLevels").hide();
 			 

			 leftMargin=calculate_margin(relX).split(",")[0];
			 dropLocation=calculate_margin(relX).split(",")[1];
			 
			  var pixels=$("#" + currentCode+" .drop-section").width()-leftMargin-50;
				 var screenWidth = $("#" + currentCode+" .drop-section").width();
				 width = 100-(( screenWidth - pixels ) / screenWidth)*100;
			 
			 $(ui.item).css({"margin-left":leftMargin+"px","width":width+"%"}).attr("indentLevel",dropLocation);
			 
			 //$(ui.item).css("width", width+"%");
			$(ui.item).css("width", "auto");
			 
			controller.updateLiPositions();

			updateActivityHeight();
			
		},
		update:function(e,ui){
			

			setTimeout(function(){controller.updateLiPositions();},50);

			updateActivityHeight();
		},
        sort: function (e,ui) {
        	console.log("update sort...")
             $(this).removeClass("ui-state-default");
        }
     });

	

 	
	
	},
	start:function(i){

		$("#warnMsgRe"+i).html("");
		$("#warnMsgRe"+i).hide();
		$("#warnMsgRe"+i).css("float","left");
		
		currentCode = "rearrangecode-" + i;

		$("#"+currentCode+" .instructions1").text(gt.gettext("rearrange_inst"));
		$("#"+currentCode+" .done").show();
		$( "#"+currentCode+" .dragDiv").draggable(
				draggableOptions,{cursor:"move",
				containment: "#"+currentCode,
				refreshPositions: false,
				appendTo:"#"+currentCode,
				scroll: false,
				helper:"clone"
			});
		$( "#"+currentCode+" .dragDiv").draggable( 'enable' )
	},

	updateLiPositions:function(){
		cnt=1;
		$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").sortable("enable");
		noOfLi=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").size();					
		
		noOfAllowedLi=tempAnswerArray[(currentAnimation-1)].length
		
		$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").children(".hc-tile").each(function(index){
					if(index<noOfAllowedLi){
						tempAnswer=tempAnswerArray[(currentAnimation-1)][index].answer;
						tempLevel=tempAnswerArray[(currentAnimation-1)][index].level;
						$(this).attr("answer",tempAnswer);	
						$(this).attr("actualLevel",tempLevel);
					}else {
						$(this).attr("answer",0);
						$(this).attr("actualLevel","null");
						
					}
												
				$(this).children(".mark").html("");		
			
			$(this).attr("id",("droppedItem_"+currentAnimation+"_"+cnt++));
			
		});
		
	},
	hidepopup:function(){
		$("#rearrangecode-"+currentAnimation+" .goodjob").hide();
	},
	resetRearangecode:function(i){
		
		//Hide button
		$("#buttonRe"+i).css("display","none");
		var element = getElement($("#rearrangecode-"+i))[0];
		element.errors = 0;
		element.correct = 0;

		window['errorCount'+(i-1)] = 0;
	 	window['timerCount'+(i-1)] = 0;
		$("#errorfeedbackRe"+i+" .nooferrors").html(controller.errorCount(element));//window['errorCount'+(i-1)] + " "+gt.gettext("error_text"));
		$("#errorfeedbackRe"+i+" .timespent").html(" ");
		$("#errorfeedbackRe"+i).css("display","none");


		$("#startbtnRe"+(i)).show();

		$("#rearrangecode-"+(i) +" .done").hide();
		$("#rearrangecode-"+i+ " .seeNextStep").hide()

		$("#rearrangecode-"+(i) +" .dragDiv").draggable( 'disable' )

		$("#rearrangecode-"+i+" .dummy_placeholder .mark").hide();
					
		$("#droppedItem_"+i+"_"+(i+1)+" .mark").hide();
		$("#droppedItem_"+i+"_"+(i+1)).addClass("hc-draggable");
	}
};

jQuery.extend({
    compare: function (arrayA, arrayB) {
        if (arrayA.length != arrayB.length) { return false; }
        // sort modifies original array
        // (which are passed by reference to our method!)
        // so clone the arrays before sorting
        var a = jQuery.extend(true, [], arrayA);
        var b = jQuery.extend(true, [], arrayB);
        a.sort(); 
        b.sort();
        for (var i = 0, l = a.length; i < l; i++) {
            if (cleanStr(a[i]) !== cleanStr(b[i])) { 
                return false;
            }
        }
        return true;
    }
});
function compare(arrayA,arrayB){
	for(var i=0; i<arrayA.length;i++){
		if(cleanStr(arrayA[i])!=cleanStr(arrayB[i]))
		return false;
		 
		
	}	
	return true;
}


function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function ifExist(num,set,actualindentLevel,indentLevel){
	var arr=set.split("^|^");
	var bExist="true";
	for(var i=0;i<arr.length;i++){
		

		if(cleanStr(num)==cleanStr(arr[i]))
		{
			bExist="true";
			if(parseInt(actualindentLevel) != parseInt(indentLevel)){
				bExist="indentFault";
			}
			break;
		}else{
			bExist="ansFault";
		}
		
	}
	return bExist;
}

function checkAnswers(num,indexnumber){
	
	var selectedDiv
	++horstmann_rearrangecode.currentAttempt;
	currentAnimation=indexnumber;
	var bCorrect=true;
	noOfLi=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable .hc-tile").size();
	totalLength=tempAnswerArray[num].length;
	var warningMessage="";
	var placeHolderWidth = 0;
	var placeHolderHeight = 0;
	currentOl=$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable");	
	currentCode = "rearrangecode-"+currentAnimation;
	if(noOfLi==0)
	{
		if(currentOl.find(".dummy_placeholder").length==1)
			selectedDiv = $("#rearrangecode-"+currentAnimation+" .dummy_placeholder");
		else
         selectedDiv = $("#rearrangecode-"+currentAnimation+" .placeholder");
		 
			
		warningMessage=gt.gettext("incomplete_attempt_msg");
		bCorrect=false;
	}

	$("#" + currentCode+" .drop-section .itemDropable .hc-tile").each(function(index){
		var curObj = $(this)
		var charSymbol = curObj.attr("datasign");
		var answer=getDivContent(curObj);

		var matchingItemDataSign = null;
		if (charSymbol == "-"){
			var matched = false;
			$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
			{
				matchingItemDataSign = $(this).attr("datasign");

				if (cleanStr(answer) == cleanStr($.trim(getDivContent($(this)))) 
					&& $(this).css("display") != "none" 
					&& matchingItemDataSign != "-"  
					&& matchingItemDataSign != undefined){
						$(this).attr("actualdatasign", matchingItemDataSign);
						matched = true;
						$(this).attr("datasign", "-");
						return false;
				}
			});

			if (matched)
			{
				$("#rearrangecode-"+currentAnimation+" .section-2 div").each(function()
				{
					if (cleanStr(answer) == cleanStr($.trim(getDivContent($(this)))) 
						&& $(this).css("display") == "none" 
						&& $(this).attr("datasign") == "-"){
							$(this).attr("actualdatasign", "-");
							$(this).attr("datasign", matchingItemDataSign);
							return false;
					}
				});
				curObj.attr("datasign", matchingItemDataSign);
				//return false;
			}
		}
	});


	$("#" + currentCode+" .drop-section .itemDropable .hc-tile").each(function(index){
			index=index+1;
			var answer=$(this).attr("answer");		
			var userAnswer=$(this).attr("useranswer");
			var actualindentLevel=$(this).attr("actualLevel");
			var indentLevel=$(this).attr("indentLevel");
			
			var charSymbol = $(this).attr("datasign");
			placeHolderWidth = $("#droppedItem_"+currentAnimation+"_"+(index)).width();
			placeHolderHeight = $("#droppedItem_"+currentAnimation+"_"+(index)).height();
			
			if (charSymbol == "-"){			
				$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
				selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index))
				warningMessage=gt.gettext("incorrect_line_msg");;
				bCorrect=false;
				return false;
			}
			else if(answer.indexOf("^|^")!=-1 )
			{
				var exist = ifExist(userAnswer,answer,actualindentLevel,indentLevel)

				if (charSymbol == "-"){
					warningMessage=gt.gettext("incorrect_line_msg");
					$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
					selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index))
					bCorrect=false;
					return false;
				}else{
					if(exist == "ansFault")
					{
					
						$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
						selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index))
						bCorrect=false;
						
						if (horstmann_rearrangecode.currentAttempt == 1)
							warningMessage=gt.gettext("try_again_msg");
						else
							warningMessage=gt.gettext("try_again_or_msg");
							
						
						return false;
					}else if(exist == "indentFault"){
						
						$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
						selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index))
						bCorrect=false;
						warningMessage=gt.gettext("wrong_indent_msg");
						
						return false;
					}
				}
				
			}			
			else if(cleanStr(answer)!=cleanStr(userAnswer))
			{
				
				$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
				selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index));
				bCorrect=false;
				if (charSymbol == "-"){
					warningMessage=gt.gettext("incorrect_line_msg");
				}else{
					if (horstmann_rearrangecode.currentAttempt == 1)
						warningMessage=gt.gettext("try_again_msg");
					else
						warningMessage=gt.gettext("try_again_or_msg");
				}
				
				return false;
			}			
			else if(parseInt(actualindentLevel)!= parseInt(indentLevel)){
				
				$("#droppedItem_"+currentAnimation+"_"+(index)+" .mark").html(redCheck);
				selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(index));
				bCorrect=false;
				warningMessage=gt.gettext("wrong_indent_msg");
				return false;
			}
		});
	
		if(bCorrect!=false)
		{
			if(noOfLi>totalLength){
				temp=noOfLi-totalLength;
				if(temp>0)
					noOfLi=totalLength+1;
				
					$("#droppedItem_"+currentAnimation+"_"+(noOfLi)+" .mark").html(redCheck);
					selectedDiv = $("#droppedItem_"+currentAnimation+"_"+(noOfLi));
					warningMessage=gt.gettext("incorrect_line_msg");
					bCorrect=false;
			}else{
				if(totalLength!=noOfLi){
					selectedDiv = $("#rearrangecode-"+currentAnimation+" .dummy_placeholder");
					warningMessage=gt.gettext("incomplete_attempt_msg");
					placeHolderWidth = (selectedDiv.width());
					placeHolderHeight = selectedDiv.height();
					bCorrect=false;
				}
			
			}
	}
			
	
	if(warningMessage!="")
	{
		$("#warnMsgRe"+currentAnimation).html(warningMessage);
		$("#warnMsgRe"+currentAnimation).show();
	}
	

	var element = getElement($("#rearrangecode-"+currentAnimation))[0];
	
	if(bCorrect)
	{	
		noOftryArray[currentAnimation]=0;
		var date = new Date();
		endTime = date.getTime();
		var timeDiff = endTime - timerArrayRe[currentAnimation];
		$("#warnMsgRe"+currentAnimation).html("");
		horstmann_rearrangecode.currentAttempt = 0;
		$("#rearrangecode-"+currentAnimation+" .section-2 .itemDropable").draggable( "disable" );
		$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").sortable("disable");
		$("#rearrangecode-"+currentAnimation+" .done").hide();
		setTimeout(function(){
			var tSeconds = Math.floor(timeDiff/1000);
			$("#errorfeedbackRe"+currentAnimation+" .timespent").html(", "+tSeconds+" "+gt.gettext("seconds"));
		},100)
		

		$("#instDvRe"+currentAnimation).find(".gJob").html(gt.gettext("Good job")) 
		$("#instDvRe"+currentAnimation).find(".goodjob").show();
		window["timerCount"+currentAnimation] = 0;

		
		$("#errorfeedbackRe"+(indexnumber)+" .nooferrors").html(controller.errorCount(element));

		$("#" + currentCode+" .drop-section .itemDropable .hc-tile").removeClass("hc-example-incorrect");
	}else{
	
		if(selectedDiv.hasClass("dummy_placeholder") || selectedDiv.hasClass("placeholder"))
		{
			placeHolderWidth=365;
		}else{
			placeHolderWidth=selectedDiv.width();
			placeHolderHeight=selectedDiv.height();
		}
		selectedDiv.find(".mark").css('left', (placeHolderWidth+30)+'px');
		selectedDiv.find(".mark").css('top', ((placeHolderHeight/2 - $(redCheck).height()/2)+5)+'px');
		selectedDiv.removeClass("hc-draggable").addClass("hc-example-incorrect");
		selectedDiv.find(".mark").html(redCheck);
		++window['errorCount'+(indexnumber-1)];
		
		element.errors++;
		//if (window['errorCount'+(indexnumber-1)] < 2)
		$("#errorfeedbackRe"+(indexnumber)+" .nooferrors").html(controller.errorCount(element));

		//window['errorCount'+(indexnumber-1)] + " "+gt.gettext("error_text"));
		//else
		//$("#errorfeedbackRe"+(indexnumber)+" .nooferrors").html(window['errorCount'+(indexnumber-1)] + " "+gt.gettext("error_plural_text"));
				
		noOftryArray[currentAnimation]=noOftryArray[currentAnimation]+1;
		if(noOftryArray[currentAnimation]>=2)
		{
			noOftryArray[currentAnimation]=0;
			$("#rearrangecode-"+currentAnimation+" #instDvRe"+currentAnimation+" .seeNextStep").show();
		}
		
		setTimeout(function(){
			$("#rearrangecode-"+currentAnimation+" .tempMsg").hide();
		},2000)
	}


	
	var itemsCorrect = 0;
	$("#" + currentCode+" .drop-section .itemDropable .hc-tile").each(function(index){
		if ($(this).hasClass("hc-example-incorrect"))
		{
			return false;
		}else{
			if ($(this).attr("data-user-dropped") == "true")
				++itemsCorrect;

			$(this).addClass("non-sortable");
			$(this).addClass("hc-example-correct");
		}
	});

	if (itemsCorrect > element.correct)
		element.correct = itemsCorrect;

	$("#errorfeedbackRe"+(currentAnimation)+" .nooferrors").html(controller.errorCount(element));
	return;

}

function resetColor(){
$("#rearrangecode-"+currentAnimation+" .drop-section .itemDropable").children(".hc-tile").each(function(index){
	$(this).addClass("hc-draggable");
	$(this).find(".mark").html("")
});
}

function calculate_margin(leftPos){
		leftPos=leftPos-10;

		marginleft=0;
		if(leftPos<=24)
		{
			marginleft=0;
			droplocation=0;
		}
		else if(leftPos>=25 && leftPos<=59.99)
		{
			marginleft=35;
			droplocation=1;
		}
		else if(leftPos>=60 && leftPos<=94.99)
		{
			marginleft=70;
			droplocation=2;
		}
		else if(leftPos>=95 && leftPos<=129.99){
			marginleft=105;
			droplocation=3;
		}
		else {
			marginleft=140;
			droplocation=4;
		}

		if(parseInt(updateholder)==1 )
		{
			prevDroplocation=0;
			dropLocation=0;
			$("#" + currentCode+" .drop-container-"+holder).children("div.dragDiv").css({"margin-left":marginleft+"px"});
		}
		
		
		 if(prevDroplocation<=droplocation){
			prevDroplocation=droplocation;
			prevMargin=marginleft;
	 	}
		return (marginleft+","+droplocation);	
}

function addDivContent(obj, content, type, leftMargin)
{
	leftMargin = (leftMargin==undefined)?0:leftMargin;

	var newDiv
	if (type == "add")
	{
		obj.html("");
		newDiv = $('<div style="position:relative; top:0px; left:0px; clear:right;">'+content+'</div>');
		
	}else if (type == "append")
	{
		newDiv = $('<div style="position:relative; top:0px; left:0px; padding-left:'+leftMargin+'px; clear:right;">'+content+'</div>');
	}

	obj.append(newDiv)
	return newDiv;
}

function getDivContent(obj)
{
	
	if (obj.find('div').length == 0)
	{
		return $(obj).text();
	}else{
		return $(obj.find('div')[0]).text();
	}
	
}

function getAllDivsContent(obj)
{
	var returnTextArr = new Array();

	$(obj).find("div").each(function(i,element)
	{
		returnTextArr.push($(this).text());
	});
	

	return returnTextArr.join("-*-");
	
}

function cleanStr(str)
{
	return String(str).split(" ").join(" ");
}

$.fn.reformatPre = function( method ) {

			var defaults = {
				ignoreExpression: /\s/ // what should be ignored?
			};

			var methods = {
				init: function( options ) {
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
			if ( methods[method] ) {
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			}
			else if ( typeof method === "object" || !method ) {
				return methods.init.apply( this, arguments );
			}
			else {
				$.error( "Method " + method + " does not exist on jQuery.reformatPre." );
			}
		}
	function isIE () {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}

	function getElement(obj)
	{
		ctr = 0
		while (!obj.hasClass("horstmann_rearrange") && ctr <10)
		{
			obj = $(obj.parent());
			++ctr;
		}
		return obj;

	}
})(horstmann_rearrangecode = horstmann_rearrangecode ||{});
var horstmann_rearrangecode;
