var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7292);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/reset',function(req,res,next){
	
	mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
			var createString = "CREATE TABLE workouts("+
			"id INT PRIMARY KEY AUTO_INCREMENT,"+
			"name VARCHAR(255) NOT NULL,"+
			"reps INT,"+
			"weight INT,"+
			"date DATE,"+
			"lbs BOOLEAN)";
			mysql.pool.query(createString, function(err){
				if(err){
					next(err);
					return;
				}
		});
		res.send("Table reset.");
	});
	
});

app.get('/',function(req,res,next){
	res.render('home');	
});

app.post('/',function(req,res,next){
	
	//Insert row into table
	if(req.body.name) {
		mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)",
		[req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
		});
		
		mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			res.send(JSON.stringify(rows));
		});
	}
	
	//Delete row from table
	if(req.body.delId) {
		mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.delId], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
		});
		
		mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			res.send(JSON.stringify(rows));
		});
	}
	
	if(req.body.editId) {		
		mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.editId], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
			
			if(result.length == 1){
				var current = result[0];
				mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
				[req.body.newName || current.name, req.body.newReps || current.reps, 
				req.body.newWeight || current.weight, req.body.newDate || current.date, 
				req.body.newLbs || current.lbs, req.body.editId],
				function(err){
					if(err){
						next(err);
						return;
					}
				});
			}
		});	
		
		mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			res.send(JSON.stringify(rows));
		});
	}

});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
