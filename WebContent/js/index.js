//------------------------------------------------------------------------------------------------------------>>
/*Initial Variables*/
	// Parse Search Query Params
	var q1 = $.url().param('q1');
	$('input[name="q1"]').val(q1);

	//Session Storage - stores current BO
	var opt = sessionStorage.option ;
	//Session Storage - last breakup 
	var last_breakup = sessionStorage.breakup;
	//BO --fns
	var BO = {};
//--------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------>>
/*Global Functions*/
	//PopitUp func
	/*For Generating Report in Pop-Up*/
	function popitup(url) {
		newwindow=window.open(url,'_blank','height=600,width=800');
		newwindow.breakups = sessionStorage.breakup;
		if (window.focus) {newwindow.focus()}
		return false;
	}
	//RefreshDropdown func
	/*For Refreshing the Dropdown options*/
	refreshDropdown = function () {
		$('#select-default-button').text("Select Default Criteria's")
		$('#select-default').empty();
		var $select_d = $('#select-default');
		var records = alasql('select * from criteria order by id'); 
		for (var i = 0; i < records.length; i++) {
		 	$select_d.append('<li id="'+records[i].id+'"><a href="#">'+records[i].name+'</a></li>');
		}
	}
	//Arrays func	
	/*To Get distinct elements*/
	function arrays( array ) {
	    var distinct = [], unique = [], repeated = [], repeat = [];

	    array.forEach(function(v,i,arr) {
	        arr.splice(i,1);
	        ( distinct.indexOf(v) === -1 ) ? distinct.push(v) : repeat.push(v);
	        ( arr.indexOf(v) === -1 ) ? unique.push(v) : void 0;
	        arr.splice(i,0,v);
	    });

	    // repeat.forEach(function(v,i,arr) {
	    //     ( repeated.indexOf(v) === -1 ) ? repeated.push(v) : void 0;
	    // });
	    // repeat = [];

	    return {
	        "distinct" : distinct,
	        "unique"   : unique,
	        "repeated" : repeated
	    };
	}
//------------------------------------------------------------------------------------------------------------>>
//TableSorter Plugin
	$.tablesorter.themes.bootstrap = {
		// these classes are added to the table. To see other table classes available,
		// look here: http://getbootstrap.com/css/#tables
		table        : 'table table-bordered table-striped',
		caption      : 'caption',
		// header class names
		header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
		sortNone     : '',
		sortAsc      : '',
		sortDesc     : '',
		active       : '', // applied when column is sorted
		hover        : '', // custom css required - a defined bootstrap style may not override other classes
		// icon class names
		icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
		iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
		iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
		iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
		filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
		footerRow    : '',
		footerCells  : '',
		even         : '', // even row zebra striping
		odd          : ''  // odd row zebra striping
	};
//------------------------------------------------------------------------------------------------------------>>
/*Show/Hide Sp. Areas*/
	$('#table-emps').hide();
	$('#table-rec').hide();
	$('#table-perf').hide();
	$('.reset-emps').hide();
	$('.reset-perf').hide();
	$('.reset-rec').hide();
	$('#pager').hide();
	if(opt != "rec"){
		$('#grade-area').hide();
	}


