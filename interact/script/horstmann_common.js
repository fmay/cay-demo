var gt = new Gettext({
    domain: 'en_US',
    locale_data: {
        en_US : {
            '' : {
                'plural-forms'  : "nplurals=2; plural=(n != 1);"
            },
            
            'Press start to begin.' : [ null, 'Press start to begin.' ],
            'Select the next action.' : [ null, 'Select the next action.' ],
            'Time' : [ null, 'Time' ],
            'seconds' : [ null, 'seconds' ],
            'One correct' : [ '%1 correct', 'One correct', '%1 correct' ],
            'One error' : [ '%1 errors', 'one error', '%1 errors' ],
            'Try again' : [ null, 'Try again!' ],
            'Good job' : [ null, 'GOOD JOB!' ],
            'Done' : [ null, 'Done' ],
            'Start over' :  [ null, 'Start over' ],
            'Next input' : [ null, 'Next input' ],
            'Store as largest' : [ null, 'Store as largest' ],
	    'start_button' : [null, 'Start'],
	    'next_step_button' : [null, 'See next step'],
	    'enter_press_inst' : [null, 'Press Enter when done.'],
            'more_remove_inst' : [null, "Click on the variable names in the table."],
            'more_trash_inst' : [null, "Keep dragging to the trash."],
	    'new_value_inst' : [null, 'Please enter the new value of'],
	    'click_line_inst' : [null, 'Please click on the next line.'],
	    'click_variable_inst' : [null, 'Please click on the variables that are now out of scope.'],
	    'new_value_small_inst' : [null, 'Please enter the new'],
	    'try_again_or_msg' : [null, 'Try again, or'],
	    'try_again_msg' : [null, 'Try again'],
	    'wrong_line_msg' : [null, 'Wrong line selected;'],
	    'wrong_indent_msg' : [null, 'Line is not indented correctly; try again.'],
	    'wrong_variable_msg' : [null, 'Wrong variable selected;'],
	    'incomplete_attempt_msg' : [null, 'Still incomplete.'],
	    'incorrect_line_msg' : [null, 'The marked line is not a part of the solution.'],
	    'text_entry_inst' : [null, 'Complete the second column. Press Enter to submit each entry.'],
	    'rearrange_inst' : [null, 'Order the statements by dragging them into the left window. Use the guidelines for proper indenting.'],
	    'browserwarning' : [null, "Please upgrade Internet Explorer browser on your machine to version 9 or greater."],
	    'od_draw_arrow' :  [null, "Draw the arrow."],
	    'od_enter_value' :  [null, "Enter the new value."],
	    'od_click_next' :  [null, "Click "],
	    /*Old od_drag_remove*/
	    'od_remove_variable' :  [null, "Drag the variable to the trash."],
	    'od_remove_variables' :  [null, "Drag the variables to the trash."],
	    'od_remove_object' :  [null, "Drag the object to the trash."],
	    'od_remove_objects' :  [null, "Drag the objects to the trash."],
	    'od_remove_variable_object' :  [null, "Drag the variable(s)/object(s) to the trash."],

	    'od_start_over_msg' :  [null, "Press Start Over button to restart the activity."],
            'vs_submit_scores' :  [null, "Submit scores to VitalSource"],
        }
    }
})

function _(msgid) { return gt.gettext(msgid); }

var horstmann_config = {
  vitalsource_buttons: false,
  vitalsource_debug: false,
}
