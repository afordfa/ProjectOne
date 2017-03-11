function initMap() {
var coordinates = {lat: latitude, lng: longitude};
map = new google.maps.Map(document.getElementById('map'), {
  zoom: 10,
  center: coordinates
});

var marker = new google.maps.Marker({
  position: coordinates,
  map: map
});
}

var latitude = "";
var longitude = "";
      
$(document).on('ready', function (){
    // Initialize variables for google API
    var city = "";
    var state = "";

    var zipCode = "";
    var forecastArray = [];
    var queryZipURL = "";
	var map;
	var startDate;
	var endDate;
	var jambaseQueryURL;
	var event = {};
	var artistName;
	var venueName;
	var venueAddress; 
	var eventDate;

	var forecastIndex = 0;


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
	        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "+" + state + "&sensor=true",
	        method: "GET"
	      })
	   
		.done(function(response) {
			console.log("get latlong: ");
			console.log(response);
			latitude = response.results[0].geometry.location.lat;
			longitude = response.results[0].geometry.location.lng;
			console.log(latitude);
			console.log(longitude);

			//this adds the script tag for the map
			var script = $('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDcg7dc9u-CVCPWxCPVW-3SsVeSL9caXcI&callback=initMap" type="text/javascript"></script>');	
			$("body").append(script);

		});


		//Ajax call to use latitude and longitude to get zip code
		queryZipURL = "https://www.zipwise.com/webservices/citysearch.php?key=3hvbj4tu3e0sp7fy&format=json&string=" 
      		+ city + "&state=" + state;
		$.ajax({
			url: queryZipURL,
			method: "GET"
		})
		.done(function(response) {
			console.log(response);
			zipCode = response.results[0].zip;
			console.log(zipCode);
			
		
		//debug
		zipCode = "78701";
		jambaseQueryURL = 'http://api.jambase.com/events?zipCode='+zipCode+
								'&radius=10&startDate='+startDate+
								'%3A00%3A00&endDate='+endDate+
								'%3A00%3A00&page=0&api_key=8fyq9sabmukrkq5fa8grq6qd';
		$.ajax({
				url: jambaseQueryURL,
				method: "GET"
			}) .done (function(snap){
				console.log(snap);
				artistName = snap.Events[0].Artists[0].Name;
				venueName = snap.Events[0].Venue.Name;
				venueAddress = snap.Events[0].Venue.Address;
				eventDate = snap.Events[0].Date;
				eventDate = eventDate.slice(0,10);

				console.log(
					'artist name: '+artistName,
					'venue name: '+venueName,
					'venue address: '+venueAddress,
					'event date: '+eventDate
				);

				$('#concertTable').append(
					'<tr><td>'+artistName+'</td>'+
					'<td>'+venueName+'</td>'+
					'<td>'+eventDate+'</td></tr>');


				snap.Events.forEach(function(event) {
					var artistName = event.Artists.map(function(artist) {
						return artist.Name;
					}).join("<br>");

					var venueName = event.Venue.Name;
					var venueAddress = event.Venue.Address;
					var eventDate = event.Date.slice(0,10);

					console.log(
						'artist name: '+artistName,
						'venue name: '+venueName,
						'venue address: '+venueAddress,
						'event date: '+eventDate
					);

					$('#concertTable').append(
						'</tr><tr><td>'+artistName+'</td>'+
						'<td>'+venueName+'</td>'+
						'<td>'+eventDate+'</td></tr>'
					);
				})
			});
		})

		
	    //ajax call to get information from Weather Underground
		$.ajax({
        	url: "https://api.wunderground.com/api/0b14145e9f9901bc/forecast10day/q/" +
          	state + "/" + city + ".json",
        	method: "GET"
      	})
      	//when call is complete, sets variables for weather based on the city and state entered.
      	//uses 10-day forecast from weather underground.
      	//need to attribute weatherunderground in app.
      	.done(function(response) {
      		console.log(response);
      		for (i = 0; i < 10; i++) {
	      		var highTemp = response.forecast.simpleforecast.forecastday[i].high.fahrenheit;
	      		var lowTemp = response.forecast.simpleforecast.forecastday[i].low.fahrenheit;
	      		var iconImg = response.forecast.simpleforecast.forecastday[i].icon_url;
	      		var month = response.forecast.simpleforecast.forecastday[i].date.month;
	      		var day = response.forecast.simpleforecast.forecastday[i].date.day;
	      		var year = response.forecast.simpleforecast.forecastday[i].date.year;
	      		forecastArray.push({
	      			highTemp: highTemp,
	      			lowTemp: lowTemp,
	      			iconImg: iconImg,
	      			month: month,
	      			day: day,
	      			year: year
	      		})
      		}

      		console.log(forecastArray);
      		$("#weatherDate").html(forecastArray[forecastIndex].month + "/" + forecastArray[forecastIndex].day);
      		$("#highTemp").html(forecastArray[forecastIndex].highTemp + String.fromCharCode(176) + "F");
      		$("#lowTemp").html(forecastArray[forecastIndex].lowTemp + String.fromCharCode(176) + "F");
      		var image = $("<img>");
      		image.attr("src", forecastArray[forecastIndex].iconImg);
      		var addImage = $("#weatherImg").append(image);
      		
      		
      		$("#leftArrow").on("click", function(){
      			if (forecastIndex == 0) {}
      				else {
      					forecastIndex --;
      					updateWeatherInfo();
      				}
      		});

      		$("#rightArrow").on("click", function(){
      			if (forecastIndex == 9) {}
      				else {
      					forecastIndex ++;
      					updateWeatherInfo();
      				}
      		});


      		function updateWeatherInfo() {
		      	$("#weatherDate").empty();
				$("#highTemp").empty();
				$("#lowTemp").empty();
				$("#weatherImg").empty();
				$("#weatherDate").html(forecastArray[forecastIndex].month + "/" + forecastArray[forecastIndex].day);
				$("#highTemp").html(forecastArray[forecastIndex].highTemp + String.fromCharCode(176) + "F");
				$("#lowTemp").html(forecastArray[forecastIndex].lowTemp + String.fromCharCode(176) + "F");
				image.attr("src", forecastArray[forecastIndex].iconImg);
				addImage = $("#weatherImg").append(image);
      		}

		});
	})
})	