//Reference: https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
//When the window loads, call sendData()

function createTable(text) {
	//Remove rows from body
	var tableBody = document.getElementById("body");
	var children = tableBody.children;
	for(var j = (children.length - 1); j > -1; j--) {
		tableBody.removeChild(tableBody.children[j]);
	}
	
	//Create JSON object with response text	
	var array = JSON.parse(text);
	
	for (var i = 0; i < array.length; i++) {
		var obj = array[i];		
		if(obj.editId)
			delete obj.editId;
		var row = tableBody.insertRow(i);
		var cell, text;
		
		for (var x in obj) {
			if(x == "id")
				row.setAttribute("id", x);
			else if(x == "lbs") {
				cell = document.createElement("td");
				row.appendChild(cell);
				var unit;
				if(obj.lbs == "1")
					unit = "lbs";
				else
					unit = "kgs";
				
				text = document.createTextNode(unit);
				cell.appendChild(text);
			}
			else {
				cell = document.createElement("td");
				row.appendChild(cell);
				text = document.createTextNode(obj[x]);
				cell.appendChild(text);
			}
		}
		
		/***Create delete button***/
		//Create new cell
		cell = document.createElement("td");
		row.appendChild(cell);
		
		//Create a delete form that has the same id as the object
		//it represents and a class of "delete"
		var deleteForm = document.createElement("form");
		deleteForm.setAttribute("id", obj.id);
		deleteForm.setAttribute("class", "delete");
		cell.appendChild(deleteForm);
		
		//Create input for delete form
		var deleteInput = document.createElement("input");
		deleteInput.setAttribute("type", "submit");
		deleteInput.setAttribute("value", "Delete");
		deleteForm.appendChild(deleteInput);
		
		/***Create edit button***/
		//Create new cell
		cell = document.createElement("td");
		row.appendChild(cell);
		
		//Create an edit form that has the same id as the object
		//it represents and a class of "edit"
		var editForm = document.createElement("form");
		editForm.setAttribute("id", obj.id);
		editForm.setAttribute("class", "edit");
		cell.appendChild(editForm);
		
		//Create input for edit form
		var editInput = document.createElement("input");
		editInput.setAttribute("type", "submit");
		editInput.setAttribute("value", "Edit");
		editForm.appendChild(editInput);
	}
}

function insertData() {
	
	if(document.getElementById("name").value == "")
		alert("Please enter a valid name.");
	
	else {
		var request = new XMLHttpRequest();

		var formData = { "name":null, "reps":null, "weight":null, "date":null, "lbs":null };

		formData.name = document.getElementById("name").value;
		formData.reps = document.getElementById("reps").value;
		formData.weight = document.getElementById("weight").value;
		formData.date = document.getElementById("date").value;
		formData.lbs = document.getElementById("lbs").checked;
		
		// Define what happens on successful data submission
		request.addEventListener("load", function(event) {
			createTable(event.target.responseText);		
		});
		
		// Define what happens in case of error
		request.addEventListener("error", function(event) {
			alert('Oops! Something went wrong.');
		});

		// Set up our request
		request.open("POST", "http://flip3.engr.oregonstate.edu:7299/", true);

		request.setRequestHeader('Content-Type', 'application/json');

		// The data sent is what the user provided in the form
		request.send(JSON.stringify(formData));
	}
}

function deleteData() {
	var request = new XMLHttpRequest();

	var formData = { "delId":null };
	
	formData.delId = event.target.getAttribute('id');
	
	// Define what happens on successful data submission
	request.addEventListener("load", function(event) {
		createTable(event.target.responseText);
	});
	
	// Define what happens in case of error
	request.addEventListener("error", function(event) {
		alert('Oops! Something went wrong.');
	});

	// Set up our request
	request.open("POST", "http://flip3.engr.oregonstate.edu:7299/", true);

	request.setRequestHeader('Content-Type', 'application/json');

	// The data sent is what the user provided in the form
	request.send(JSON.stringify(formData));
}

function editData(id) {
	var request = new XMLHttpRequest();
	
	var formData = { "editId":null, "newName":null, "newReps":null, "newWeight":null, "newDate":null, "newLbs":null };

	formData.editId = id;
	formData.newName = document.getElementById("newName").value;
	formData.newReps = document.getElementById("newReps").value;
	formData.newWeight = document.getElementById("newWeight").value;
	formData.newDate = document.getElementById("newDate").value;
	formData.newLbs = document.getElementById("newLbs").checked;
	
	// Define what happens on successful data submission
	request.addEventListener("load", function(event) {
		createTable(event.target.responseText);		
	});
	
	// Define what happens in case of error
	request.addEventListener("error", function(event) {
		alert('Oops! Something went wrong.');
	});

	// Set up our request
	request.open("POST", "http://flip3.engr.oregonstate.edu:7299/", true);

	request.setRequestHeader('Content-Type', 'application/json');

	// The data sent is what the user provided in the form
	request.send(JSON.stringify(formData));
}

function reset() {
	//Remove rows from body
	var tableBody = document.getElementById("body");
	var children = tableBody.children;
	for(var j = (children.length - 1); j > -1; j--) {
		tableBody.removeChild(tableBody.children[j]);
	}
	
	var request = new XMLHttpRequest();
	
	// Define what happens on successful data submission
	request.addEventListener("load", function(event) {
		alert(event.target.responseText);
	});
	
	// Define what happens in case of error
	request.addEventListener("error", function(event) {
		alert('Oops! Something went wrong.');
	});

	// Set up our request
	request.open("GET", "http://flip3.engr.oregonstate.edu:7299/reset", true);

	// The data sent is what the user provided in the form
	request.send();
}

window.addEventListener("DOMContentLoaded", function () {
	
	//When data submitted
	document.addEventListener("submit", function (event) {
		//Prevents submission of the form
		event.preventDefault();
		
		//If the insert form sent the event
		if(event.target.getAttribute('id') == 'insert') {
			insertData();
			event.target.reset();
		}
		
		//If a delete button sent the event
		else if (event.target.getAttribute('class') == 'delete')
			deleteData();
		
		//If an edit button sent the event
		else if (event.target.getAttribute('class') == 'edit') {
			document.getElementById('edit').style.display = "block";
			this.id = event.target.getAttribute('id');
		}
		
		//If the edit form sent the event
		else if (event.target.getAttribute('id') == 'edit') {
			editData(this.id);
			event.target.reset();
			event.target.style.display = "none";
		}	
		
		//If the reset button sent the event
		else if (event.target.getAttribute('id') == 'reset')
			reset();
	});
});