var DB = {};

DB.init = function() {
	if (window.confirm('are you sure to initialize database?')) {
		DB.load();
	}
};

DB.load = function() {
	// personal info
	alasql('DROP TABLE IF EXISTS emp;');
	alasql('CREATE TABLE emp(id INT IDENTITY, number STRING, name STRING, sex STRING, birthday DATE, tel STRING, ctct_name STRING, ctct_addr STRING, ctct_tel STRING, pspt_no STRING, pspt_date STRING, pspt_name STRING, rental STRING);');
	var pemp = alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-EMP.csv", {headers: true})').then(function(emps) {
		for (var i = 0; i < emps.length; i++) {
			alasql('INSERT INTO emp VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);', emps[i]);
		}
	});

	// address
	alasql('DROP TABLE IF EXISTS addr;');
	alasql('CREATE TABLE addr(id INT IDENTITY, emp INT, zip STRING, state STRING, city STRING, street STRING, bldg STRING, house INT);');
	var paddr = alasql.promise('SELECT MATRIX * FROM CSV("data/ADDR-ADDR.csv", {headers: true})').then(
			function(addresses) {
				for (var i = 0; i < addresses.length; i++) {
					alasql('INSERT INTO addr VALUES(?,?,?,?,?,?,?,?);', addresses[i]);
				}
			});

	// family
	alasql('DROP TABLE IF EXISTS family;');
	alasql('CREATE TABLE family(id INT IDENTITY, emp INT, name STRING, sex INT, birthday STRING, relation STRING, cohabit INT, care INT);');
	var pfamily = alasql.promise('SELECT MATRIX * FROM CSV("data/FAMILY-FAMILY.csv", {headers: true})').then(
			function(families) {
				for (var i = 0; i < families.length; i++) {
					alasql('INSERT INTO family VALUES(?,?,?,?,?,?,?,?);', families[i]);
				}
			});

	// education
	alasql('DROP TABLE IF EXISTS edu;');
	alasql('CREATE TABLE edu(id INT IDENTITY, emp INT, school STRING, major STRING, grad STRING);');
	var pedu = alasql.promise('SELECT MATRIX * FROM CSV("data/EDU-EDU.csv", {headers: true})').then(function(edus) {
		for (var i = 0; i < edus.length; i++) {
			alasql('INSERT INTO edu VALUES(?,?,?,?,?);', edus[i]);
		}
	});

	// choice
	alasql('DROP TABLE IF EXISTS choice;');
	alasql('CREATE TABLE choice(id INT IDENTITY, name STRING, text STRING);');
	var pchoice = alasql.promise('SELECT MATRIX * FROM CSV("data/CHOICE-CHOICE.csv", {headers: true})').then(
			function(choices) {
				for (var i = 0; i < choices.length; i++) {
					alasql('INSERT INTO choice VALUES(?,?,?	);', choices[i]);
				}
			});
	// performance
	alasql('DROP TABLE IF EXISTS performance;');
	alasql('CREATE TABLE performance(id INT IDENTITY, emp_id STRING, name STRING, team STRING, designation STRING, manager_review INT, grade STRING, experience INT);');
	var pperf = alasql.promise('SELECT MATRIX * FROM CSV("data/Performance.csv", {headers: true})').then(
			function(perf) {
				for (var i = 0; i < perf.length; i++) {
					alasql('INSERT INTO performance VALUES(?,?,?,?,?,?,?,?);', perf[i]);
					// console.log(perf[i]);
				}
			});

	// recruitment
	alasql('DROP TABLE IF EXISTS candidates;');
	alasql('CREATE TABLE candidates(id INT IDENTITY, emp_id STRING, name STRING, XII INT, college STRING, specialization STRING, cgpa INT, skill1 STRING, skill2 STRING, points INT, selected STRING);');
	var pcand = alasql.promise('SELECT MATRIX * FROM CSV("data/Candidates.csv", {headers: true})').then(function(cand) {
				for (var i = 0; i < cand.length; i++) {
					alasql('INSERT INTO candidates VALUES(?,?,?,?,?,?,?,?,?,?,?);', cand[i]);
				}
			});
	// Crieria
	alasql('DROP TABLE IF EXISTS criteria;');
	alasql('CREATE TABLE criteria(id INT IDENTITY, name STRING);');
	var pcrit = alasql.promise('SELECT MATRIX * FROM CSV("data/Criteria.csv", {headers: true})').then(function(crit) {
				for (var i = 0; i < crit.length; i++) {
					alasql('INSERT INTO criteria VALUES(?,?);', crit[i]);
				}
			});
	// recruitment
	alasql('DROP TABLE IF EXISTS criteria_map;');
	alasql('CREATE TABLE criteria_map(map_id INT IDENTITY, id INT, col_name STRING, op STRING, val STRING, pts INT);');
	var pcrit_map = alasql.promise('SELECT MATRIX * FROM CSV("data/Criteria_map.csv", {headers: true})').then(function(crit_map) {
				for (var i = 0; i < crit_map.length; i++) {
					alasql('INSERT INTO criteria_map VALUES(?,?,?,?,?,?);', crit_map[i]);
				}
			});				

	// designation
    alasql('DROP TABLE IF EXISTS designation;');
    alasql('CREATE TABLE designation(id INT IDENTITY, designation STRING, breakup STRING);');
    alasql('INSERT INTO designation VALUES (1,"ASE",""),(2,"SSE",""),(3,"SE",""),(4,"Analyst",""),(5,"Tester",""),(6,"Designer",""),(7,"TL","")');      
    
    // bias
    alasql('DROP TABLE IF EXISTS bias;');
    alasql('CREATE TABLE bias(id INT IDENTITY, team STRING, unbiased_review INT);');
	var pbias = alasql.promise('SELECT MATRIX * FROM CSV("data/Bias.csv", {headers: true})').then(function(bias_map) {
			for (var i = 0; i < bias_map.length; i++) {
				alasql('INSERT INTO bias VALUES(?,?,?);', bias_map[i]);
			}
		});		
	// alasql('INSERT INTO bias(id, unbiased_review) select id, manager_review from performance');
    // console.log("inserted into bias");

	// reload html
	Promise.all([ pemp, paddr, pfamily, pedu, pchoice, pperf, pcand, pcrit, pcrit_map, pbias]).then(function() {
		window.location.reload(true);
	});
};

DB.remove = function() {
	if (window.confirm('are you sure do delete dababase?')) {
		alasql('DROP localStorage DATABASE EMP')
	}
};

DB.choice = function(id) {
	var choices = alasql('SELECT text FROM choice WHERE id = ?', [ id ]);
	if (choices.length) {
		return choices[0].text;
	} else {
		return '';
	}
};

DB.choices = function(name) {
	return alasql('SELECT id, text FROM choice WHERE name = ?', [ name ]);
};

// connect to database
try {
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
} catch (e) {
	alasql('CREATE localStorage DATABASE EMP');
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
	DB.load();
}