//------------------------------------------------------------------------------------------------------------>>
/*BO Functions ----- Setting Corresponding Data Tables for Search Queries*/
BO.callDirectory = function(q1) {
	console.log("Calliing Directory");
	var emps;
	console.log(q1);

	//--------------------------------------------------------------------------->>
	/*Clear Areas*/
		//1. Search Area 
		$("#search input").val("");
		//2. Table
		$('#thead-emps').empty();$('#tbody-emps').empty();
		//3. GradeArea
		$('#grade-area').hide();
		$('#criteria-area').hide();
		//4. Reset Filters
		$('.reset-emps').show();
		$('.reset-perf').hide();
		$('.reset-rec').hide();		
		/*Show/Hide Sp. Areas*/
		$('#table-emps').show();
		$('#table-rec').hide();
		$('#table-perf').hide();
		$('#pager').show();
	//----------------------------------------------------------------------------<<

	if(q1){
		emps = alasql('SELECT * FROM emp WHERE number LIKE ? OR name LIKE ? OR sex LIKE ? OR birthday LIKE ? OR tel LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' ]);
	}
	else{
		emps = alasql('SELECT * FROM emp', []);

	}	
	dir_cols = ['Number','Name','Gender','Date of Birth','Telephone'];
	var $tr = $('<tr></tr>');
	var $thead = $('#thead-emps');

	$tr.append('<th></th>');	
	for(cols in dir_cols){		
		$tr.append('<th>' + dir_cols[cols] + '</th>');	
	}                                                                                    
	$thead.append($tr);

	var tbody = $('#tbody-emps');
	for (var i = 0; i < emps.length; i++) {
		var emp = emps[i];
		var tr = $('<tr></tr>');
		tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
		tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
		tr.append('<td>' + emp.name + '</td>');
		tr.append('<td>' + emp.sex + '</td>');
		tr.append('<td>' + emp.birthday + '</td>');
		tr.append('<td>' + emp.tel + '</td>');
		tr.appendTo(tbody);
	}	

	//--------------------------------------------------->
	/*AutoComplete Features*/	
		var data_source = [];
		console.log("AutoComplete Feature");
		$('#table-emps').find('td').each(function() {
		  	var value = $(this).text();
		  	if (value!= ""){
		  		data_source.push(value);
		  	}
		});
		data_source = arrays(data_source).distinct;
		//console.log(data_source);
		$("#q1").autocomplete({
 		source: data_source
	});
	//---------------------------------------------------<<

  // call the tablesorter plugin
  $("#table-emps").tablesorter({
    theme : "bootstrap",
    widthFixed: true,
    headerTemplate : '{content} {icon}', 
    widgets : [ "uitheme", "filter", "zebra" ],
    widgetOptions : {
      zebra : ["even", "odd"],
      filter_reset : ".reset-emps",
      filter_cssFilter: "form-control",
    }
  })
  .tablesorterPager({
    container: $("#pager"),
    cssGoto  : ".pagenum",
    removeRows: false,
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
  });
}
BO.callPerf = function(q1){
	//--------------------------->>
	/*Clear Areas*/
		//1. Search Area 
		$("#search input").val("");
		//2. Table
		$('#thead-perf').empty();$('#tbody-perf').empty();
		//3. GradeArea
		$('#grade-area').show();
		$('#criteria-area').hide();
		//4. Reset Filters
		$('.reset-emps').hide();
		$('.reset-perf').show();
		$('.reset-rec').hide();
	//---------------------------<<
	 
	/*Show/Hide Sp. Areas*/
		$('#table-emps').hide();
		$('#table-rec').hide();
		$('#table-perf').show();
		$('#pager').show();

	//-------------------------------------------------------->>
	/*Adding Criteria*/
		$('#add-grade').click(function(){
			var curGrade = $('#grade-area label').last().attr("for");   
		    var nextGrade = String.fromCharCode(curGrade.charCodeAt()+1);
		    $label = '<label style="float:left;" for="'+nextGrade+'">'+nextGrade+':</label>'
		    $input = '<input type="text" class="form-control input-sm" id="'+nextGrade+'" placeholder="'+nextGrade+' %" style="width:50px; padding:1 1 1 1; float:left;">'
		    $('#grade-area .form-inline').append($label);
		    $('#grade-area .form-inline').append($input);
		});
	//<<---------------------------

	//-------------------------------------------------------->>
	/*Assign Grades Button*/
		$('#assign').click(function(){	

		//****** check for != 100 error *********//

		// Steps
		// 1. Get the grades
		// Better to have slide-bar???

			var grade_map = {};
			var curr_grade = 'A';
			var no_grade = $('#grade-area .form-inline input').length;
			var no_emp = $(alasql('SELECT count(*) FROM performance'))['0']['COUNT(*)'];
			var sum = 0;
			last_breakup = "";
			for( var i = 0; i<no_grade; i++){
				last_breakup += ($('#grade-area .form-inline input')[i].value)+";";
				sum += parseInt($('#grade-area .form-inline input')[i].value);
				grade_map[curr_grade] = sum;
				curr_grade = String.fromCharCode(curr_grade.charCodeAt()+1);
			} 
			sessionStorage.breakup = last_breakup;
			if(sum != 100){
				window.confirm("The Grade Percentages you entered does not add up to 100!");
			}
			else{
			// 2. Get the employee list sorted by manager review, then by experience
			while (curr_grade != "A"){
				curr_grade = String.fromCharCode(curr_grade.charCodeAt()-1);
				var perc = grade_map[curr_grade];
				var ids = $(alasql('column of select TOP '+perc+' percent id FROM performance order by manager_review desc, exp desc'));
				var nqs = Array(ids.length).join('?,')+'?';
				var updates = $(alasql('UPDATE performance SET grade="'+curr_grade+'" WHERE id IN ('+nqs+')',ids));	
				}
			//refresh tables
			BO.performance();
			}
		})

	//-------------------------------------------------------->>
	/*Removing Grade*/
		$('#rem-grade').click(function(){
			var curGrade = $('#grade-area label').last().attr("for");   
			if ($('#grade-area label').length > 1){
				$('#grade-area label').last().remove();
				$('#grade-area input').last().remove();
			}
		});

	//<<---------------------------
	//-------------------------------------------------------->>
	/*Generate Report*/

	$('#report').click(function(){
		// var no_grade = $('#grade-area .form-inline input').length;
		// var breakups = [];
		// for( var i = 0; i<no_grade; i++){
		// 	breakups.push($('#grade-area .form-inline input')[i].value);
		// } 
		// console.log(breakups);
		popitup('pop-up.html');
	})	

	//<<---------------------------

	console.log("Calling Performance");
	var emps;
	if(q1){
	emps = alasql('SELECT * FROM performance WHERE emp_id LIKE ? OR name LIKE ? OR department LIKE ? OR designation LIKE ? OR manager_review LIKE ? OR grade LIKE ? OR experience LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' ]);
	}	
	else{
		emps = alasql('SELECT * FROM performance', []);
	}
	dir_cols = ['Number', 'Name', 'Department', 'Designation', 'Manager Review', 'Grade', 'Experience'];
	var $tr = $('<tr></tr>');
	var $thead = $('#thead-perf');

	$tr.append('<th></th>');	
	for(cols in dir_cols){
	$tr.append('<th>' + dir_cols[cols] + '</th>');	
	}                                                                                    
	$thead.append($tr);

	var tbody = $('#tbody-perf');
	for (var i = 0; i < emps.length; i++) {
	var emp = emps[i];
	var tr = $('<tr></tr>');
	tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
	tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
	tr.append('<td>' + emp.name + '</td>');
	tr.append('<td>' + emp.department + '</td>');
	tr.append('<td>' + emp.designation + '</td>');
	tr.append('<td>' + emp.manager_review + '<\/d>');
	tr.append('<td><a href="#" data-pk="'+emp.id+'">' + emp.grade + '</a></td>');
	tr.append('<td>' + emp.experience + '</td>');
	tr.appendTo(tbody);
	}	
	//Make Grade Editable ------------------------------------------------------->>>
	$('#table-perf td:nth-child(7) a').editable({
    type: 'text',
    name: 'grade',
    mode: 'inline',
    url: function(params) {
    	console.log(params);
    	var d = new $.Deferred();
	    if(params.value == "") {
	        return d.reject('Please enter a valid Grade !!'); //returning error via deferred object
	    } else {
	    	console.log('update performance set grade="'+params.value+'" where id = '+params.pk);
	    	alasql('update performance set grade="'+params.value+'" where id = '+params.pk);
	    }
    },
    title: 'Enter Grade'
	});
	//---------------------------------------------------------------------------<<<

	//--------------------------------------------------->
	/*AutoComplete Features*/	
		var data_source = [];
		console.log("AutoComplete Feature");
		$('#table-perf').find('td').each(function() {
		  	var value = $(this).text();
		  	if (value!= ""){
		  		data_source.push(value);
		  	}
		});
		data_source = arrays(data_source).distinct;
		//console.log(data_source);
		$("#q1").autocomplete({
 		source: data_source
	});
	//---------------------------------------------------<<

  // call the tablesorter plugin
  $("#table-perf").tablesorter({
    theme : "bootstrap",
    widthFixed: true,
    headerTemplate : '{content} {icon}', 
    widgets : [ "uitheme", "filter", "zebra" ],
    widgetOptions : {
      zebra : ["even", "odd"],
      filter_reset : ".reset-perf",
      filter_cssFilter: "form-control",
    }
  })
  .tablesorterPager({
    container: $("#pager"),
    cssGoto  : ".pagenum",
    removeRows: false,
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
  });
}
BO.callRec = function(q1){
	//--------------------------->>
	/*Clear Areas*/
		//1. Search Area 
		$("#search input").val("");
		//2. Table
		$('#thead-rec').empty();$('#tbody-rec').empty();
		//3. GradeArea ********SETTING IT UP*************
		$('#grade-area').hide();
		$('#criteria-area').show();
		//4. Reset Filters
		$('.reset-emps').hide();
		$('.reset-perf').hide();
		$('.reset-rec').show();
	//---------------------------<<
	/*Show/Hide Sp. Areas*/
		$('#table-emps').hide();
		$('#table-rec').show();
		$('#table-perf').hide();	
		$('#pager').show();
	//Refresh Criteria Dropdown	
		refreshDropdown();	

//Add Criteria---------------------->
	$('#add-criteria').click(function(){
	$list = $('#list');
	// $li = $('<li class="list-group-item"></li>');
	// $div-column = $('<div class="dropdown" id="div-column"></div>';)
	// $div-operator = $('<div class="dropdown" id="div-operator style="margin:10px"></div>';)
	// $div-value = $('<div class="dropdown" id="div-value style="margin:10px"></div>';)
	// $div-points = $('<div class="dropdown" id="div-points style="margin:10px"></div>';)
	if ($('#list li').length >= 1){
		$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div></li>');
	}
	else{
		$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div><div class="dropdown" style="float:right;"><button onclick="saveCriteria()" id="save-criteria" class="btn-success btn-sm" type="button" style="margin:0"><span class="glyphicon glyphicon-floppy-disk" style="font-size: 15px;"></span> Save Criteria </button></div></li>');
	}

	$list.append($li);
	});
//Remove Criteria---------------------->
	$('#rem-criteria').click(function(){
			if ($('#list li').length >= 1){
				$('#list li').last().remove();
			}
	});
//1. Select Default Criteria
	$('#select-default li').click(function(){
		//Clear the Set criterias
		console.log('Clicked!!');
		$('#list').empty();	
		$button = $('#select-default-button');
		id = $(this).attr("id");
		console.log(id);
		$button.text($('#select-default #'+id).text());
		$button.attr("select",id);
		$button.append('&nbsp <span class="caret"></span>');
		console.log($('#select-default #'+id).text()+' <span class="caret"></span>');

	//2. Display the default values
		var records = alasql('select * from criteria_map where id = '+id); 
		for (var i = 0; i < records.length; i++) {
			$list = $('#list');		
			if (i == 0){
				$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div><div class="dropdown" style="float:right;"><button onclick="saveCriteria()" id="save-criteria" class="btn-success btn-sm" type="button" style="margin:0"><span class="glyphicon glyphicon-floppy-disk" style="font-size: 15px;"></span> Save Criteria </button></div><div class="dropdown" style="float:right;"><button onclick="deleteCriteria()" id="delete-criteria" class="btn-danger btn-sm" type="button" style="margin-left:10px"><span class="glyphicon glyphicon-floppy-remove" style="font-size: 15px;"></span> Delete Criteria </button></div></li>');
			}
			else{			
				$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div></li>');
			}
			col_name = records[i].col_name;
			op = records[i].op;
			val = records[i].val;
			pts = records[i].pts;
			
			$li.find('#sel1 #'+col_name).attr("selected","selected");
			$li.find('#sel2 #'+op).attr("selected","selected");
			$li.find('#sel3').val(val);
			$li.find('#sel4').val(pts);
			$list.append($li);		
		}
		});

//Select Candidates
// 1.1  For each li update points of records
//************CHECK FOR ERROR***********************//
// $('#save-criteria').click(function(){
//     var criteria_name  = prompt("Please enter the Criteria Name", "Criteria Name");
//     //  if (person != null) {
//     //     document.getElementById("demo").innerHTML =
//     //     "Hello " + person + "! How are you today?";
//     // }
// });


$('#select-cand').click(function(){
	//Clear Selected and Points
	var no_cand = parseInt(alasql('column of select count(*) from candidates'));

	if($('#n_emp').val() == ""){
		window.confirm("Please Enter the Number of Candidates Required!");
	}
	else if($('#n_emp').val() > no_cand){
		window.confirm("We only have "+no_cand+" candidates!!");
	}
	else if($('#list li').length == 0){
		window.confirm("Please Select a Criteria First!");
	
	}
	else{
		alasql('update candidates set points = 0 where 1 = 1');
		alasql('update candidates set selected = "No" where 1 = 1');
		var op_map = {
						"eq":"=",
						"lt":"<",
						"lte":"<=",
						"gt":">",
						"gte":">=",
						"lk":"LIKE"
					};
		for (var i = 0; i < $('#list li').length; i++) {
			var $li = $($('#list li')[i]);
			var col = $li.find('#sel1 option:selected').attr('id');
			var op = op_map[$li.find('#sel2 option:selected').attr('id')];
			var val = $li.find('#sel3').val();
			var values = val.split(';');
			var pts = $li.find('#sel4').val();
			var n = $('#n_emp').val();
			var cond = ""
			if (values.length > 1){
				for (var j = 0; j < values.length; j++) {
					if(op == "LIKE"){
						cond = cond + col+' '+op+' "%'+values[j]+'%"';
					}
					else{
						cond = cond + col+' '+op+' "'+values[j]+'"';	
					}
					if (j < (values.length -1)){
						cond = cond+ ' OR ' 
					}
				}
			}
			else{
				if(col =="XII" || col == "cgpa"){
					if(op == "LIKE"){
						cond = col+' '+op+' '+'%'+val+'%';
					}
					else{
						cond = col+' '+op+' '+val;
					}
				}
				else{
					if(op == "LIKE"){
						cond = col+' '+op+' "%'+val+'%"';
					}
					else{ 
						cond = col+' '+op+' "'+val+'"';
					}
			}
			}
			if(col == "skill"){
				var cond1 = cond.replace(/skill/g, "skill1");
				var cond2 = cond.replace(/skill/g, "skill2");
				cond = cond1 +' OR ' + cond2;
			}

			console.log('update candidates set points = points + '+pts+' where '+cond);
			alasql('update candidates set points = points +'+pts+' where '+cond);
		}
	// 2.1 Order the table add-criteriacording to the points
	// 2.2 Select the top n candidates
		var ids = $(alasql('column of select TOP '+n+' id FROM candidates order by points desc'));
		var nqs = Array(ids.length).join('?,')+'?';
		for (var k = 0; k < ids.length; k++) {
			$('#pk-'+ids[k]).attr("data-value","Yes");
		}
		var updates = $(alasql('UPDATE candidates SET selected="Yes" WHERE id IN ('+nqs+')',ids));	
		BO.recruitment();
	}


// // 3. Refresh the page	
// 	$('#thead-rec').empty();$('#tbody-rec').empty();
// 		emps = alasql('SELECT * FROM candidates order by points desc', []);
// 	dir_cols = ['Number', 'Name', 'XII %', 'College', 'Specialization', 'CGPA', 'Skill-1', 'Skill-2', 'Points', 'Selected'];
// 	var $tr = $('<tr></tr>');
// 	var $thead = $('#thead-rec');
// 	$tr.append('<th></th>');	
// 	for(cols in dir_cols){
// 	$tr.append('<th>' + dir_cols[cols] + '</th>');
// 	}                                                                                    
// 	$thead.append($tr);

// 	var tbody = $('#tbody-rec');
// 	for (var i = 0; i < emps.length; i++) {
// 		var emp = emps[i];
// 		var tr = $('<tr></tr>');
// 		tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
// 		tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
// 		tr.append('<td>' + emp.name + '</td>');
// 		tr.append('<td>' + emp.XII + '</td>');
// 		tr.append('<td>' + emp.college + '</td>');
// 		tr.append('<td>' + emp.specialization + '<\/d>');
// 		tr.append('<td>' + emp.cgpa + '</td>');
// 		tr.append('<td>' + emp.skill1 + '</td>');
// 		tr.append('<td>' + emp.skill2 + '</td>');
// 		tr.append('<td>' + emp.points + '</td>');
// 		tr.append('<td><a href="#" data-pk="'+emp.id+'">' + emp.selected + '</a></td>');
// 		tr.appendTo(tbody);
// 	//------------------------------------------------------------------------------<<<	
// 	}
// 	//Make Selected Editable ------------------------------------------------------->>>
// 		$('#table-rec td:nth-child(11) a').editable({
// 	    type: 'text',
// 	    name: 'select',
// 	    mode: 'inline',
// 	    url: function(params) {
// 	    	console.log(params);
// 	    	var d = new $.Deferred();
// 		    if(params.value == "") {
// 		        return d.reject('Please enter a valid Grade !!'); //returning error via deferred object
// 		    } else {
// 		    	console.log('update candidates set selected="'+params.value+'" where id = '+params.pk);
// 		    	alasql('update candidates set selected="'+params.value+'" where id = '+params.pk);
// 		    }
// 	    },
// 	    title: 'Enter Yes or No'
// 		});
});

	


	console.log("Calling Rec");
	var emps;

	if(q1){
	emps = alasql('SELECT * FROM candidates WHERE emp_id LIKE ? OR name LIKE ? OR XII LIKE ? OR college LIKE ? OR specialization LIKE ? OR cgpa LIKE ? OR skill1 LIKE ? OR skill2 LIKE ? OR points LIKE ? OR selected LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' , '%' + q1 + '%'  ]);
	}
	else{
		emps = alasql('SELECT * FROM candidates', []);
	}
	dir_cols = ['Number', 'Name', 'XII %', 'College', 'Specialization', 'CGPA', 'Skill-1', 'Skill-2', 'Points', 'Selected'];
	var $tr = $('<tr></tr>');
	var $thead = $('#thead-rec');
	$tr.append('<th></th>');	
	for(cols in dir_cols){
	$tr.append('<th>' + dir_cols[cols] + '</th>');
	}                                                                                    
	$thead.append($tr);

	var tbody = $('#tbody-rec');
	for (var i = 0; i < emps.length; i++) {
	var emp = emps[i];
	var tr = $('<tr></tr>');
	tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
	tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
	tr.append('<td>' + emp.name + '</td>');
	tr.append('<td>' + emp.XII + '</td>');
	tr.append('<td>' + emp.college + '</td>');
	tr.append('<td>' + emp.specialization + '<\/d>');
	tr.append('<td>' + emp.cgpa + '</td>');
	tr.append('<td>' + emp.skill1 + '</td>');
	tr.append('<td>' + emp.skill2 + '</td>');
	tr.append('<td>' + emp.points + '</td>');
	tr.append('<td><a href="#" data-value='+emp.selected+' id="pk-"'+emp.id+'" data-pk="'+emp.id+'">' + emp.selected + '</a></td>');
	tr.appendTo(tbody);

	//Make Selected Editable ------------------------------------------------------->>>
	$('#table-rec td:nth-child(11) a').editable({
    type: 'select',
    name: 'select',
    mode: 'inline',
    source: '[{value: "Yes", text: "Yes"}, {value: "No", text: "No"}]',
    url: function(params) {
    	console.log(params);
    	var d = new $.Deferred();
	    if(params.value == "") {
	        return d.reject('Please enter a valid Grade !!'); //returning error via deferred object
	    } else {
	    	console.log('update candidates set selected="'+params.value+'" where id = '+params.pk);
	    	console.log($(this));
	    	$(this).attr("data-value",params.value);
	    	alasql('update candidates set selected="'+params.value+'" where id = '+params.pk);	
	    }
    },
    title: 'Enter Yes or No'
	});
	//------------------------------------------------------------------------------<<<

	}

	//--------------------------------------------------->
	/*AutoComplete Features*/	
		var data_source = [];
		console.log("AutoComplete Feature");
		$('#table-rec').find('td').each(function() {
		  	var value = $(this).text();
		  	if (value!= ""){
		  		data_source.push(value);
		  	}
		});
		data_source = arrays(data_source).distinct;
		//console.log(data_source);
		$("#q1").autocomplete({
 		source: data_source
	});
	//---------------------------------------------------<<

  // call the tablesorter plugin
  $("#table-rec").tablesorter({
    theme : "bootstrap",
    widthFixed: true,
    headerTemplate : '{content} {icon}', 
    widgets : [ "uitheme", "filter", "zebra" ],
    widgetOptions : {
      zebra : ["even", "odd"],
      filter_reset : ".reset-rec",
      filter_cssFilter: "form-control",
    }
  })
  .tablesorterPager({
    container: $("#pager"),
    cssGoto  : ".pagenum",
    removeRows: false,
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
  });
}


