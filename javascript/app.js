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

	// var cityZip;

	var jambaseQueryURL;

	var event = {};

	// var jambaseQueryURL = 'http://api.jambase.com/search?zip=' + cityZip +
	// '&radius=25&startDate=' +startDate + 
	// '&endDate=' + endDate + 
	// '&user=jambase&apikey=tce5wmzuk9w333ns7nv4xsv9';







	$("#startDateInput").change(function(){
	    startDate = $("#startDateInput").val();
	    console.log ('start date: ' + startDate);
	});

	$("#endDateInput").change(function(){
		endDate = $('#endDateInput').val();
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

				//JAMBASE CALL
				//Needs to be nested inside this ajax call to force it to start after zip code is retrieved

				// cityZip = $('#cityInput').val();
				jambaseQueryURL = 'http://api.jambase.com/search?zip=' + zipCode +
					'&radius=25&startDate=' + startDate.toISOString(); + 
					'&endDate=' + endDate.toISOString(); + 
					'&user=jambase&apikey=tce5wmzuk9w333ns7nv4xsv9';
				console.log(jambaseQueryURL);
				// $.ajax({
				// 	url: jambaseQueryURL,
				// 	method: 'GET'
				// }).done(function (snap){

				// 	numberOfEvents = snap.Info.TotalResults;
				// 	event.VenueName = snap.Events[0].Venue.Name;
				// 	event.Address = snap.Events[0].Venue.Address;
				// 	event.City = snap.Events[0].Venue.City;
				// 	event.Zip = snap.Events[0].Venue.ZipCode;
				// 	event.Artist = snap.Events[0].Artists.Name;
				// 	event.Date = snap.Events[0].Date;
				// 	event.venueURL = snap.Events[0].Venue.URL;
				// 	event.ticketURL = snap.Events[0].TicketURL;

				// 	console.log(event);
				// })


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