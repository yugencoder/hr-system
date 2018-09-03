//------------------------------------------------------------------------------------------------------------>>
/*Initial Variables*/
	// Parse Search Query Params
		var q1 = $.url().param('q1');
		$('input[name="q1"]').val(q1);
	//BO --fns
		var BO = {};
		var last_vacancy = sessionStorage.vacancy;

//--------------------------------------------------------------------------------------------------------------



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
        // history.pushState({}, '', '/recruitment.html');
        history.pushState({}, '', '/inventory-i18n-task2/recruitment.html');
		BO.callRec();
	});
//--------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------>>
/*Global Functions*/
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
	/*For Refreshing the Criteria Dropdown options*/
		refreshDropdown = function () {
			$('#select-default-button').text("Select Default Criteria ")
			$('#select-default-button').append('<span class="caret"></span></button>');
			$('#select-default').empty();
			var $select_d = $('#select-default');
			var records = alasql('select * from criteria order by id'); 
			for (var i = 0; i < records.length; i++) {
			 	$select_d.append('<li id="'+records[i].id+'"><a href="#">'+records[i].name+'</a></li>');
			}
		}	
	/*Set Criteria Dropdown options*/
		setDropdown = function (name) {
			$('#select-default-button').text(name+" ")
			$('#select-default-button').append('<span class="caret"></span></button>');
			$('#select-default').empty();
			var $select_d = $('#select-default');
			var records = alasql('select * from criteria order by id'); 
			for (var i = 0; i < records.length; i++) {
			 	$select_d.append('<li id="'+records[i].id+'"><a href="#">'+records[i].name+'</a></li>');
			}
		}			
	/*For Generating Report in Pop-Up*/
		function popitup(url) {
			newwindow=window.open(url,'_blank','height=600,width=800');
			newwindow.vacancy = sessionStorage.vacancy;
			if (window.focus) {newwindow.focus()}
			return false;
		}
	
//--------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------>>
/*TableSorter Plugin*/
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



