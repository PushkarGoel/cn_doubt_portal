var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const url= require('url');
const date = require('date-and-time')

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Pushkar@1',
	database : 'sys'
});

var app = express();
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	request.session.loggedin = false;
	response.render('./login', {msg:request.query.msg});
	// request.session.alert - undefined
});


app.post('/logout', function(request, response) {

	request.session.loggedin = false;
	request.session.username = null;
	request.session.user_id = null;
	response.redirect('/')
	});

app.get('/signup', function(request, response) {

	response.render('./sign_up')
	});


app.post('/create_user', function(request, response) {

	var user_details = {
		"user_name": request.body.username,
		"password": request.body.password,
		"full_name": request.body.fullname,
		"user_type": request.body.type_selector,
	}

	connection.query('INSERT INTO user_credentials SET ?', user_details, function(error, results, fields) {

			// console.log('The solution is: ', results);
		console.log("Created user ",user_details) 
		response.redirect("./")

	});


});


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	console.log("username is ", username)

	if (username && password) {
		connection.query('SELECT * FROM user_credentials WHERE user_name = ? AND password = ?', [username, password], function(error, results, fields) {
			// console.log("res is ", results, error)
			if (results.length > 0) {

				// console.log(results[0].user_type== 'student')
				request.session.loggedin = true;
				request.session.username = username;
				request.session.user_id = results[0].user_id;
				var user_type = results[0].user_type;
				// response.redirect('/home');

				if(user_type == 'student'){
					response.redirect('/display_doubts_student');
				}
				else if(user_type =='TA'){
					// ############# check if user already has a doubt
					response.redirect('/display_doubts_ta');
				}
				else{
					response.redirect('/home_teacher')
				}
			} else {
					response.redirect(url.format({
			       		pathname:"./",
			      		 query: {"msg":"Wrong Credentials!"},
					   	}));

			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/display_doubts_student', function(request, response) {

	if (request.session.loggedin) {

		connection.query("SELECT d.doubt_id, d.doubt_title, d.student_id, d.creation_timestamp, d.doubt_description, d.solution, d.solved_by, d.solve_timestamp, d.status,GROUP_CONCAT(c.comment) as comment,GROUP_CONCAT(c.created_by) as commenter FROM doubts d LEFT JOIN comments c ON (d.doubt_id = c.doubt_id) group by d.doubt_id ", function(error, results, fields) {
			
			if(results == undefined){
				console.log("error in doubt fetching: ", error)
				response.send("Could not load Doubts!")
			}
			else{

				// console.log(results)
				response.render('./doubt_feed_student',{rows:results, username:request.session.username});
			}

		});
	} else{
		console.log("Login not done")
		// alert("Login First!")
		response.redirect(url.format({
       		pathname:"./",
      		 query: {"msg":"Login First!"},
		   	}));


		// response.render('./login', {msg:"failed"})
	}

});


app.post('/create_doubt', function(request, response) {

	var doubt_title = request.body.doubt_title;
	var doubt_desc = request.body.doubt_desc;

	var creation_time = new Date()

	var doubt = {
		"doubt_title": doubt_title,
		"doubt_description": doubt_desc,
		"student_id": request.session.username,
		"creation_timestamp": creation_time,
	}

	connection.query('INSERT INTO doubts SET ?', doubt, function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)
		}
		else{
			// console.log('The solution is: ', results);
			console.log("Doubt raised at ", creation_time, " by ",request.session.username) 
		}
		response.redirect("./display_doubts_student")

	});

});

app.post('/add_comment', function(request, response) {

	var doubt_id = request.body.doubt_id;
	var comment = request.body.comment;

	var creation_time = new Date()

	var comment = {
		"doubt_id": doubt_id,
		"comment": comment,
		"created_by": request.session.username,
		"created_at": creation_time,
	}

	connection.query('INSERT INTO comments SET ?', comment, function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)
		}
		else{
			// console.log('The solution is: ', results);
			console.log("Cpmment added at ", creation_time, " by ",request.session.username) 
		}
		response.redirect("./display_doubts_student")

	});

});


app.get('/create_doubt_form', function(request, response) {

	if(request.session.loggedin){

		response.render("./raise_doubt")
	}
	else{

		response.redirect(url.format({
       		pathname:"./",
      		 query: {"msg":"Login First!"},
		   	}));

	}

});

