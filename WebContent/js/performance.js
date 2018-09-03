//------------------------------------------------------------------------------------------------------------>>
/*Initial Variables*/
	// Parse Search Query Params
	var q1 = $.url().param('q1');
	$('input[name="q1"]').val(q1);
	var consider_bias = "false";
	//Session Storage - last breakup 
	 
	var BO = {};
		// var desig_list = alasql('column of SELECT unique designation from performance');
		// var breakup = { 
		// 					'ASE':"",
		// 					'SSE':"",
		// 					'SE':"",
		// 					'Analyst':"",
		// 					'Tester':"",
		// 					'Designer':"",
		// 					'TL':"",			
		// 					};
		// sessionStorage.breakup = breakup ;


//--------------------------------------------------------------------------------------------------------------
//-------------------------------------
/*Dialog listing the default breakups*/
$( "#dialog" ).dialog({ autoOpen: false });
$( "#dialog" ).dialog( "option", "width", 400 );
// $( "#dialog" ).dialog({modal: true});
$( "#opener" ).click(function() {
  $( "#dialog" ).dialog( "open" );
});


//------------------------------------------------------------------------------------------------------------>>
/*Clear Global Search*/
	$(".hasclear").keyup(function () {
		$('#searchclear').show();
	    var t = $(this);
	    t.next('span').toggle(Boolean(t.val()));
	});
	// $("#searchclear").hide($(this).prev('input').val());
	$("#searchclear").click(function () {
	    $(this).prev('input').val('').focus();
	    $(this).hide();
        // history.pushState({}, '', '/performance.html');
        history.pushState({}, '', '/inventory-i18n-task2/performance.html');
              
		BO.callPerf();
	});
