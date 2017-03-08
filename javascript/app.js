$(document).on('ready', function (){

	var startDate;

	var endDate;

	var cityZip;

	var queryURL;

	var event = {};

	// var queryURL = 'http://api.jambase.com/search?zip=' + cityZip +
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


	

	$('#search').on('click', function(){
		cityZip = $('#cityInput').val();
		queryURL = 'http://api.jambase.com/search?zip=' + cityZip +
			'&radius=25&startDate=' + startDate.toISOString(); + 
			'&endDate=' + endDate.toISOString(); + 
			'&user=jambase&apikey=tce5wmzuk9w333ns7nv4xsv9';
		console.log(queryURL);
		// $.ajax({
		// 	url: queryURL,
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
	 })

	// $('#search').on('click', function(){
	// 	console.log(queryURL);
	//})
	// $.ajax({
	// 	url: queryURL,
	// 	method: 'GET'
	// }).done(function (snap){
		
	// })

})