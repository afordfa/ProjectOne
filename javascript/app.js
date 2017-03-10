$(document).on('ready', function (){
    // Initialize variables for google API

    var city = "";
    var state = "";
    var latitude = "";
    var longitude = "";
    var zipCode = "";
    var forecastArray = [];
    
    var queryZipURL = "";
   
	var startDate;

	var endDate;

	var jambaseQueryURL;

	var event = {};

	$("#startDateInput").datepicker();

	$("#endDateInput").datepicker();

	$("#startDateInput").change(function(){
		startDate = moment($("#startDateInput").val()).format().slice(0,13);
	    console.log ('start date: ' + startDate);
	});

	$("#endDateInput").change(function(){
		endDate = moment($('#endDateInput').val()).format().slice(0,13);
		console.log('end date: ' + endDate);
	})
	
 	
	
	//click handler for submit button.
	$('#search').on('click', function(){
		city = $("#cityInput").val();
		state = $("#stateInput").val();
		console.log(city);
		console.log(state);


	    // First ajax call to get latitude and longitude from google
		$.ajax({
	        url: "http://maps.googleapis.com/maps/api/geocode/json?address=" + city + "+" + state + "&sensor=true",
	        method: "GET"
	      })
	   
		.done(function(response) {
			console.log(response);
			latitude = response.results[0].geometry.location.lat;
			longitude = response.results[0].geometry.location.lng;
			queryZipURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=AIzaSyDcg7dc9u-CVCPWxCPVW-3SsVeSL9caXcI"

			//Nested ajax call to use latitude and longitude to get zip code
			$.ajax({
				url: queryZipURL,
				method: "GET"
			})
			.done(function(response) {
				zipCode = response.results[0].address_components[7].long_name;
				console.log("zip: " + zipCode);
				
				jambaseQueryURL = 'http://api.jambase.com/events?zipCode='+zipCode+
									'&radius=10&startDate='+startDate+
									'%3A00%3A00&endDate='+endDate+
									'%3A00%3A00&page=0&api_key=tce5wmzuk9w333ns7nv4xsv9';

				// actualURL='http://api.jambase.com/events?zipCode=78701&radius=10&startDate=2017-03-07T20%3A00%3A00&endDate=2017-03-17T20%3A00%3A00&page=0&api_key=tce5wmzuk9w333ns7nv4xsv9'

				$.ajax({
					url: jambaseQueryURL,
					method: "GET"
				}) .done (function(snap){
					console.log(snap);
				})
			});
			
		});

		      //ajax call to get information from Weather Underground
			$.ajax({
	        	url: "http://api.wunderground.com/api/0b14145e9f9901bc/forecast10day/q/" +
	          	state + "/" + city + ".json",
	        	method: "GET"
	      	})


	      	//when call is complete, sets variables for weather based on the city and state entered.
	      	//uses 10-day forecast from weather underground.
	      	//need to attribute weatherunderground in app.
	      	.done(function(response) {
	      		for (i = 0; i < 10; i++) {
		      		var highTemp = response.forecast.simpleforecast.forecastday[i].high.fahrenheit;
		      		var lowTemp = response.forecast.simpleforecast.forecastday[i].low.fahrenheit;
		      		var iconImg = response.forecast.simpleforecast.forecastday[i].icon_url;
		      		var month = response.forecast.simpleforecast.forecastday[i].date.monthname;
		      		var day = response.forecast.simpleforecast.forecastday[i].date.day;
		      		var year = response.forecast.simpleforecast.forecastday[i].date.year;
		      		forecastArray.push({
		      			highTemp: highTemp,
		      			lowTemp: lowTemp,
		      			inconImg: iconImg,
		      			month: month,
		      			day: day,
		      			year: year
		      		})
	      		}
	      		console.log(forecastArray);
			});
	


	//end of click handler for submit button
	})


	// $('#search').on('click', function(){
	// 	console.log(jambaseQueryURL);
	//})
	// $.ajax({
	// 	url: jambaseQueryURL,
	// 	method: 'GET'
	// }).done(function (snap){
		
	// })

})