vacancy = window.vacancy;
console.log(vacancy);
var no_selected = alasql('column of SELECT count(*) from candidates where selected = "Yes"');

if(vacancy == "undefined" || vacancy == null ||vacancy == ""){
	vacancy = "Custom"
}

$('#vacancy').append(" "+vacancy);
$('#no-selected').append(" "+no_selected);

		var $table = $('<table class="table"></table>');
		var $tbody = $('<tbody></tbody>');
		var $tr = $('<tr></tr>');
		var key = 1;
		emps = alasql('SELECT emp_id,name,points FROM candidates where selected="Yes" order by points desc');
		dir_cols = ['Sl.No','Application No', 'Name', 'Points'];

		for(cols in dir_cols){
			$tr.append('<th>' + dir_cols[cols] + '</th>');
		}                                                                                    
		$tr.appendTo($tbody);

		for (var i = 0; i < emps.length; i++) {
			var emp = emps[i];
			var tr = $('<tr class = "breadcrumb"></tr>');
			tr.append('<td>' + (key++) + '</td>');
			tr.append('<td>' + emp.emp_id + '</td>');
			tr.append('<td>' + emp.name + '</td>');
			tr.append('<td>' + emp.points + '</td>');
			tr.appendTo($tbody);
		}
		$tbody.appendTo($table);
		$table.appendTo($('#profile'));

// for(var i=0; i<desigs.length ;i++){
// 	var $table = $('<table class="table"></table>');
// 	var $tbody = $('<tbody></tbody>');
// 	var $tr = $('<tr class = "breadcrumb"></tr>');

// 	var n_emps = alasql('column of SELECT count(*) FROM performance where designation = "'+desigs[i]+'"');
// 	var grades = alasql('column of SELECT distinct grade FROM performance where designation = "'+desigs[i]+'" order by grade asc');
// 	var grades_text = "";
// 	for(var j=0; j<grades.length ;j++){
// 		var n_emps_grades = alasql('column of SELECT count(*) FROM performance where designation = "'+desigs[i]+'" AND grade = "'+grades[j]+'"');
// 		grades_text = grades_text + '<em>'+grades[j]+'</em>	&nbsp;:'+n_emps_grades+'&nbsp;&nbsp;&nbsp;';
// 	}

// 	$tr.append('<td ><b>Designation</b></td>');
// 	$tr.append('<td><b>'+desigs[i]+'</b></td>');
// 	$tr.appendTo($tbody);
// 	var $tr = $('<tr></tr>');
// 	$tr.append('<td >Number of Employees</td>');
// 	$tr.append('<td>'+n_emps+'</td>');
// 	$tr.appendTo($tbody);
// 	var $tr = $('<tr></tr>');
// 	$tr.append('<td > Employee Grade Breakup</td>');
// 	$tr.append('<td>'+grades_text+'</td>');
// 	$tr.appendTo($tbody);
// 	var $tr = $('<tr></tr>');
// 	$tr.append('<td >Grade Breakup for '+desigs[i]+'</td>');
// 	var $td = $('<td></td>');
// 		//--------------------------------------------------------------
// 		/*Inner Table*/
// 		var $i_table = $('<table class="table table-striped"></table>');
// 		var $i_thead = $('<thead></thead>');
// 		var $i_tbody = $('<tbody></tbody>');
// 		var	dir_cols = ['Number', 'Name', 'Designation', 'Manager Review', 'Grade', 'Experience'];
// 		var $i_tr = $('<tr></tr>');
// 		for(cols in dir_cols){
// 		$i_tr.append('<th>' + dir_cols[cols] + '</th>');	
// 		}                                                                                    
// 		$i_thead.append($i_tr);
// 		$i_table.append($i_thead);

// 		var emps = alasql('SELECT emp_id,name,department,manager_review,experience,grade FROM performance WHERE designation = "'+desigs[i]+'" order by manager_review desc, experience desc');
// 		for (var j = 0; j < emps.length; j++) {
// 			var emp = emps[j];
// 			// console.log(emp);
// 			var $i_tr = $('<tr></tr>');
// 			$i_tr.append('<td>' + emp.emp_id + '</td>');
// 			$i_tr.append('<td>' + emp.name + '</td>');
// 			$i_tr.append('<td>' + emp.department + '</td>');
// 			$i_tr.append('<td>' + emp.manager_review + '<\/d>');
// 			$i_tr.append('<td>' + emp.grade + '</td>');
// 			$i_tr.append('<td>' + emp.experience + '</td>');
// 			$i_tbody.append($i_tr);
// 		}
// 		$i_table.append($i_tbody);
// 		//--------------------------------------------------------------
// 	$td.append($i_table);
// 	$td.appendTo($tr);	
// 	$tr.appendTo($tbody);
// 	$tbody.appendTo($table);
// 	$table.appendTo($('#profile'));
// }