app.get('/display_doubts_ta', function(request, response) {


	if (request.session.loggedin) {

		console.log("display doubts ta")
	// #################### display doubts which ta have not checked already
		connection.query("SELECT * FROM doubts where doubt_id NOT IN (SELECT doubt_id FROM doubt_ta_mapping where ta_id = ?) and status = 'unsolved' order by creation_timestamp asc", [request.session.username], function(error, results, fields) {
		// connection.query("SELECT * FROM doubts", [request.session.username], function(error, results, fields) {		
			if(results == undefined){
				console.log("error in doubt fetching: ", error)
				response.send("Could not load Doubts!")
			}
			else{

				response.render('./doubt_feed_ta',{rows:results, msg:request.query.msg});
			}
		});
	}else{
		response.redirect(url.format({
       		pathname:"./",
      		 query: {"msg":"Login First!"},
		   	}));

	}


});

app.post('/assign_doubt', function(request, response){

	var user_free = true

	connection.query('SELECT * FROM doubt_ta_mapping WHERE action_taken = "assigned" and ta_id = ? ', [request.session.username], function(error, results, fields) { 

		if(results.length != 0){
			user_free = false
			// request.session.alert_ta = "Already a Doubt assigned!"
			response.redirect(url.format({
       		pathname:"./display_doubts_ta",
      		 query: {"msg":"Please solve the assigned doubt First!"},
		   	}));
			// response.redirect('/display_doubts_ta')
		}
		else{
			var doubt_id = request.body.doubt_id;

			console.log("assigning ", doubt_id)

			var assign_time = new Date()

			var ta_map = {
				"doubt_id": doubt_id,
				"ta_id": request.session.username,
				"assign_time": assign_time,
			}

			// ###########check if user has already checked this 
			connection.query('INSERT INTO doubt_ta_mapping SET ?', ta_map, function(error, results, fields) {

				if(results==undefined){
					console.log("error in insertion of mapping_ta: ", error)
				}

			});

			connection.query('UPDATE doubts SET status = "assigned" WHERE doubt_id = ?', [doubt_id], function(error, results, fields) {

				if(results==undefined){
					console.log("error in insertion: ", error)

				}
				else{
					// console.log('The solution is: ', results);
					console.log("Doubt ", doubt_id," assigned to ",request.session.username) 
					response.redirect('/check_doubt')
				}
			});

		}

	});

});


app.get('/check_doubt', function(request, response) {

	if(request.session.loggedin){
		connection.query("SELECT d.doubt_id, d.doubt_title, d.student_id, d.creation_timestamp, d.doubt_description, d.solution, d.solved_by, d.solve_timestamp, d.status,GROUP_CONCAT(c.comment) as comment,GROUP_CONCAT(c.created_by) as commenter FROM doubts d LEFT JOIN comments c ON (d.doubt_id = c.doubt_id) WHERE d.doubt_id in (SELECT doubt_id FROM doubt_ta_mapping WHERE ta_id = ? and action_taken='assigned') group by d.doubt_id  ", [request.session.username], function(error, results, fields) {
			
			if(results.length == 0){
				response.redirect(url.format({
	       		pathname:"./display_doubts_ta",
	      		 query: {"msg":"No doubts assigned to you yet!"},
		   	}));

			}
			else{

				response.render('./view_doubt',{rows:results});
			}
		});
	}
	else{
		response.redirect(url.format({
       		pathname:"./",
      		 query: {"msg":"Login First!"},
		   	}));

	}

});

app.post('/solve_doubt', function(request, response) {


	var doubt_solution = request.body.answer;
	var doubt_id = request.body.doubt_id;

	var solve_time = new Date()

	connection.query('UPDATE doubt_ta_mapping SET pass_time = ?, action_taken = "solved" WHERE doubt_id = ? AND ta_id = ?', [solve_time, doubt_id, request.session.username], function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)
		}

	});

	connection.query('UPDATE doubts SET solve_timestamp = ?, solved_by = ?, solution = ?, status = "solved" WHERE doubt_id = ?', [solve_time, request.session.username, doubt_solution, doubt_id], function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)
		}
		else{
			// console.log('The solution is: ', results);
			console.log("Doubt solved at ", solve_time, " by ",request.session.username) 
		}
		response.redirect("./display_doubts_ta")

	});

});