//-------------------------------------------------------->>
/*Select BO*/
BO.directory = function() {

	
	//Set the Session Variable & url------------------------------------------------
		sessionStorage.option = "directory";


		// window.history.pushState("", "", "/"+"index.html" );
		// var url = window.location.href;  
		// url = url.split( '?' )[0];
		// window.location.replace(url);
	//-------------------------------------------------------------------------------

	//Setting the Dropdown value-----------------------------------------------------
		$(".container .dropbtn").text($(".container #directory").text()); 
		$(".container .dropbtn").append('&nbsp <span class="caret"></span>');
	//-------------------------------------------------------------------------------
	window.location.replace("", "", "/");
	// BO.callDirectory();
}
BO.performance = function() {

	//Set the Session Variable & url
		sessionStorage.option = "perf";
		// window.history.pushState("", "", "/"+"index.html" );


	//Setting the Dropdown value
		$(".container .dropbtn").text($(".container #perf").text()); 
		$(".container .dropbtn").append('&nbsp <span class="caret"></span>');
	//-------------------------------------------------------------------------------
	
	window.location.replace("", "", "/");

	// BO.callPerf();
}
BO.recruitment = function() {

	//Set the Session Variable & url
		sessionStorage.option = "rec";
		// window.history.pushState("", "", "/"+"index.html" );


	//Setting the Dropdown value
		$(".container .dropbtn").text($(".container #rec").text()); 
		$(".container .dropbtn").append('&nbsp <span class="caret"></span>');
	//--------------------------->>
	// BO.callRec();
	window.location.replace("", "", "/");
}
//<<---------------------------