//--------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------>>
/*Global Functions*/
	//PopitUp func
		/*For Generating Report in Pop-Up*/
		function popitup(url) {
			newwindow=window.open(url,'_blank','height=600,width=800');
			// newwindow.breakups = sessionStorage.breakup;
			newwindow.consider_bias = consider_bias;
			if (window.focus) {newwindow.focus()}
			return false;
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

		//Step 1. Populate bias table
		//1. Calculate the avg of each team 
		//if bias empty, populate it
		function udpateUB() {
			var test = alasql('select * from bias');
			// alasql('INSERT INTO bias(id, team, unbiased_review) select id, team, manager_review as unbiased_review from performance');
			//2. Calculate their avg.
			var avgs = [];
			var teams = [];
			var total = 0;
			teams = alasql('column of select distinct team from performance order by team');
			for (var i = 0; i < teams.length; i++) {
				var avg_i = parseFloat(alasql('column of select AVG(manager_review) from performance where team = "'+teams[i]+'"'));
				avg_i = Math.round(avg_i);
				total += avg_i;
				avgs.push(avg_i);
			}
			avg = Math.round(total/teams.length);
			console.log("avg - "+avg);
			console.log("avgs - "+avgs);
			var diffs = [];
			for (var i = 0; i < avgs.length; i++) {	
				diffs.push(avg - avgs[i]);
			}	
			console.log("diffs - "+diffs);	
			//3. Change the Mgr reviews and add it to unbiased_review in the Bias table
			for (var i = 0; i < teams.length; i++) {
		    	alasql('update bias set unbiased_review = unbiased_review + '+diffs[i]+' where team = "'+teams[i]+'"');			
		    	console.log('Updated Bias Table');
			}		
	    	alasql('update bias set unbiased_review = 10 where unbiased_review > 10');		
	    	alasql('update bias set unbiased_review = 1 where unbiased_review < 1');		
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
//-------------------

//------------------------------------------------------------------------------------------------------------>>
/*Performance Specific Functions*/
	//-------------------------------------------------------->>
	/*Add Grade Breakup*/
		$('#add-grade').click(function(){
			$list = $('#list');
			var $li = $('<li class="list-group-item" ><div class="dropdown" id="div-desig"><label for="sel1">Designation:</label><select class="form-inline" id="sel1"><option id = "Designer">Designer</option><option id = "SE">SE</option><option id = "Tester">Tester</option><option id = "TL">TL</option></select></div><div class="dropdown" id="div-A" style="margin-left:15px;"><label for="A">A:</label><input type="text" class ="input-xs" id="A" placeholder="A %" style="width:40px;"></div><div class="dropdown" id="div-add" style="margin-left:15px; "><span  class="add-option glyphicon glyphicon-plus-sign"></span> </div></li>');
			/*	var curGrade = $('.grade-breakup-area label').last().attr("for");   
		    var nextGrade = String.fromCharCode(curGrade.charCodeAt()+1);
		    $label = '<label style="float:left;" for="'+nextGrade+'">'+nextGrade+':</label>'
		    $input = '<input type="text" class="form-control input-sm" id="'+nextGrade+'" placeholder="'+nextGrade+' %" style="width:50px; padding:1 1 1 1; float:left;">'
		    $('.grade-breakup-area').append($label);
		    $('.grade-breakup-area').append($input);*/
			$list.append($li);

		});
	//---------------------------------------------------------
	//-------------------------------------------------------->>
	/*Add individual Grade*/
		$(document).on('click', '.add-option', function(){ 
			var $parent = $(this).parent();
			var curGrade = $parent.prev().find('label').attr('for');
		    var nextGrade = String.fromCharCode(curGrade.charCodeAt()+1);    
			console.log(curGrade +"  "+nextGrade);
			var $newDiv = $('<div class="dropdown" id="div-'+nextGrade+'" style="margin-left:15px;"><label for="'+nextGrade+'">'+nextGrade+':</label><input type="text" class "input-xs" id="'+nextGrade+'" placeholder="'+nextGrade+' %" style="width:40px;"></div>');
			$parent.before($newDiv);
		});
	//-------------------------------------------------------->>
	/*Removing Grade*/
		$('#rem-grade').click(function(){
			if ($('#list li').length >= 1){
				$('#list li').last().remove();
			}
			// var curGrade = $('.grade-breakup-area label').last().attr("for");   
			// if ($('.grade-breakup-area label').length > 1){
			// 	$('.grade-breakup-area label').last().remove();
			// 	$('.grade-breakup-area .form-control').last().remove();
			// }
		});
	//---------------------------------------------------------
	//-------------------------------------------------------->>
	/*Assign Grades Button*/
		$('#assign').click(function(){	

			//****** check for != 100 error *********//
			// Steps
			// 1. Get the grades
			// Better to have slide-bar???
			if($('#list li').length == 0){
	        		$('#error').text('No Breakup Given!!!');
					$('#error').css('display','inline');
	 				$('#noerror').css('display','none');
					$('#error').delay(3000).fadeOut()	
			}

			for (var i = 0; i < $('#list li').length; i++) {
				var grade_map = {};
				var curr_grade = 'A';
				var no_grade = $($('#list li')[i]).find('div').length - 2;
				var desig = $($('#list li')[i]).find('#sel1 option:selected').attr('id');
				var no_emp = $(alasql('column of SELECT count(*) FROM performance where designation = "'+desig+'"'));
				var sum = 0;
				var flag = true;
				last_breakup = ";";
				for( var j = 0; j<no_grade; j++){
					last_breakup += $($('#list li')[i]).find('#'+curr_grade).val()+";";
					sum += parseInt($($('#list li')[i]).find('#'+curr_grade).val());
					grade_map[curr_grade] = sum;
					curr_grade = String.fromCharCode(curr_grade.charCodeAt()+1);
				} 
				// breakup[desig] = last_breakup;
				//store the last breakup details in db for report generation
				
				if(sum != 100){
					window.confirm("The Grade Percentages you entered does not add up to 100!");
					flag = false;
				}
				else{
					var log = alasql('UPDATE designation SET breakup = "'+last_breakup+'" where designation = "'+desig+'"');
					console.log('UPDATE designation SET breakup = "'+last_breakup+'" where designation = "'+desig+'"');
					// 2. Get the employee list sorted by manager review, then by experience
					while (curr_grade != "A"){
						curr_grade = String.fromCharCode(curr_grade.charCodeAt()-1);
						var perc = grade_map[curr_grade];
						console.log(consider_bias);
						if(consider_bias == "false"){
							var ids = $(alasql('column of select TOP '+perc+' percent id FROM performance where designation = "'+desig+'" order by manager_review desc, experience desc'));
							var nqs = Array(ids.length).join('?,')+'?';
							var updates = $(alasql('UPDATE performance SET grade="'+curr_grade+'" WHERE id IN ('+nqs+')',ids));	
						}
						else{
							console.log('Updated using join ;)');	
							var ids = $(alasql('column of select TOP '+perc+' percent performance.id FROM performance JOIN bias ON performance.id = bias.id where performance.designation = "'+desig+'" order by bias.unbiased_review desc, performance.experience desc'));
							var nqs = Array(ids.length).join('?,')+'?';
							var updates = $(alasql('UPDATE performance SET grade="'+curr_grade+'" WHERE id IN ('+nqs+')',ids));	
						}
					}
				console.log("Message should be displayed");	
				$('#noerror').text("Grades Successfully Assigned !!!");
				$('#noerror').css('display','inline');
				$('#error').css('display','none');
 				$('#noerror').delay(3000).fadeOut();	
				}		
			}
			if(flag){
				// sessionStorage.breakup = breakup;	
				// console.log(breakup);
				if(consider_bias == "false"){BO.callPerf();}
				else{BO.callUBPerf("",false);}
			}
		})
	//---------------------------------------------------------
	//-------------------------------------------------------->>
	/*Generate Report*/
		$('#report').click(function(){
			popitup('pop-up.html');
		})	
	//---------------------------
	//-------------------------------------------------------->>
//--------------------------------
//------------------------------------------------------------------------->>
/*BO Functions ----- Setting Corresponding Data Tables for Search Queries*/
	BO.callPerf = function(q1){

		/*Clear Areas*/
	  	//Added Destroy Table to trigger update properly
	  		$("#table-perf").trigger("destroy");
			$('#thead-perf').empty();$('#tbody-perf').empty();
		/*Populating the Performanc Table*/
			console.log("Calling Performance");
			var emps;
			if(q1){
			emps = alasql('SELECT * FROM performance WHERE emp_id LIKE ? OR name LIKE ? OR team LIKE ? OR designation LIKE ? OR manager_review LIKE ? OR grade LIKE ? OR experience LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' ]);
			}	
			else{
				emps = alasql('SELECT * FROM performance', []);
			}
			dir_cols = ['Number', 'Name', 'Team', 'Designation', 'Manager Review', 'Grade', 'Experience'];
			var $tr = $('<tr></tr>');
			var $thead = $('#thead-perf');

			$tr.append('<th  class ="emp-img"><input type="checkbox"></th>');	
			for(cols in dir_cols){
				$tr.append('<th>' + dir_cols[cols] + '</th>');	
			}                                                                                    
			$thead.append($tr);

			var tbody = $('#tbody-perf');
			for (var i = 0; i < emps.length; i++) {
				var emp = emps[i];
				var tr = $('<tr></tr>');
				tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"><input type="checkbox"></td>');
				tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
				tr.append('<td>' + emp.name + '</td>');
				tr.append('<td>' + emp.team + '</td>');
				tr.append('<td>' + emp.designation + '</td>');
				tr.append('<td>' + emp.manager_review + '<\/d>');
				tr.append('<td><a href="#" id=pk-'+emp.id+' data-pk="'+emp.id+'">' + emp.grade + '</a></td>');
				tr.append('<td>' + emp.experience + '</td>');
				tr.appendTo(tbody);
			}	
		//--------------------------------------------------->
		/*Make Grade Editable*/	
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
			    	if($('#pk-'+params.pk).parent().parent().find("input[type=checkbox]").prop("checked")){
				    			var $ids = $("#table-perf tbody tr").find("input:checked").parent().parent().find('.editable');
				    			var ids = [];
				    			$ids.each(function() {
				    				ids.push(parseInt($(this).attr("id").replace("pk-","")));
				    			});
				    			for (var i = 0; i < ids.length; i++) {
				    				console.log('update performance set grade="'+params.value+'" where id = '+ ids[i]);
							    	alasql('update performance set grade="'+params.value+'" where id = '+ ids[i]);	
							    	$('#pk-'+ids[i]).text(params.value);
				    			}
				    			// BO.callRec();
				    	}
				    	else{
			    				console.log('update performance set grade="'+params.value+'" where id = '+params.pk);
			    				alasql('update performance set grade="'+params.value+'" where id = '+params.pk);
			    		}
			    }
		    },
		    title: 'Enter Grade'
		});
		//---------------------------------------------------------------------------<<<
		//Quicksearch
		$('input#q1').quicksearch('table#table-perf tbody tr');
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
		//--------------------------------------------------->
		/*Call the tablesorter plugin*/
	  		$("#table-perf").tablesorter({
			    theme : "bootstrap",
			    widthFixed: true,
			    headerTemplate : '{content} {icon}', 
			    widgets : [ "uitheme", "filter", "zebra" ],
			    widgetOptions : {
			      zebra : ["even", "odd"],
			      filter_reset : ".reset-perf",
			      filter_cssFilter: "form-control",
			    },
		 	 	headers: {
		      	'.emp-img' : {
		        sorter: false,
		        filter: false
		      	}}
			  })
		  .tablesorterPager({
		    container: $("#pager"),
		    cssGoto  : ".pagenum",
		    removeRows: false,
		    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
		  });
	}

	BO.callUBPerf = function(q1,bool){

		if(bool){
			console.log("Updating UB");
			udpateUB();
		}
		//Step 2. Join bias table with Performance and then display :)		

		/*Clear Areas*/
	  	//Added Destroy Table to trigger update properly
	  		$("#table-perf").trigger("destroy");
			$('#thead-perf').empty();$('#tbody-perf').empty();
		/*Populating the Performanc Table*/
			console.log("Calling Performance");
			var emps;
			if(q1){
				//#change 1
			emps = alasql('SELECT * FROM performance JOIN bias ON performance.id = bias.id WHERE performance.emp_id LIKE ? OR performance.name LIKE ? OR performance.team LIKE ? OR performance.designation LIKE ? OR performance.manager_review LIKE ? OR performance.grade LIKE ? OR performance.experience LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' ]);
			}	
			else{
				//#change 2
				emps = alasql('SELECT * FROM performance JOIN bias ON performance.id = bias.id', []);
			}
			dir_cols = ['Number', 'Name', 'Team', 'Designation', 'Manager Review','Unbiased Review', 'Grade', 'Experience'];
			var $tr = $('<tr></tr>');
			var $thead = $('#thead-perf');

			$tr.append('<th  class ="emp-img"><input type="checkbox"></th>');	
			for(cols in dir_cols){
				$tr.append('<th>' + dir_cols[cols] + '</th>');	
			}                                                                                    
			$thead.append($tr);

			var tbody = $('#tbody-perf');
			for (var i = 0; i < emps.length; i++) {
				var emp = emps[i];
				var tr = $('<tr></tr>');
				tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"><input type="checkbox"></td>');
				tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
				tr.append('<td>' + emp.name + '</td>');
				tr.append('<td>' + emp.team + '</td>');
				tr.append('<td>' + emp.designation + '</td>');
				tr.append('<td>' + emp.manager_review + '<\/d>');
				tr.append('<td>' + emp.unbiased_review + '</td>');
				tr.append('<td><a href="#" id=pk-'+emp.id+'" data-pk="'+emp.id+'">' + emp.grade + '</a></td>');
				tr.append('<td>' + emp.experience + '</td>');
				tr.appendTo(tbody);
			}	
		//--------------------------------------------------->
		/*Make Grade Editable*/	
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
					    	if($('#pk-'+params.pk).parent().parent().find("input[type=checkbox]").prop("checked")){
				    			var $ids = $("#table-perf tbody tr").find("input:checked").parent().parent().find('.editable');
				    			var ids = [];
				    			$ids.each(function() {
				    				ids.push(parseInt($(this).attr("id").replace("pk-","")));
				    			});
				    			for (var i = 0; i < ids.length; i++) {
							    	alasql('update performance set selected="'+params.value+'" where id = '+ ids[i]);	
							    	$('#pk-'+ids[i]).text(params.value);
				    			}
				    			// BO.callRec();
					    	}
					    	else{
					    	console.log('update performance set grade="'+params.value+'" where id = '+params.pk);
					    	alasql('update performance set grade="'+params.value+'" where id = '+params.pk);
					    	}
				    }
			    },
			    title: 'Enter Grade'
			});
		//---------------------------------------------------------------------------<<<

		//Quicksearch
		$('input#q1').quicksearch('table#table-perf tbody tr');
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
		//--------------------------------------------------->
		/*Call the tablesorter plugin*/
	  		$("#table-perf").tablesorter({
			    theme : "bootstrap",
			    widthFixed: true,
			    headerTemplate : '{content} {icon}', 
			    widgets : [ "uitheme", "filter", "zebra" ],
			    widgetOptions : {
			      zebra : ["even", "odd"],
			      filter_reset : ".reset-perf",
			      filter_cssFilter: "form-control",
			    },
		 	 	headers: {
		      	'.emp-img' : {
		        sorter: false,
		        filter: false
		      	}}
			  })
		  .tablesorterPager({
		    container: $("#pager"),
		    cssGoto  : ".pagenum",
		    removeRows: false,
		    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
		  });



	}