app.post('/escalate_doubt', function(request, response) {

	var doubt_solution = request.body.doubt_solution;
	var doubt_id = request.body.doubt_id;

	var solve_time = new Date()

	connection.query('UPDATE doubts SET status = "unsolved" WHERE doubt_id = ?', [doubt_id], function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)

		}
	});

	connection.query('UPDATE doubt_ta_mapping SET pass_time = ?, action_taken = "escalated" WHERE doubt_id = ? AND ta_id = ?', [solve_time, doubt_id, request.session.username], function(error, results, fields) {

		if(results==undefined){
			console.log("error in insertion: ", error)
		}
		else{
			console.log("doubt escalated!")
			response.redirect("./display_doubts_ta")
		}

	});

});

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

app.get('/home_teacher', function(request, response) {


	if (request.session.loggedin) {

		var dict_res = []
		var dict_ta = {}
		dict_res.hello3 = 2

		console.log("home page of teacher")
		connection.query("SELECT count(*) FROM doubts", function(error, results, fields) {		

			dict_res.count_doubt = results[0]['count(*)']

		});
		connection.query("SELECT count(*) FROM doubts where status='solved' ", function(error, results, fields) {		
			dict_res.count_solved_doubt = results[0]['count(*)']

		});
		connection.query("SELECT count(distinct(doubt_id)) as count FROM doubt_ta_mapping where action_taken='escalated'", function(error, results, fields) {		

			dict_res.count_escalated_doubt = results[0]['count']

		});
		connection.query("SELECT creation_timestamp, solve_timestamp FROM doubts where status='solved' ", function(error, results, fields) {		
			var total_time = 0

			for(let i=0; i<results.length; i++){
				var time_taken = date.subtract(results[i]['solve_timestamp'], results[i]['creation_timestamp'])
				var total_time = total_time + time_taken.toSeconds()

			}
			avg_doubt_time = secondsToHms(total_time/(results.length))
			dict_res.avg_doubt_time = avg_doubt_time

		});
		connection.query("SELECT ta_id, count(*) FROM doubt_ta_mapping group by ta_id", function(error, results, fields) {		

			results.forEach(element =>{
				dict_ta[element["ta_id"]] = {}
				dict_ta[element["ta_id"]]["count_doubt"] = element["count(*)"]

			});


		});
		connection.query("SELECT ta_id, count(*) FROM doubt_ta_mapping where action_taken='solved' group by ta_id", function(error, results, fields) {		

			results.forEach(element =>{
				dict_ta[element["ta_id"]]["count_solved_doubt"] = element["count(*)"]

			});

		});

		connection.query("SELECT ta_id, count(*) FROM doubt_ta_mapping where action_taken='escalated' group by ta_id", function(error, results, fields) {		

			results.forEach(element =>{
				dict_ta[element["ta_id"]]["count_escalated_doubt"] = element["count(*)"]

			});

		});

		connection.query("SELECT ta_id, assign_time, pass_time FROM doubt_ta_mapping where action_taken='solved'", function(error, results, fields) {		

			dict_total_time = {}
			dict_len = {}
			results.forEach(element =>{

				var time_taken = date.subtract(element['pass_time'],element['assign_time']).toSeconds()
				// console.log("element are ",element)
				if(dict_total_time[element["ta_id"]] == undefined){
					dict_total_time[element["ta_id"]] = time_taken
					dict_len[element["ta_id"]] = 1

				}
				else{
					dict_total_time[element["ta_id"]] += time_taken
					dict_len[element["ta_id"]] += 1					
				}

			});
			for (let ta_id in dict_ta){

				dict_ta[ta_id]["ta_id"] = ta_id
				if(dict_ta[ta_id]["count_solved_doubt"] == undefined){
					dict_ta[ta_id]["count_solved_doubt"] = 0
				}
				if(dict_ta[ta_id]["count_escalated_doubt"] == undefined){
					dict_ta[ta_id]["count_escalated_doubt"] = 0
				}
				if(dict_total_time[ta_id] == undefined){
					dict_ta[ta_id]["avg_doubt_time"] = 0
				}
				else{
					avg_doubt_time = secondsToHms(dict_total_time[ta_id]/(dict_len[ta_id]))
					dict_ta[ta_id]["avg_doubt_time"] = avg_doubt_time					
				}

			}

			res_ta = []
			for (let ta_id in dict_ta){
				res_ta.push(dict_ta[ta_id])
			}

			// console.log("res of teacher are ", dict_res, dict_ta)
			response.render('./home_teacher', {rows:dict_res, rows_ta:res_ta})



		});


	}else{
		response.redirect(url.format({
       		pathname:"./",
      		 query: {"msg":"Login First!"},
		   	}));

	}


});


app.listen(process.env.PORT || 3000,() => {
	console.log("listening  3000");
});