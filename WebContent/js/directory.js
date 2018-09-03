//------------------------------------------------------------------------------------------------------------>>
/*Initial Variables*/
	// Parse Search Query Params
	var q1 = $.url().param('q1');
	$('input[name="q1"]').val(q1);
	//BO --fns
	var BO = {};
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
    // history.pushState({}, '', '/directory.html');
    history.pushState({}, '', '/inventory-i18n-task2/directory.html');

    BO.callDirectory();

});
//--------------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------------>>
/*Global Functions*/
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

BO.callDirectory = function(q1) {
	console.log("Calliing Directory");
	var emps;
	console.log(q1);

	//--------------------------------------------------------------------------->>
	/*Clear Areas*/
	$("#table-emps").trigger("destroy");
	$('#thead-emps').empty();$('#tbody-emps').empty();
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

	$tr.append('<th  class ="emp-img"></th>');	
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

	//Quicksearch
	$('input#q1').quicksearch('table#table-emps tbody tr');

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
    widgets : [ "uitheme", "filter", "zebra" ,"stickyHeaders"],
    widgetOptions : {
      zebra : ["even", "odd"],
      filter_reset : ".reset-emps",
      filter_cssFilter: "form-control",
    },
 	headers: {
      	0 : {
        sorter: false,
        filter: false
  		}},
  	})
  .tablesorterPager({
    container: $("#pager"),
    cssGoto  : ".pagenum",
    removeRows: false,
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
  });
}


//Main -- Execution
BO.callDirectory(q1);
