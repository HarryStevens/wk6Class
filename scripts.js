/**
 * @author Harry Stevens
 */

//1. Document ready calls pageLoaded function
$(document).ready(pageLoaded);

//2. pageLoaded function loads the Google Visualization library and calls googleLoaded function
function pageLoaded() {
	google.load("visualization", "1", {
		packages : ["corechart"],
		callback : googleLoaded
	});
}

//3. googleLoaded function loads the data and calls the dataLoaded function
function googleLoaded() {
	$.get("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+*+FROM+1_g7L00qKd8I9rNtTrWgS1iHzkh8SmTYy8oS_VC99&key=AIzaSyB-QJux9WIJmey5IJYzPImNzg-xP1gpvU8", dataLoaded, "json");
}

//4. dataLoaded function formats the data, runs it throw the Google Visualizaiton library, and displays it
function dataLoaded(UNEMP) {

	//This entire section until the end of the for loop is because I have to change the date string in my data to an actual date
	var dataRows = UNEMP.rows;
	//empty array to fill with data for Google
	var dataArray = [];
	

	for (var i = 0; i < dataRows.length; i++) {
		var currRow = dataRows[i];

		//Moment.js will convert the date string to an actual date
		var currDate = currRow[0];
		var momentDate = moment(currDate);
		var finalDate = momentDate._d;

		//Grabbing the value number
		var currValue = currRow[1];

		//Creating my array with the date and value number for the Google Viz
		var currArray = [finalDate, currValue];
		dataArray.push(currArray);
	}

	//This code is from the Google Visualization DataTable documentation. It will create a table of data that I can display however I want.
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Unemployment');
	data.addRows(dataArray);

	//This section draws the chart
	var options = {
		title : 'Select a date range to zoom in. Right click to zoom out.',
		legend : {
			position : 'none'
		},
		backgroundColor : {
			stroke : '#000',
			strokeWidth : 4
		},
		curveType : 'function',
		explorer : {
			actions : ['dragToZoom', 'rightClickToReset'],
			axis : 'horizontal',
			maxZoomIn : .01
		},
		height : 520,
		chartArea : {
			height : 380,
			width : 1000
		},
		hAxis : {
			title : 'Date'
		},
		vAxis : {
			title : 'Percent unemployed',
			ticks : [0, 2, 4, 6, 8, 10, 12],
			format : '#'
		},
		selectionMode : 'multiple'
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);

}
