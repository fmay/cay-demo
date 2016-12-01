(function(player)
{
	var nextCode = new Array();
	var headingReqd = new Array();
	var regExp = false;
	var totalElements = 0;
	var currentInputObj;
	var animation = 1;
	var nextAnimation = 1;
	var flag = false;
	var noofAnimations = 1;
	var lengthArray = [];
	var noofAttempts=0;
	var myVar,myVar1;
	var maximumTry=2;
	var noOftryArray=[];
	var totalErrorArray=[];
	var totalScoreArray=[];
	var timerArray=[];
	var scoreArray=[];
	var insideLoop=false;
	var currentAnswer;
	var userLastResponce=new Array();
	player.setup = new Array();
	player.inputFieldBlur = false;
	player.inputFieldChecking = false;
	
	// record start time
	var startTime;

	// later record end time
	var endTime;
	
	var isRegExp=false;
	
	resetAnimation = false;
	var regex = new RegExp("^[a-zA-Z]+$");
	
	var goodJob = '<div class="goodjob hc-good"><div align="center"><a class="closePopup" href="javascript:void(0)" style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjczMjE3RkNFMjFFQjExRTM5NTQ4Q0I4OUQ5QzYzRjI5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjczMjE3RkNGMjFFQjExRTM5NTQ4Q0I4OUQ5QzYzRjI5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzMyMTdGQ0MyMUVCMTFFMzk1NDhDQjg5RDlDNjNGMjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzMyMTdGQ0QyMUVCMTFFMzk1NDhDQjg5RDlDNjNGMjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xYwTqAAAAzUlEQVR42uxVwQnDMAx0ukE6QjpCOoJX6ApZwSt0lszSjpAVkhFUiV6pKSZEwqYfCQ7sU9BZQkc6Igr/iM6FXdiFa8VJ8W1iyCtjIXdDLrXq+MHoGVfGBq4Hv4E/FiKsQKR3pIxL4KKmllZYcIfQABA4VR3LcsloF8YT95FxyUbfZNQfTPSNyVLDaifpesX5rO5Waadfa5XOTUedb7Zpo62jzr0cTB42dFzqsOTtqj4Wz66MuZCbkRtaCO8V33tUVTv5/9iFXdiFw0uAAQCVW9pWuTzpIwAAAABJRU5ErkJggg==" /></a></div><p><img src="data:image/png;base64,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" style="vertical-align:middle;margin-right:20px"/>'+gt.gettext("Good job")+'<br/><span class="score"></span></p></div>';
	
	var loading = '<div class="loading"><div align="center"><p><img src="images/loading.gif" style="vertical-align:middle;margin-right:20px"/></p></div</div>';
	
	var startOverbtn = ""
	
	var redCheck = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzQkU1RjQ5ODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzQkU1RjRBODc0MzExRTNCQzA3RkU4RTBBQURCNDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjNCRTVGNDc4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjNCRTVGNDg4NzQzMTFFM0JDMDdGRThFMEFBREI0MjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Y4k5bAAABuElEQVR42rSWQUQEYRTHt1oRsSxDRJSlLEuUbnXoWqJEkbpEkQ4RkU6lZYl0iIjIjk2U6JCIOnVIWqJToog9LbHEJi39P97wen078zUzPX583/ve/M335r1nam7aRiP/ZbUh67WCLlBvIt4D7sAhaHGJawJP4JniL5Qz6iG+Qm+i6AQdmhgLXIIE812bvLnF1u2gX5zHSTjJfLcgbSJ+IPbzbB2j66eY7xUMgrKJ+D4osf0w+2AntHasRMJF02p5B7vCtwmORIo+wQh4+GspbtPDjvWBIRGzAK781LnKo+1yngE7QZpoDXxp/MdgOWiHJjSxKlVzQds/RZUhY1XFTAcRV219TjVdrYPjfsQbwCloFv4Ptm4Eq37EszS4ZI1vCd+MmCue4uq6ctCrOl4CG+BN5H7dVHxAc9UXMA4qJJwR52OaW/4SV5MvB+qYr0ytXRRdWxDPTrqJx+gDysqYBffCV6bGisgZXk08S2/OzXZp/T12lqdu1YonNcPo0aMDVf6nQDfopf0PizJx2doTNHK9LO9V55amnvNh/VoURNmlw/jPcNJyBhapnW3DdBiLVygVodq3AAMACZ5Tiz+FFLkAAAAASUVORK5CYII='/>";
	
	function getElement(obj)
	{
		ctr = 0
		while (!obj.hasClass("horstmann_exampletable") && ctr <10)
		{
			obj = $(obj.parent());
			++ctr;
		}
		return obj;

	}
	// Document ready method Start

	
	$(document).ready(function ()
	{
		//-Content display trigger not required for exampletable as activity initializes properlly and does not require height calculation.
		//
		//if ($('.content001').is(":visible") || $('.content001').length == 0)
		//{
			initializeExampleTable();
		//}else{
		//	$('.content001').on('objectShown',initializeExampleTable);
		//}
	});
	function initializeExampleTable()
	{
		noofAnimations=0
		$('.horstmann_exampletable').each(function(index, element)
		{
			noofAnimations++;
			
		});

		$('.horstmann_exampletable').each(function (index)
		{
			//--Add vstdonthighlight and vst-click
			$(this).addClass("vstdonthighlight").addClass("vst-click");
			//
			index = index + 1;
			var holder = $(this).append("<div class='exTable_activity_holder' id='index"+index+"'></div>")
			$(this).find("table").appendTo($("#index"+index));
		});
		
		$('.exTable_activity_holder').each(function (index)
		{
			nextCode.push(1);
			index = index + 1;

			//Div added for top instruction block
			$(this).prepend('<div id="instructionsDv'+index+'" class="instructions hc-instructions hc-step"></div>');
			$("#instructionsDv"+index).append('<div id="exampletable_instDv'+index+'" class="instructions1 hc-message">'+gt.gettext("Press start to begin.")+'</div>');
			$("#instructionsDv"+index).append('<span id="startbtnDv'+index+'" class="hc-button hc-start">'+gt.gettext("start_button")+'</span>');
			$("#instructionsDv"+index).append('<div id="warningMsgDv'+index+'" class="warningMsg hc-message hc-retry"></div>');
			$("#instructionsDv"+index).append('<span id="nextStepDv'+index+'" class="hc-button hc-retry seeNextStep skipBtn">'+gt.gettext("next_step_button")+'</span>');
			$("#instructionsDv"+index).append('<div id="goodjobDv'+index+'" class="goodjob"><img width="25" height="25" style="vertical-align:middle;position:absolute;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzMjRCMEREODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzMjRCMERFODgxNTExRTM5QkU0QkU2NDlERkFDN0UyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMyNEIwREI4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTMyNEIwREM4ODE1MTFFMzlCRTRCRTY0OURGQUM3RTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5fkXkUAAAA+UlEQVR42mJM3ujOQA3ARKY+fiDOAeIVQCwKEmAhwxBdIN4CxHJAfBCIv5PjInsgPgw1pA+InYH4C6kuUoe6hAeIpwBxMTlhxAnEq6GGXEA3hBSDuqBhA/JGBBD/IscgGyDOhLKzgPgmOdHPBsRzgJgZiBdDMcF0xIxFvggayE+BuICYBAlKYA+B+DMQq0DFpIG4GslL74gxyBKqERQr85ECGMRfCcSbiM0iB6HOhwXuZCCOgsZSMSl5DZTMm5DEc6B0K5IFRGfauUB8B4l/B5oNSM79f6ExA6IfAXEQtoSHC6Dnta1ALA/EL6AGMpBrEAOxYYIOAAIMAHdiLpAopYgmAAAAAElFTkSuQmCC" /><span class="gJobText hc-message hc-good">'+gt.gettext("Good job")+'</span><br/><span class="score"></span></div>');
			
			$(this).attr("id", "ExampleTableCode-" + index);
			$(this).children("table").addClass("ExampleTableCode-" + index);

			currentCode = "ExampleTableCode-" + index;
			totalElements = $("#" + currentCode + " table tr").length - 1;
	
			var element = getElement($(this))[0];
			$("#" + currentCode).append('<div id="bottomDv'+index+'" class="bottomDv hc-bottom"></div>')
			$("#bottomDv"+index).append('<div class="errorfeedback hc-message hc-errors" id="errorfeedback'+index+'"><span class="nooferrors">' + controller.errorCount(element) + '</span><span class="timespent"></span></div>');
			$("#bottomDv" + index).append("<span id='exampletable_startover"+index+"' class='hc-button hc-start'>"+gt.gettext("Start over")+"</span>");
			$('#exampletable_startover'+index).css('display','none');
			
			//---Add Classes
			//--Add table header class
			$(this).find("th").addClass("hc-tableheader");
			$(this).find("tr").each(function (index){
				$(this).find("td:nth-child(1)").addClass("hc-example");
				$(this).find("td:nth-child(2)").addClass("hc-input");
				$(this).find("td:nth-child(3)").addClass("hc-explanation");
				$(this).find("td:nth-child(3)").css("visibility","hidden");
			});
			
			$(this).find("input").addClass("hc-input");
			
			lengthArray.push(totalElements);
	
			noOftryArray.push(0);
			totalErrorArray.push(0);
			totalScoreArray.push(0);
			timerArray.push(0);
			scoreArray.push(totalElements);
			
			userLastResponce.push(null);
			
			if (index == noofAnimations)
			{
				controller.initialise(1);
			}
			
			
			$(".horstmann_exampletable #startbtnDv"+index).unbind('click').on("click",function(){
				$(this).hide();
				animation = $(this).attr("id").split("startbtnDv")[1]
				animation=parseInt($(this).parent().parent().attr("id").split("-")[1]);
				$("#exampletable_startover" +animation).css("display","inline-block");
				$("#exampletable_instDv"+animation).html(gt.gettext("text_entry_inst"));
				$("#errorfeedback"+animation).css("display","block");	
				$("#warningMsgDv" + animation).show();
				controller.start(animation);
				
			});

			// Start over logic
			$(".horstmann_exampletable #exampletable_startover"+index).unbind('click').on("click",function()
			{
				//cons
				 clearTimeout(myVar1);
				 clearTimeout(myVar);
				 $(this).hide();
				
				 var num = $(this).attr("id").split("exampletable_startover")[1];
				 $("#exampletable_instDv"+num).html(gt.gettext("Press start to begin."));
				 $("#ExampleTableCode-" + num + " #startbtnDv"+num).show();
				 totalErrorArray[num-1]=0;
				 totalScoreArray[num-1]=0;
				 var element = getElement($(this))[0];
				 $("#errorfeedback"+num+" .nooferrors").html(controller.errorCount(element));
				 
				 $("#errorfeedback"+num+" .timespent").html(", "+"0 "+gt.gettext("seconds"));
				 $("#errorfeedback"+num).hide();
				 $("#warningMsgDv" + num).hide();
				 
				 controller.fnresetAnimation(num);
				 if (isIE() < 9 && isIE()){
					$(".warningMsg").html(gt.gettext("browserwarning"));//gt.gettext("try_again_msg"));
					$(".warningMsg").css("float","none");
					$(".warningMsg").show();
				}
			});
			
			// Skip step logic
			$(".horstmann_exampletable #nextStepDv"+index).on("click",function()
			{
				var num = Number($(this).attr('id').split("nextStepDv")[1]);

				clearTimeout(myVar1);
				clearTimeout(myVar);
				$(this).hide();
				
				if (!controller.inputFieldBlur)
					++totalErrorArray[num-1];
				var element = getElement($(this))[0];
				element.errors++
				$("#errorfeedback"+num +" .nooferrors").html(controller.errorCount(element));//totalErrorArray[num-1]+" "+gt.gettext("error_text"));
				
				controller.autoCorrect(currentAnswer, num);
				
			});
			
			//
			var maxCorr = 0
			if ($(this).find("table th").length > 0)
			{
				maxCorr = $(this).find("table tr").length-1;
			}else{
				maxCorr = $(this).find("table tr").length;
			}
			initializeVitalsourceData($(this).parent()[0], maxCorr);
			
		});
		
		// Close popup logic
		
		$(".horstmann_exampletable .closePopup").on("click",function()
		{
			 clearTimeout(myVar1);
			 clearTimeout(myVar);
			 scoreArray[animation-1]=lengthArray[animation-1];
			 controller.hidepopup();	
		});
		
		
		
	
	}

	function initializeVitalsourceData(element, maxCorrect)
	{
		element.maxscore = maxCorrect;
	    element.correct = 0;
	   	element.errors = 0;
	}
	
	// Document ready method end
	
	// Controller class srart
	var controller = {
	    lastKeycode : 0,
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
		//Initialize Animation method logic
		
		initialise: function (i) 
		{
			
			animation = i;
			currentCode = "ExampleTableCode-" + animation;
			content = "";
			headingReqd[i] = $("#" + currentCode + " .ExampleTableCode-" + animation + " tr").find("th").length>0;
			
			if (!headingReqd[i]){
				nextCode[i-1] = 0;
			}
			
				$("#" + currentCode + " .ExampleTableCode-" + animation + " tr").each(function (index) 
				{
					$(this).addClass("row-" + index);
					
					if (index == 0 && headingReqd[animation])
					{
					} else 
					{
						++totalScoreArray[animation-1];
						if (resetAnimation == true) 
						{
							$(this).children("td:eq(1)").children("input").show();
							answer = $(this).children("td:eq(1)").children("input").attr("answer");
							$(this).children("td:eq(1)").html("");
						} else
						{
							answer = $(this).children("td:eq(1)").text();

							$(this).children("td:eq(1)").attr("data-html", $(this).children("td:eq(1)").html());
						}

						if (answer != undefined){
							if (answer.indexOf("'") != -1)
								answer = answer.split("'").join("&#39;");
						}
						
						var isNumber = true;
						for (var a=0;a<String(answer).length;a++){
							if (String(answer).substring(a,a+1) != " "){
								if (isNaN(String(answer).substring(a,a+1))){
									isNumber = false;
								}
							}
						}
						var patternStr = (isNumber)?"[0-9]*":"[a-z]*";
						var inputFld = $("<input type='text' autocapitalize='off' autocorrect='off' autocomplete='off'  autoformat='off' spellcheck='false' pattern='"+patternStr+"' animation='" + animation + "' step='" + animation + "_" + (index) + "' tabindex='-1' class='hc-input'/><span class='mark'></span>").attr("answer",answer)
						$(this).children("td:eq(1)").html(inputFld);
						$(this).children("td:eq(1)").children("input").hide();
						if (index==0){
							$(this).children("td:eq(1)").addClass("hc-notableheader");
						}
					}
	
				});
				
				$("#ExampleTableCode-" + animation).css({"visibility": "visible"});	
				
				$("#ExampleTableCode-" + animation+" table tr").each(function(index)
				{
					$(this).find("td:eq(1)").find("input").removeClass("hc-example-correct");
					$(this).find("td:eq(1)").find("input").removeClass("hc-example-incorrect");
					
					$(this).find("td:eq(1)").removeClass("hc-example-correct");
					$(this).find("td:eq(1)").removeClass("hc-example-incorrect");
				});
				
				
				$("#ExampleTableCode-" + animation + " [class*='row-0']").show();
	
				$(".ExampleTableCode-" + animation + " input").unbind("blur").bind("blur",function()
				{ 
					clearTimeout(myVar1);
					clearTimeout(myVar);
					
					if (!controller.inputFieldChecking){

						controller.bindEvents(this)
					}
				});
			$(".ExampleTableCode-" + animation + " input").unbind("keydown").bind("keydown",function(e)
			{ 
				lastKeycode = e.keyCode;
				e = e || window.event;
				if (typeof e.stopPropagation != "undefined") {
			        e.stopPropagation();
			    } else {
			        e.cancelBubble = true;
			    }
			});

			$(".ExampleTableCode-" + animation + " input").unbind("keyup").bind("keyup",function(e)
			{
				currentInputObj = this;
				e = e || window.event;
				if (typeof e.stopPropagation != "undefined") {
			        e.stopPropagation();
			    } else {
			        e.cancelBubble = true;
			    }

				clearTimeout(myVar1);
				clearTimeout(myVar);
				var numId = $(this).attr("animation");
				$("#ExampleTableCode-" + numId + " .tempMsg").css("display", "none");
				timeoutAnsCheck(); 
				if(e.keyCode==13 || lastKeycode == 13)
				{
					if (!controller.inputFieldChecking)
					{
						controller.bindEvents(this)
					}
				}
			});

			$(".ExampleTableCode-" + animation + " input").on("focus", function ()
			{
				clearTimeout(myVar1);
				clearTimeout(myVar);
				animation = parseInt($(this).attr("animation"));
				currentAnswer=$(this).attr("answer").toString();
			});
			
			
			$(".ExampleTableCode-" + animation + " input").attr("autocapitalize","off").attr("autocorrect", "off").attr("autocomplete", "off");
			
			setTimeout(function () {
				if (resetAnimation != true) 
				{
					if (animation < noofAnimations)
					controller.initialise(animation + 1);
				}
			}, 300);
			setTimeout(function () {
				if (isIE() < 9 && isIE()){
					$(".warningMsg").html(gt.gettext("browserwarning"));//gt.gettext("try_again_msg"));
					$(".warningMsg").css("float","none");
					$(".warningMsg").show();
				}
			}, 500);
		},

		start:function(animation){
				$("#warningMsgDv" + animation).html('');
				//$("#warningMsgDv" + animation).hide();
				$("#warningMsgDv" + animation).css("float","left");
				var date = new Date();
					startTime = date.getTime();
					timerArray[animation]=startTime;
					$("#errorfeedback"+animation +" .timespent").html("");

					if (!headingReqd[animation]){
					 $(".ExampleTableCode-" + animation + " .row-0").show();
					 inputElement = $(".ExampleTableCode-" + animation + " .row-0 input");
					}else{
					 $(".ExampleTableCode-" + animation + " .row-1").show();
					 inputElement = $(".ExampleTableCode-" + animation + " .row-1 input");
					}
					inputElement.removeClass("hc-input").show();
					inputElement.focus();
		//setTimeout(function(){
				
				/*$(".ExampleTableCode-" + animation + " input").unbind("blur").bind("blur",function(){ 
						 clearTimeout(myVar1);
						 clearTimeout(myVar);
						 
						 controller.bindEvents(this)
					});  //on focus out check for answer

					$(".ExampleTableCode-" + animation + " input").unbind("keyup").bind("keyup",function(e){ 
					    clearTimeout(myVar1);
					    clearTimeout(myVar);
					    
					    //timeoutAnsCheck();
					    if(e.keyCode==13)
					    {
							
							controller.bindEvents(this);
						}
					});
						
					$(".ExampleTableCode-" + animation + " input").on("focus", function ()
					{
						clearTimeout(myVar1);
						clearTimeout(myVar);								 
						
						animation = parseInt($(this).attr("step").split("_")[0]);
						nextCode[parseInt(animation)-1] = parseInt($(this).attr("step").split("_")[1]);
						currentAnswer=$(this).attr("answer").toString();
					});*/
		
		//},200)
					

				
		},

		// Bind Events Method

		bindEvents: function (val) 
		{
			//console.log("bindEvents")
			controller.inputFieldChecking = true;
			
			controller.inputFieldBlur = false;
			//Fire focus event on input box
			clearTimeout(myVar1);
			clearTimeout(myVar);	
			timeoutAnsCheck();
			val=eval(val);
			animation = parseInt($(val).attr("animation"));
			num=animation-1;
			//---Added by SA - to skip blank value check
			if ($(val).val() == ''){
				setTimeout(function(){controller.inputFieldChecking = false;},500);
				return false;
			}
			//------------------------------------------
			
			if ($(val).attr("answer") != null) 
			{
				
				step=Number($(val).attr("step").split("_")[1]);
				if (!headingReqd[animation])
					++step;
				var currentAnswer =  player.setup[animation-1][step-1];
				if(currentAnswer!=null)
				{
					currentAnswer=currentAnswer;
					check(currentAnswer,val,(animation-1));
					return false;
				}else{
					currentAnswer=$(val).attr("answer");
				}
				
				var currVal = $(val).val().toString();
				var maxlength = parseInt($(val).attr("answer").toString().length);
				
				//---Error trap
				if (currVal.indexOf("'") != -1)
					currVal = currVal.split("'").join("&#39;");
				if (currentAnswer.indexOf("'") != -1)
					currentAnswer = currVal.split("'").join("&#39;");
					
				if (currVal.indexOf("<") != -1)
					currVal = currVal.split("<").join("&lt;");
				if (currentAnswer.indexOf("<") != -1)
					currentAnswer = currentAnswer.split("<").join("&lt;");
				//-------------
				
				var isNotCorrect = true;
				
				if (!isNaN(currentAnswer)){
					var cAns = Number(currentAnswer);
					var uAns = Number(currVal);
					
					if (cAns == uAns){
						
						isNotCorrect = false;
					}
				}else{
					
					if ($.trim(currVal.toLowerCase()) == $.trim(currentAnswer.toLowerCase())){
						
						isNotCorrect = false;
					}
				}
				var element = getElement($("#ExampleTableCode-" + animation))[0];
			   	if (isNotCorrect)
			   	{
					isRegExp=false;
					if ($.trim($(val).val()).length > 0) 
					{
						$(val).parent().addClass("hc-example-incorrect").addClass("answer-borders");
						$(val).addClass("hc-example-incorrect");

					    noOftryArray[num]=noOftryArray[num]+1;
					    if(noOftryArray[num]<maximumTry)
					    {
                            scoreArray[animation-1]=scoreArray[animation-1]-1;
							if(userLastResponce[num] != $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1]+" input").val()){
								controller.inputFieldBlur = true;
								setTimeout(function(){controller.inputFieldBlur = false;},500);
								element.errors++;
								totalErrorArray[num]=totalErrorArray[num]+1;
							}
					  
						
							$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " .mark").html(redCheck);
							$("#warningMsgDv" + animation).html(gt.gettext("try_again_msg"));
						}else
						{
							$("#warningMsgDv" + animation).html(gt.gettext("try_again_or_msg"));
							
						 	if(userLastResponce[num] != $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1]+" input").val()){
								setTimeout(function(){controller.inputFieldBlur = false;},500);
								controller.inputFieldBlur = true;
								element.errors++;
								totalErrorArray[num]=totalErrorArray[num]+1;
							}
							$("#ExampleTableCode-" + animation + " input").on("focusout");
							$("#instructionsDv" + animation + " .skipBtn").show();
						}
						
					} else
					{
						$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " .mark").html("");
					}
					
						
					userLastResponce[parseInt(animation)-1] = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1]+" input").val()
								
					 
				} else 
				{
					$("#instructionsDv" + animation + " .skipBtn").hide();
					noOftryArray[(animation-1)]=0; 
					$("#warningMsgDv" + animation).html('');
					$(val).val(currVal);
					$("#ExampleTableCode-"+animation+" table .row-"+nextCode[parseInt(animation)-1]+" .mark").html('');
					
					
					$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").parent().removeClass("hc-example-incorrect").addClass("hc-example-correct").show();
					$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").removeClass("hc-input").removeClass("hc-example-incorrect").addClass("hc-example-correct").show();
					element.correct++;

					var valTxt = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").attr("answer");
					$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").hide()
					
					//---Fix code value error 
					if (currentAnswer.indexOf("'") != -1)
						currentAnswer = currentAnswer.split("'").join("&#39;");
					if (currentAnswer.indexOf("<") != -1)
						currentAnswer = currentAnswer.split("<").join("&lt;");
					corAnsHtml = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").parent().attr("data-html");
					$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").parent().append(corAnsHtml);

					flag = false;
					$("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " td:nth-child(3)").css("visibility","visible");
						
					if (lengthArray[animation - 1] != (nextCode[parseInt(animation)-1])) 
					{
						controller.coreLogic(nextCode[parseInt(animation)-1], animation);
						$("#errorfeedback"+animation +" .nooferrors").html(controller.errorCount(element));						
					} else 
					{
							var date = new Date();
							endTime = date.getTime();
							var timeDiff = endTime - timerArray[animation];
							var seconds = Math.floor(timeDiff/1000);

							$("#errorfeedback"+animation +" .nooferrors").html(controller.errorCount(element));							
							$("#errorfeedback"+animation +" .timespent").html(", "+seconds+" "+gt.gettext("seconds"));

							if(scoreArray[animation-1]<0)
							{
								scoreArray[animation-1]=0;
							}
							$(val).hide();
							$("#goodjobDv" + animation).css("display", "block");
							
							$("#ExampleTableCode-" + animation + " input").unbind("blur keyup");
						clearTimeout(myVar);
						clearTimeout(myVar1);
						setTimeout(function(){controller.inputFieldChecking = false;},500);
						return false;
					}
					
					userLastResponce[parseInt(animation)-1] = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1]+" input").val()		
	
				} //end of inner else
				//$("#errorfeedback"+animation +" .nooferrors").html(controller.errorCount(element));
			} //end of if
			else {}
			userLastResponce[parseInt(animation)-1] = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1]+" input").val();
			
			setTimeout(function(){controller.inputFieldChecking = false;},500);
			
		},

		// Auto Correct Method Logic

		autoCorrect:function(ans, numId)
		{
			
//			$(".ExampleTableCode-" + animation + " input").unbind("keyup");
			
			$("#ExampleTableCode-"+numId+" table .row-"+nextCode[parseInt(numId)-1]+" .mark").html('');
			$("#warningMsgDv" + numId).html('');
			step=parseInt($("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " input").attr("step").split("_")[1]);
			currentAnswer1 =  player.setup[numId-1][step-1];
			
			num=numId-1;
			
//			$("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " input").unbind("blur"); 
			
			
			//---Fill correct answer			
			var currentAnswer = $("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " input").attr("answer");
			//---Fix code value error 
			if (currentAnswer.indexOf("'") != -1)
				currentAnswer = currentAnswer.split("'").join("&#39;");
			if (currentAnswer.indexOf("<") != -1)
				currentAnswer = currentAnswer.split("<").join("&lt;");
			//---Fill answer
			corAnsHtml = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input").parent().attr("data-html");


			$("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " td:nth-child(2)").removeClass("hc-example-incorrect").addClass("hc-example-correct").append(corAnsHtml);
			//
			$("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " td:nth-child(3)").css("visibility","visible");
			
			$("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " input").hide();

			
			noofAttempts=0;
			flag = false;
	
			if (lengthArray[numId - 1] != (nextCode[parseInt(numId)-1])) 
			{
				controller.coreLogic(nextCode[parseInt(numId)-1], numId);
			} else 
			{				
				clearTimeout(myVar1);
				clearTimeout(myVar);
				var date = new Date();
				endTime = date.getTime();
				var timeDiff = endTime - timerArray[numId];
				var seconds = Math.floor(timeDiff/1000);
				
				
									
				$("#errorfeedback"+numId +" .timespent").html(", "+seconds+" "+gt.gettext("seconds"));

				$("#goodjobDv" + numId).css("display", "block");
				$("#ExampleTableCode-" + animation + " input").unbind("blur keyup");

				return false;
			}

			
			

			$("#ExampleTableCode-" + numId + " table .row-" + nextCode[parseInt(numId)-1] + " input").focus();
		},
		
		//Core Logic Method
		coreLogic: function (event, anim)
		{
			controller.inputFieldBlur = false;
			animation = anim;
			noOftryArray[animation-1]=0;
			if (flag == false) {
				
				
				
				nextCode[parseInt(animation)-1] = nextCode[parseInt(animation)-1] + 1;
				flag = true;
	
	
				$("#ExampleTableCode-" + animation + " .row-" + nextCode[parseInt(animation)-1]).show();
				inputElement = $("#ExampleTableCode-" + animation + " table .row-" + nextCode[parseInt(animation)-1] + " input");
				inputElement.removeClass("hc-input").show();
				inputElement.focus();
				
				
				if (inputElement.attr("answer") != null) {
	
					if (regex.test(inputElement.attr("answer").toString())) {
						var maxlength = parseInt(inputElement.attr("answer").toString().length);
						
					} else {
						inputElement.removeAttr("maxlength");
					}
				}
			}
			return false;
	
		},	

		//Close pop up

		hidepopup: function () 
		{ 
			nextCode[parseInt(animation)-1] = 1;
			flag = false;		
			totalErrorArray[animation-1]=0;
			
			var element = getElement($("#ExampleTableCode-" + animation))[0];
			element.errors=0;
			element.correct=0;

			$("#errorfeedback"+animation +" .nooferrors").html(controller.errorCount(element));
			$("#errorfeedback"+animation).hide();			
			$("#startbtnDv" +animation).show();
			$("#exampletable_startover" +animation).hide();
			$("#goodjobDv" + animation).hide();
			$("#instructionsDv" + animation + " .skipBtn").css("display", "none");
			resetAnimation = true;
			controller.initialise(animation);
		},

		// Reset Animation Method

		fnresetAnimation: function (no) {
			nextCode[parseInt(no)-1] = 1;
			noOftryArray[(no-1)]=0;

			flag = false;
			$("#goodjobDv" + no).css("display", "none");
			$("#ExampleTableCode-"+no+" .skipBtn").hide();
			$("#ExampleTableCode-"+no+" .warningMsg").html('');
			$("#ExampleTableCode-"+no+" table tr td:nth-child(3)").css("visibility","hidden");

			var element = getElement($("#ExampleTableCode-"+no))[0];

			element.correct = 0;
	   		element.errors = 0;

	   		$("#errorfeedback"+no +" .nooferrors").html(controller.errorCount(element));

			resetAnimation = true;
			scoreArray[no-1]=0;
			controller.inputFieldChecking = false;
			controller.initialise(no);
		}
	
	}

	// Controller Class end
	
	// Check Method 

	function check(r, e, num) 
	{

		
		num = parseInt(num);
		isRegExp=true;

		clearTimeout(myVar1);
		clearTimeout(myVar);
		
		
		r=eval(r);
		var maxlength = parseInt(eval(r).toString().length);
		
		var result = (r.exec(e.value));
		var element = getElement($("#ExampleTableCode-"+(num+1)))[0];
		if (result && result[0].length == e.value.length)
		{
			noOftryArray[num]=0;
			$("#warningMsgDv" + animation).html('');
			
			$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" .mark").html('');
			$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").parent().removeClass("hc-example-incorrect").addClass("hc-example-correct");
			element.correct++;
			$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)] + " td:nth-child(3)").css("visibility","visible");
			var val = $("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").attr("answer");
			
			//---Fix code value error 
			if (val.indexOf("'") != -1)
				val = val.split("'").join("&#39;");
			if (val.indexOf("<") != -1)
				val = val.split("<").join("&lt;");
			
			corAnsHtml = $("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").parent().attr("data-html");
			$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").parent().append(corAnsHtml);
			$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").hide();
			
			flag=false;
			
			if (lengthArray[num] != (nextCode[parseInt(num)]))
			{
				controller.coreLogic(nextCode[parseInt(num)], (num+1));
			} else 
			{
			
			var date = new Date();
			endTime = date.getTime();
			var timeDiff = endTime - timerArray[num+1];
			var seconds = Math.floor(timeDiff/1000);
			$("#errorfeedback"+(num+1) +" .timespent").html(", "+seconds+" "+gt.gettext("seconds"));
			$("#errorfeedback"+(num+1)+" .nooferrors").html(controller.errorCount(element));
			if(scoreArray[(num)]<0)
				{
					scoreArray[(num)]=0;
				}
				$("#goodjobDv" + (num+1)).css("display", "block");
				$("#ExampleTableCode-" + animation + " input").unbind("blur keyup");
				$("#ExampleTableCode-"+(num+1)+" .skipBtn").hide();
				clearTimeout(myVar);
				clearTimeout(myVar1);
				setTimeout(function(){controller.inputFieldChecking = false;},500);
				return false;
			}
			
		   $("#instructionsDv" + (num+1) + " .skipBtn").hide();
		}else 
		{ 
			scoreArray[(num)]=scoreArray[(num)]-1;
				
			if(scoreArray[(num)]<0)
			{ 
				scoreArray[(num)]=0;
			}	
										
			num=(num);
			noOftryArray[num]=noOftryArray[num]+1;
			
			if(noOftryArray[num]<maximumTry)
			{
				if (userLastResponce[num] != $("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").val())
				{
					controller.inputFieldBlur = true;
					setTimeout(function(){controller.inputFieldBlur = false;},500);
					totalErrorArray[num]=totalErrorArray[num]+1;
					element.errors++;
				}else{
					element.correct++;
				}
					
					
			
				scoreArray[num]=scoreArray[num]-1;
				$("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" .mark").html(redCheck);
				$("#warningMsgDv" + (num+1)).html(gt.gettext("try_again_msg"));
				$(e).parent().addClass("hc-example-incorrect").addClass("answer-borders");
				$(e).addClass("hc-example-incorrect");
			}else
			{
			  	if (userLastResponce[num] != $("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").val())
				{
					controller.inputFieldBlur = true;
					setTimeout(function(){controller.inputFieldBlur = false;},500);
					totalErrorArray[num]=totalErrorArray[num]+1;
					element.errors++;
				}else{
					element.correct++;
				}
					
				$("#warningMsgDv" + (num+1)).html(gt.gettext("try_again_or_msg"));
				$("#instructionsDv" + (num+1) + " .skipBtn").show();
			}

		}		
		$("#errorfeedback"+(num+1)+" .nooferrors").html(controller.errorCount(element));
		userLastResponce[num] = $("#ExampleTableCode-"+(num+1)+" table .row-"+nextCode[parseInt(num)]+" input").val();
		setTimeout(function(){controller.inputFieldChecking = false;},500);
		return 0;
	}
	
	// On Time out Check Answer Method

	function timeoutAnsCheck()
	{
		// set time out  10 seconds
		clearTimeout(myVar);
		clearTimeout(myVar1);

		myVar = setTimeout(function()
		{                              
			
			$("#warningMsgDv" + animation).html(gt.gettext("enter_press_inst"));
			
			setTimeout(function()
			{
				$("#ExampleTableCode-" + animation + " .tempMsg").css("display", "none");
				$("#warningMsgDv" + animation).html("");
				
			},5000)
			
			clearTimeout(myVar);

			// set timeout 20 seconds
			//console.log("timeoutAnsCheck::",myVar,myVar1)

			myVar1=setTimeout(function()
			{
				clearTimeout(myVar1);
				// $("#warningMsgDv" + animation).html("");
				// $("#ExampleTableCode-" + animation + " .tempMsg").css("display", "none");
				// $("#ExampleTableCode-" + animation + " input").on("focusout");
				// $("#instructionsDv" + animation + " .skipBtn").show();
				controller.bindEvents(currentInputObj);
			},20000);
		
		},10000);
	}
	
	function isIE () {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}
})(horstmann_exampletable = horstmann_exampletable ||{});
var horstmann_exampletable;


