// breakup = window.breakups;
// console.log(breakups);
var desigs = alasql('column of SELECT distinct designation FROM performance');
var consider_bias =	window.consider_bias; 

// if(breakup == "undefined" || breakup == null ||breakup == ""){
// 	$('#breakups').append('<span>'+" Grades Breakup Done Manually"+'</span>');
// }
// else{
// 	console.log(breakup);

// 	var breakups = breakup.split(';');
// 	console.log(breakups);

// 	for (var i = 0; i < breakups.length-1; i++) {
// 		breakup_txt += breakups[i]+"% "
// 	}
// 	$('#breakups').append('<span>'+breakup_txt+'</span>');
// }

for(var i=0; i<desigs.length ;i++){
	var $table = $('<table class="table"></table>');
	var $tbody = $('<tbody></tbody>');
	var $tr = $('<tr class = "breadcrumb"></tr>');

	var n_emps = alasql('column of SELECT count(*) FROM performance where designation = "'+desigs[i]+'"');
	var grades = alasql('column of SELECT distinct grade FROM performance where designation = "'+desigs[i]+'" order by grade asc');
	var grades_text = "";
	for(var j=0; j<grades.length ;j++){
		var n_emps_grades = alasql('column of SELECT count(*) FROM performance where designation = "'+desigs[i]+'" AND grade = "'+grades[j]+'"');
		grades_text = grades_text + '<em>'+grades[j]+'</em>	&nbsp;:'+n_emps_grades+'&nbsp;&nbsp;&nbsp;';
	}

	$tr.append('<td ><b>Designation</b></td>');
	$tr.append('<td><b>'+desigs[i]+'</b></td>');
	$tr.appendTo($tbody);

	var $tr = $('<tr class = "breadcrumb"></tr>');
	$tr.append('<td ><b>Grade Breakup Ratio Given</b></td>');
	var breakup = alasql('column of select breakup from designation where designation = "'+desigs[i]+'"')
	breakup = JSON.stringify(breakup);
	var emptyString = "[\"\"]"
	console.log(breakup);
	if(breakup != emptyString){
		var breakups = breakup.split(';');
		var breakup_txt = "";
		for (var k = 1; k < breakups.length-1; k++) {
			breakup_txt += breakups[k]+"% ";
		}
	}
	else{
		console.log("NA");
		breakup_txt = "NA";
	}
	$tr.append('<td><b>'+breakup_txt+'</b></td>');
	$tr.appendTo($tbody);

	var $tr = $('<tr></tr>');
	$tr.append('<td >Number of Employees</td>');
	$tr.append('<td>'+n_emps+'</td>');
	$tr.appendTo($tbody);
	var $tr = $('<tr></tr>');
	$tr.append('<td > Employee Grade Breakup</td>');
	$tr.append('<td>'+grades_text+'</td>');
	$tr.appendTo($tbody);
	var $tr = $('<tr></tr>');
	$tr.append('<td >Grade Breakup for '+desigs[i]+'</td>');
	var $td = $('<td></td>');
		//--------------------------------------------------------------
		/*Inner Table*/
		var $i_table = $('<table class="table table-striped"></table>');
		var $i_thead = $('<thead></thead>');
		var $i_tbody = $('<tbody></tbody>');
		console.log("Consider Bias:"+consider_bias);
		if(consider_bias == "false"){
			var	dir_cols = ['Number', 'Name', 'Team', 'Manager Review', 'Grade', 'Experience'];
		}
		else{
			var	dir_cols = ['Number', 'Name', 'Team','Manager Review', 'Unbiased Review', 'Grade', 'Experience'];	
		}
		var $i_tr = $('<tr></tr>');
		for(cols in dir_cols){
		$i_tr.append('<th>' + dir_cols[cols] + '</th>');	
		}                                                                                    
		$i_thead.append($i_tr);
		$i_table.append($i_thead);

		if(consider_bias == "false"){
			var emps = alasql('SELECT emp_id,name,team,manager_review,experience,grade FROM performance WHERE designation = "'+desigs[i]+'" order by manager_review desc, experience desc');
		}
		else{
			var emps = alasql('SELECT performance.emp_id,performance.name,performance.team,performance.manager_review,bias.unbiased_review,performance.experience,performance.grade FROM performance JOIN bias ON performance.id = bias.id WHERE performance.designation = "'+desigs[i]+'" order by bias.unbiased_review desc, performance.experience desc');
		}
		for (var j = 0; j < emps.length; j++) {
			var emp = emps[j];
			// console.log(emp);
			var $i_tr = $('<tr></tr>');
			$i_tr.append('<td>' + emp.emp_id + '</td>');
			$i_tr.append('<td>' + emp.name + '</td>');
			$i_tr.append('<td>' + emp.team + '</td>');
			$i_tr.append('<td>' + emp.manager_review + '<\/d>');
			if(consider_bias != "false"){
				$i_tr.append('<td>' + emp.unbiased_review + '<\/d>');
			}
			$i_tr.append('<td>' + emp.grade + '</td>');
			$i_tr.append('<td>' + emp.experience + '</td>');
			$i_tbody.append($i_tr);
		}
		$i_table.append($i_tbody);
		//--------------------------------------------------------------
	$td.append($i_table);
	$td.appendTo($tr);	
	$tr.appendTo($tbody);
	$tbody.appendTo($table);
	$table.appendTo($('#profile'));
}