//Main -- Execution
BO.callPerf(q1);

$("#checkbox").change(function() {
    if(this.checked) {
    	consider_bias = "true";
		console.log(consider_bias);
        console.log("Calculate Bias");
        BO.callUBPerf(q1,true);
    }
    else{
    	consider_bias = "false";
		console.log(consider_bias);
    	console.log("Reset");
    	BO.callPerf(q1);
    }
});

$(document).on('click', '.tablesorter-header-inner input', function(){ 
      if(this.checked){
      	console.log("Checked");
       	$('#table-perf tbody tr').not('.filtered').find("input[type=checkbox]").prop('checked', true);
		// $("#table-perf tbody .filtered").find("input[type=checkbox]").removeAttr("checked");
		$('#table-perf tbody tr').not('.filtered').find("input[type=checkbox]").parent().parent().addClass("checked");

      }
      else{
      	console.log("Unchecked tbody");
		$("#table-perf tbody tr").find("input[type=checkbox]").removeAttr("checked");
		$("#table-perf tbody tr").find("input[type=checkbox]").parent().parent().removeClass("checked");;

      }
});

$(document).on('keyup','input.tablesorter-filter.form-control', function(){
	console.log("Changing!");
  		if (!this.value) {
  			if($('#table-perf tbody tr').not('.filtered').find("input[type=checkbox]").prop("checked")){
     			$('.tablesorter-header-inner input').prop("indeterminate", true);
  			}
  			else{
     			$('.tablesorter-header-inner input').removeAttr("checked");	
     		}
		}
		else{
 			$('.tablesorter-header-inner input').prop("indeterminate", false);
   			$('.tablesorter-header-inner input').removeAttr("checked");	
		}
});

$($("#table-perf tbody tr").find("input[type=checkbox]")).change(function(){
	if ($(this).is(':checked')) {
	    $(this).parent().parent().addClass("checked");;
	}
	else{
	    $(this).parent().parent().removeClass("checked");;
	}
});


