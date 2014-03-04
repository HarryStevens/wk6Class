/**
 * @author
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
	$.get("URL", dataLoaded, "json");
}

//4. dataLoaded function formats the data, runs it throw the Google Visualizaiton library, and displays it
function dataLoaded(){
	
}
