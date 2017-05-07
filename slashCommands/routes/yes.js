const slapp = require('../../slackSetup.js').slapp

const yes = function(teamInfo,msg,state){
  const snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo
  const addressToGeo  = require('./addressToGeo.js').addressToGeo

    let location = teamInfo.location_name

  msg.say({
  text: "",
    attachments: [{
      text: `Are you still at ${location}?`,
      callback_id: 'yesno_callback',
      color: 'good',
      actions: 
      [{ 
        name: 'answer',
        text: 'Yes',
        type: 'button',
        value: 'yes'
      },{ 
        name: 'answer',
        text: 'no',
        type: 'button',
        value: 'no'
      }]
    }]
  })
  slapp.action('yesno_callback', 'answer', (msg, value) => {
    let bool = (value=='yes' ? true : false)
    if(bool==true){
      snapsByGeo(teamInfo.lat,teamInfo.lng, msg, state)     
    }else{
      addressToGeo(teamInfo,msg,state)
    }
  })
}

module.exports = {
  yes: yes
}