// if(q1){
	if(opt == "directory"){

		//--------------------------------------------------------------------------->>
		/*Clear Areas*/
			$('#thead-emps').empty();$('#tbody-emps').empty();
		//Setting the Dropdown value-----------------------------------------------------
			$(".container .dropbtn").text($(".container #directory").text()); 
			$(".container .dropbtn").append('&nbsp <span class="caret"></span>');
		BO.callDirectory(q1);
	}
	else if(opt =="perf"){
		//--------------------------------------------------------------------------->>
		/*Clear Areas*/
			$('#thead-perf').empty();$('#tbody-perf').empty();
		//Setting the Dropdown value
			$(".container .dropbtn").text($(".container #perf").text()); 
			$(".container .dropbtn").append('&nbsp <span class="caret"></span>');
		BO.callPerf(q1);
	}	
	else if(opt == "rec"){
		//--------------------------------------------------------------------------->>
		/*Clear Areas*/
			$('#thead-rec').empty();$('#tbody-rec').empty();
		//Setting the Dropdown value
			$(".container .dropbtn").text($(".container #rec").text()); 
			$(".container .dropbtn").append('&nbsp <span class="caret"></span>');

		BO.callRec(q1);
	}
// }


// $('#save-criteria').click(function(){
//     var criteria_name  = prompt("Please enter the Criteria Name", "Criteria Name");
//     //  if (person != null) {
//     //     document.getElementById("demo").innerHTML =
//     //     "Hello " + person + "! How are you today?";
//     // }
// });