//------------------------------------------------------------------------------------------------------------>>
/*BO Functions ----- Setting Corresponding Data Tables for Search Queries*/
	BO.callRec = function(q1){
			
		//--------------------------->>
		/*Clear Areas*/
	  	//Added Destroy Table to trigger update properly
	  	$("#table-rec").trigger("destroy");

		$('#thead-rec').empty();$('#tbody-rec').empty();
		console.log("Calling Rec");
		var emps;
		if(q1){
		emps = alasql('SELECT * FROM candidates WHERE emp_id LIKE ? OR name LIKE ? OR XII LIKE ? OR college LIKE ? OR specialization LIKE ? OR cgpa LIKE ? OR skill1 LIKE ? OR skill2 LIKE ? OR points LIKE ? OR selected LIKE ?', [ '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%', '%' + q1 + '%' , '%' + q1 + '%'  ]);
		}
		else{
			emps = alasql('SELECT * FROM candidates', []);
		}
		dir_cols = ['Number', 'Name', 'XII', 'College', 'Specialization', 'CGPA', 'Skill-1', 'Skill-2', 'Points', 'Selected'];
		var $tr = $('<tr></tr>');
		var $thead = $('#thead-rec');
		$tr.append('<th  class ="emp-img"><input type="checkbox"></th>');	
		for(cols in dir_cols){
		$tr.append('<th>' + dir_cols[cols] + '</th>');
		}                                                                                    
		$thead.append($tr);

		var tbody = $('#tbody-rec');
		for (var i = 0; i < emps.length; i++) {
			var emp = emps[i];
			var tr = $('<tr></tr>');
			tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"><input type="checkbox"></td>');
			tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.emp_id + '</a></td>');
			tr.append('<td>' + emp.name + '</td>');
			tr.append('<td>' + emp.XII + '</td>');
			tr.append('<td>' + emp.college + '</td>');
			tr.append('<td>' + emp.specialization + '<\/d>');
			tr.append('<td>' + emp.cgpa + '</td>');
			tr.append('<td>' + emp.skill1 + '</td>');
			tr.append('<td>' + emp.skill2 + '</td>');
			tr.append('<td>' + emp.points + '</td>');
			tr.append('<td><a href="#" data-value='+emp.selected+' id="pk-'+emp.id+'" data-pk="'+emp.id+'">' + emp.selected + '</a></td>');
tr.appendTo(tbody);
		}


		//--------------------------------------------------->
		/*Make Selected Editable*/
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
			    		if($('#pk-'+params.pk).parent().parent().find("input[type=checkbox]").prop("checked")){
			    			var $ids = $("#table-rec tbody tr").find("input:checked").parent().parent().find('.editable');
			    			var ids = [];
			    			$ids.each(function() {
			    				ids.push(parseInt($(this).attr("id").replace("pk-","")));
			    			});
			    			for (var i = 0; i < ids.length; i++) {
						    	alasql('update candidates set selected="'+params.value+'" where id = '+ ids[i]);	
						    	$('#pk-'+ids[i]).text(params.value);
			    			}
			    			// BO.callRec();
				    	}
				    	else{
					    	console.log('update candidates set selected="'+params.value+'" where id = '+params.pk);
					    	console.log($(this));
					    	$(this).attr("data-value",params.value);
					    	alasql('update candidates set selected="'+params.value+'" where id = '+params.pk);	
				    	}
			    }
		    },
		    title: 'Enter Yes or No'
			});
		//------------------------------------------------------------------------------<<<
		//Quicksearch
		$('input#q1').quicksearch('table#table-rec tbody tr');

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

	 	//--------------------------------------------------->
		/*Call the tablesorter plugin*/ 


		  $("#table-rec").tablesorter({
		    theme : "bootstrap",
		    widthFixed: true,
		    headerTemplate : '{content} {icon}', 
		    widgets : [ "uitheme", "filter", "zebra" ],
		    widgetOptions : {
		      zebra : ["even", "odd"],
		      filter_reset : ".reset-rec",
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

		  // $("#table-rec").trigger("update")
		  // .trigger("sorton", $("#table-rec").get(0).config.sortList)
		  // .trigger("appendCache")
		  // .trigger("applyWidgets");
	}


refreshDropdown();	
BO.callRec(q1);
//------------------------------------------------------------------------------------------------------------>>
/*Recruitment Specific Functions*/
	/*Add Criteria*/
		$('#add-criteria').click(function(){
			$list = $('#list');
			if ($('#list li').length >= 1){
				$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div></li>');
			}
			else{
				$li = $('<li class="list-group-item"><div class="dropdown" id="div-column"><label for="sel1">Column:</label><select class="form-inline" id="sel1"><option id = "XII">XII %</option><option id = "college">College</option><option id = "specialization ">Specialization</option><option id = "cgpa" >CGPA</option><option id = "skill" >Skill</option></select></div><div class="dropdown" id="div-operator" style="margin-left:15px;"><label for="sel2">Operator:</label><select class="form-inline" id="sel2"><option id = "eq"> = </option><option id = "lt"> < </option><option id = "lte"> <=</option><option id = "gt"> > </option><option id = "gte"> >= </option><option id = "lk"> ~ </option></select></div><div class="dropdown" id="div-value" style="margin-left:15px;"><label for="sel3">Value:</label><input type="text" class ="input-xs" id="sel3" placeholder="Values" style ="float:left width:150px ;"></div><div class="dropdown" id="div-points" style="margin-left:15px;"><label for="sel4">Points:</label><input type="text" class ="input-xs" id="sel4" placeholder="Points" style ="width:100px ;"></div><div class="dropdown" style="float:right;"><button onclick="saveCriteria()" id="save-criteria" class="btn-success btn-sm" type="button" style="margin:0"><span class="glyphicon glyphicon-floppy-disk" style="font-size: 15px;"></span> Save Criteria </button></div></li>');
			}
			$list.append($li);
		});
	/*Remove Criteria*/
		$('#rem-criteria').click(function(){
				if ($('#list li').length >= 1){
					$('#list li').last().remove();
				}
		});
	/*Select Candidates*/	
		$('#select-cand').click(function(){
			// var selected_id = $button.attr("select"); //--how did this come up here..?
			var no_cand = parseInt(alasql('column of select count(*) from candidates'));
			//Error Check 
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
				sessionStorage.vacancy = $('#select-default-button').text().trim();
				$('#noerror').text("Candidates Successfull Added!!!");
				$('#noerror').css('display','inline');
				$('#error').css('display','none');
 				$('#noerror').delay(3000).fadeOut();	
				BO.callRec();

				//hack
				 // window.location = 'recruitment.html';
			}
		});
	/*Save Criteria*/
		saveCriteria = function() {
		    var criteria_name  = prompt("Please input a Criteria Name", "Criteria Name");
		    console.log(criteria_name);
		    var records = alasql('select * from criteria where name = "'+criteria_name+'"');
		    var flag = false;
		    var r = true;
		    if(criteria_name != null){
			console.log("Entering Save Criteria")
			  if (records.length != 0){
	    			r = window.confirm("Criteria Name Already Exists, Press OK to Overwrite!");
	    			if(r == true){
						var selected_id = $('#select-default-button').attr("select");
						console.log('delete from criteria where id = '+selected_id);
						console.log('delete from criteria_map where id = '+selected_id);
						alasql('delete from criteria where id = '+selected_id);
						alasql('delete from criteria_map where id = '+selected_id);
	    			}   
	 			} 
	 		// console.log(r);
		    if(r == true){
				for (var i = 0; i < $('#list').length; i++) {
					if (flag){break;}
					var $li = $($('#list li')[i]);
					var val1 = $li.find('#sel1 option:selected').attr('id');
					var val2 = $li.find('#sel2 option:selected').attr('id');
					var val3 = $li.find('#sel3').val();
					var val4 = $li.find('#sel4').val();
					console.log(val1+val2+val3+val4)
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
					setDropdown(criteria_name);
					//4. Display Success Message				  		
						$('#noerror').text("Criteria Successfully Added !!!");
						$('#noerror').css('display','inline');
						$('#error').css('display','none');
		 				$('#noerror').delay(3000).fadeOut();	
		 				BO.callRec();
			 			// window.location = 'recruitment.html';
	 				}  			  	
	        	
	    		}//r==true
			}//criteria_name
		};
	/*Delete Criteria*/
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
			window.location = 'recruitment.html';	
			}
		}
	/*Select Default Criteria*/
