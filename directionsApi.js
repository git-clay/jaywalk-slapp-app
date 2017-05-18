var request = require('request')
require('dotenv').config()
// start = `39.733543, -104.992554`
// end=`39.733543, -104.91`


  // var latlng = new google.maps.LatLng(startd);
  // var myOptions = {
  //   zoom: 15,
  //   center: latlng,
  //   mapTypeControl: false,
  //   navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
  //   mapTypeId: google.maps.MapTypeId.ROADMAP
  // };
  // var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  // var marker = new google.maps.Marker({
  //     position: latlng,
  //     map: map,
  //     title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  // });

// function getDirects(start,end){
// 	request(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`,function(error,success,body){
// 		// switch(succ){

// 		// }
// 		// console.log(success)
// 		var jsonB = JSON.parse(body)
// 		console.log(jsonB.routes[0].legs)
// 	})
// }
// getDirects(start,end)

function getMap(start,end,msg){
	var googUrl = `https://maps.googleapis.com/maps/api/`
  //request to google to get route from user location to snap
	request(`${googUrl}directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`,function(error,success,body){
		console.log(JSON.parse(body))
    //route is the directions line to overlay on
    var route =JSON.parse(body).routes[0].overview_polyline.points
    
    // adds directions to a static map
		let mapUrl =`${googUrl}staticmap?size=600x400&origin=${start}&destination=${end}&path=enc%3A${route}&key=${process.env.DIRECTIONS_KEY}`
		console.log('directionsapi:',mapUrl)
		 msg.say({
      text: '',
      "attachments": [
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#36a64f",
          // "title_link": "https://www.google.com/maps/place/" + start,
          "image_url": `${mapUrl}`
          //"thumb_url": "http://example.com/path/to/thumb.png"
           // "fields":[
           //  {
           //     "title": "Update your own location",
           //     "value": host_app_url + "",
           //     "short":false
           //  }
           // ]
        }
      ]
    
  })
	})
}

module.exports={
	getMap:getMap
}


// {
//   origin: LatLng | String | google.maps.Place,
//   destination: LatLng | String | google.maps.Place,
//   travelMode: TravelMode,
//   transitOptions: TransitOptions,
//   drivingOptions: DrivingOptions,
//   unitSystem: UnitSystem,
//   waypoints[]: DirectionsWaypoint,
//   optimizeWaypoints: Boolean,
//   provideRouteAlternatives: Boolean,
//   avoidHighways: Boolean,
//   avoidTolls: Boolean,
//   region: String
// }