saveCriteria = function() {
	    var criteria_name  = prompt("Please input a Criteria Name", "Criteria Name");
	    var records = alasql('select * from criteria where name = "'+criteria_name+'"');
	    var flag = false;
	    var r = true;
	    if (records.length != 0){
    			r = window.confirm("Criteria Name Already Exists, Press OK to Overwrite!");
    			if(r == true){
					var selected_id = $('#select-default-button').attr("select");
					console.log('delete from criteria where id = '+selected_id);
					console.log('delete from criteria_map where id = '+selected_id);
					alasql('delete from criteria where id = '+selected_id);
					alasql('delete from criteria_map where id = '+selected_id);

				// $('#error').text('Criteria could not be added as it already exists!!!');
				// $('#error').css('display','inline');
				// $('#noerror').css('display','none');
    			}
 			// 	$('#error').delay(3000).fadeOut()	    
 			} 
	    if(r == true){
			for (var i = 0; i < $('#list').length; i++) {
				if (flag){break;}
				var $li = $($('#list li')[i]);
				var val1 = $li.find('#sel1 option:selected').attr('id');
				var val2 = $li.find('#sel2 option:selected').attr('id');
				var val3 = $li.find('#sel3').val();
				var val4 = $li.find('#sel4').val();

				if(val1 == "" || val2 == "" || val3 == "" || val4 == "" || criteria_name == ""){
					flag = true;
				}

			}
        	if(flag){
        		$('#error').text('Criteria Not Added as Empty Records Detected!!!');
				$('#error').css('display','inline');
 				$('#noerror').css('display','none');
				$('#error').delay(3000).fadeOut()	

        	}
        	else{	
			console.log('Inserting new Criteria into db');  		
        		var id = parseInt(alasql('column of SELECT MAX(id) FROM criteria'));
        		if(id == null || id == undefined || isNaN(parseFloat(id))){
        			id = 0;
        		}        		
	        	id = id + 1;
	        	//1. Update Criteria
	        	var arr = [];
	        	arr.push(id);
	        	arr.push(criteria_name);
	        	var update = alasql('insert into criteria values (?,?)',arr);
	        	// alasql('select * from criteria')

	        	//2. Update Criteria_Map
				for (var i = 0; i < $('#list li').length; i++) {
			  		var arr = [];
					var $li = $($('#list li')[i]);
		        	var map_id = parseInt(alasql('column of SELECT MAX(map_id) FROM criteria_map'));
		        	if(map_id == null || map_id == undefined || isNaN(parseFloat(map_id))){
        				map_id = 1;
        			}  
		        	arr.push(map_id);
		        	arr.push(id);
					arr.push($li.find('#sel1 option:selected').attr('id'));
					arr.push($li.find('#sel2 option:selected').attr('id'));
					arr.push($li.find('#sel3').val());
					arr.push(parseInt($li.find('#sel4').val()));
					var update = alasql('insert into criteria_map values (?,?,?,?,?,?)',arr);
					map_id = map_id + 1;
				  	}  
				//3. Update the dropdown
	        	var $select_d = $('#select-default');
	        	$select_d.append('<li id="'+id+'"><a href="#">'+criteria_name+'</a></li>');
					BO.recruitment();	
				//4. Display Success Message				  		
					$('#noerror').text("Criteria Successfully Added !!!");
					$('#noerror').css('display','inline');
					$('#error').css('display','none');
	 				$('#noerror').delay(3000).fadeOut();	
 			}  			  	
        	
    	}
  
};

deleteCriteria = function() {

	var records = alasql('select * from criteria;');
	if (records.length == 0){
		$('#error').text("No Records to Deleted !!!")
		$('#error').css('display','inline');
		$('#noerror').css('display','none');
		$('#error').delay(3000).fadeOut()	
	}
	else{

	var selected_id = $('#select-default-button').attr("select");
	alasql('delete from criteria where id = '+selected_id);
	alasql('delete from criteria_map where id = '+selected_id);
	
	$('#noerror').text("Successfully Deleted !!!")
	$('#noerror').css('display','inline');
	$('#error').css('display','none');
	$('#noerror').delay(3000).fadeOut()	  		
	refreshDropdown();
	BO.recruitment();	
	}
}