$(document).on('click', '#select-default li', function(){ 
		// $('#select-default li').click(function(){
			//Clear the Set criterias
			console.log('Clicked!!');
			$('#list').empty();	
			$button = $('#select-default-button');
			id = $(this).attr("id");
			console.log(id);
			loadCriteria(id);			
		});
		loadCriteria = function(id) {
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
			}
	/*Print Selected*/
		$('#print').click(function(){
			var selected = $(alasql('select * from candidates where selected = "Yes"'));	
			if(selected.length == 0){
				window.confirm("No Candidates in the selected list!");	
			}else{
				popitup('print-selected.html');
			}
		})							

$(document).on('click', '.tablesorter-header-inner input', function(){ 
      if(this.checked){
      	console.log("Checked");
       	$('#table-rec tbody tr').not('.filtered').find("input[type=checkbox]").prop('checked', true);
		// $("#table-rec tbody .filtered").find("input[type=checkbox]").removeAttr("checked");
		$('#table-rec tbody tr').not('.filtered').find("input[type=checkbox]").parent().parent().addClass("checked");

      }
      else{
      	console.log("Unchecked tbody");
		$("#table-rec tbody tr").find("input[type=checkbox]").removeAttr("checked");
		$("#table-rec tbody tr").find("input[type=checkbox]").parent().parent().removeClass("checked");;

      }
});

$(document).on('keyup','input.tablesorter-filter.form-control', function(){
	console.log("Changing!");
  		if (!this.value) {
  			if($('#table-rec tbody tr').not('.filtered').find("input[type=checkbox]").prop("checked")){
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

$($("#table-rec tbody tr").find("input[type=checkbox]")).change(function(){
	if ($(this).is(':checked')) {
	    $(this).parent().parent().addClass("checked");;
	}
	else{
	    $(this).parent().parent().removeClass("checked");;
	}
});