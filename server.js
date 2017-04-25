'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const request  =require('request')
const firebase = require('firebase')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

/*
Firebase
*/
var config = {
  apiKey: "AIzaSyD5JZLxrwPRWO5Wq02GMo7V4Yxsc_pQsO8",
  authDomain: "jaywalk-8a738.firebaseapp.com",
  databaseURL: "https://jaywalk-8a738.firebaseio.com",
  projectId: "jaywalk-8a738",
  storageBucket: "jaywalk-8a738.appspot.com",
  messagingSenderId: "1042841275273"
};
firebase.initializeApp(config);
let db = firebase.database()
let snaps = db.ref("snaps")
/*
radius function
*/
let radius = 3200.0  // 3.2km or 4 mile total diameter
let numPoints = 6
function getRadius(lat, lng){
  let circlePoints = []
    for(let i=0;i< numPoints;i++){
      let angle = Math.PI * 2 * i / numPoints
      let dx = radius * Math.cos(angle)
      let dy = radius * Math.sin(angle)
      let point = []
      point['lat'] = lat + (180 / Math.PI) * (dy / 6378137)
      point['lng'] = lng + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat * Math.PI / 180)
      circlePoints.push(point)
  }
  return circlePoints
}


//*********************************************
// 
//*********************************************





// demonstrate returning an attachment...
slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
  msg.say({
    text: 'Check out this amazing attachment! :confetti_ball: ',
    attachments: [{
      text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
      title: 'Slapp Library - Open Source',
      image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
      title_link: 'https://beepboophq.com/',
      color: '#7CD197'
    }]
  })
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
})

// '/' commands
slapp.command('/test', (msg)=>{
  msg.say('test works')
})
let randomNum
slapp.command('/jaywalk', (msg, text)=>{
randomNum = (Math.floor(Math.random() * 1400)+200)

  msg
  .say({
    text: '',
    attachments: [
      {
        text: 'Where do you want to Jaywalk to?',
        fallback: 'Where to today?',
        callback_id: 'doit_confirm_callback',
        actions: [
          { name: 'answer', text: 'Suprise Me!', type: 'button', value: randomNum },
          // { name: 'answer', text: 'Random Tag', type: 'button', value: Math.floor(Math.random() * 44) }
        ]
      }]
    })
  .route('getid', { id: text })
  })
  .route('getid', (msg, state) => {
    console.log(randomNum)
    var randSnap = msg.body.actions[0].value || ''
    var randTag = msg.body.actions[0].value || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!randSnap || !randTag) {
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getid1', state)
    }
let body
let testSnapLocation = getRadius(39.752764,-104.877743) //test: snap #1055
let snapLat = snaps
  .orderByChild('lat')
  .startAt(testSnapLocation[5].lat+"-") // "-"makes a string for query
  .endAt(testSnapLocation[1].lat+"-")
  .once('value')
  .then(function(snap){
    snap.forEach(function(data){
      if(data.val().lng<=testSnapLocation[0].lng && data.val().lng>=testSnapLocation[3].lng){
        console.log(data.val().title)
        let body = data.val()
  msg.say(`I found a deal for you: ${body.title}\n${body.description}\n${body.picture}\n${body.address}\n`)
      }
    })
  })

//     var host;
//     if(randSnap !== ''){
//       state.status = randSnap
//       host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/1/rows?id="+randSnap+"&access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
//     } else {
//       state.status = randTag
//       host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/5/rows/get-table?access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
//     }

// request(host, function(err,res,body){
//     if (!err && res.statusCode == 200) {
//     // console.log(body);
//   }

//     body = JSON.parse(body)
//     console.log(err)
//     body=body[0]
//     let lat = body.latitude
//     let lng = body.longitude
//     let r = getRadius(lat,lng)
//     console.log(...r)
//     // console.log(radius.forEach(x=>{return JSON.stringify(x)}))
//     // console.log(lat,lng,radius)
//     if(body.title !== undefined){
//       msg.say(`I found a deal for you: ${body.title}\n${body.description}\n${body.picture}\n${body.address}\nradius: ${r[0]} ${r[1]} ${r[2]} ${r[3]} ${r[4]} ${r[5]} `)
//     } else {
//       msg.say(`Hashtag: ${body.id} ${body.name}`)
//     }
//   })
})



/*

*/


// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
