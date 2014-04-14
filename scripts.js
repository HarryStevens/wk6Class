/**
 * @author Harry Stevens
 */

var tableURL = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+*+FROM+1_g7L00qKd8I9rNtTrWgS1iHzkh8SmTYy8oS_VC99+WHERE+DATE>=";
var myKey = "&key=AIzaSyB-QJux9WIJmey5IJYzPImNzg-xP1gpvU8";

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
	$(".btn").on("click", buttonHandler);
	$("#year_1948").click();
}

//4. Tells when a given button is clicked and adds the right data
function buttonHandler(e) {
	var myID = e.target.id;
	var myYear = myID.split("_")[1];
	$.get(tableURL+"'"+myYear+"-01-01'"+myKey, dataLoaded, "json");	
	$("#startdate").html(myYear);
	$("#buttons div").removeClass("active");
	$("#year_"+myYear).addClass("active");
	
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

		//Grabbing the value number and switching it to a percentage
		var currValue = currRow[1];
		var perValue = currValue/100;

		//Creating my array with the date and value number for the Google Viz
		var currArray = [finalDate, perValue];
		dataArray.push(currArray);
	}

	//This code is from the Google Visualization DataTable documentation. It will create a table of data that I can display however I want.
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Unemployment');
	data.addRows(dataArray);

	//This section will format the unemployment data to add a percentage at the end
	var formatter = new google.visualization.NumberFormat({
		pattern : ['#.#%']
	});
	formatter.format(data, 1);
	//This section draws the chart. It is taken from the Google line chart documentation.
	var options = {
		title : 'Select a date range to zoom in. Right click to zoom out.',
		legend : {
			position : 'none'
		},
		backgroundColor : {
			stroke : '#000',
			strokeWidth : 4
		},
		colors : ['#2F4779'],
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
			ticks : [.00, .02, .04, .06, .08, .10, .12],
			format : '#%'
		},
		selectionMode : 'multiple',
		/*
		annotations : {
			boxStyle : {
				stroke : '#888', // Color of the box outline.
				strokeWidth : 1, // Thickness of the box outline.
				rx : 10, // x-radius of the corner curvature.
				ry : 10, // y-radius of the corner curvature.
				gradient : {// Attributes for linear gradient fill.
					color1 : '#fbf6a7', // Start color for gradient.
					color2 : '#33b679', // Finish color for gradient.
					x1 : '0%',
					y1 : '0%', // Where on the boundary to start and end the
					x2 : '100%',
					y2 : '100%', // color1/color2 gradient, relative to the
					// upper left corner of the boundary.
					useObjectBoundingBoxUnits : true // If true, the boundary for x1, y1,
					// x2, and y2 is the box. If false,
					// it's the entire chart.
				}
			}
		}
		*/
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);

}
