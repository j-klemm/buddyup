//import Stripe from '../node_modules/stripe/lib/stripe.js';
//const stripe = Stripe('sk_test_702S1G8Evlw75ncc3aPMYT1g00L7g6VPO9');
//import * as Stripe from '../node_modules/stripe/lib/stripe.js'
//const stripe = Stripe('sk_test_702S1G8Evlw75ncc3aPMYT1g00L7g6VPO9');
//import Stripe from "./stripe"
//import {paymentDebug} from "./payment.js"

export const renderSite = function() {
    const $root = $('#root');
    renderNewTrip();
}

export function renderNewTrip() {
    let numOfMembers = 1;
    $('#body').empty();
    $('#body').append(`
    <div class="modal">
    <div class="modal-background"></div>
     <div class="modal-content">
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
    </div>
    <div id="switchModeButtons" style="width: 300px; margin: auto;">
    <button class="button is-light" id="newTripButton">New Trip</button>
    <button class="button is-light" id="existingTripsButton">Existing Trips</button>
  </div>
      <div class="box tripsbox">
          <div id="newTrip" id="newTripInputs">
            <h1>New Trip</h1>
            <div class="field">
                <div class="control">
                    <input class="input is-success is-rounded" type="text" id="locationinput" placeholder="Where do you wanna go?">
                </div>
            </div>
            <div class="field">
            <div class="control">
                <input class="input is-success is-rounded" type="text" id="amounttoraiseinput" placeholder="How much do you need to raise?">
            </div>
        </div>
            <div id="groupmemberfields">
            <div class="field">
              <div class="control">
                <input class="input is-info is-rounded groupmemberinput" id="groupmember1" type="text" data-id="1" placeholder="Group Member Username">
              </div>
            </div>
            </div>
            <p class="buttons">
                <button class="button is-small is-info" id="newgroupmember" style="margin-top:10px">
                  <span class="icon is-small">
                    <i class="fas fa-plus"></i>
                  </span>
                </button>
              </p><br><br>
            <button class="button is-info" id="createtrip">Create Trip</button>
            <button class="button is-info" id="paymentdebug">Payment Debug</button>
            <button class="button is-info" id="backenddebug">Backend Debug</button>
          </div>
        </div>
    `);

    $('#newTripButton').on('click', renderNewTrip);

    $('#paymentdebug').on('click',function(){
      //CHANGE 100 TO CUSTOM AMOUNT, need to pull tripid, amount, and userid from fields. Userid can be gotten from localstorage.
      redirectToPayment(100,'trip1575768627424','jakob115')
    });

    $('#backenddebug').on('click',function(){
      backendDebug()
    })

    $('#existingTripsButton').on('click', renderExistingTrips);

    $('#newgroupmember').click(function () {
        numOfMembers++;
        newGroupMember(numOfMembers);
    });

    $('#createtrip').click(function () {
        //get form data and pass through createTrip(groupMembers, location);
        let location = $('#locationinput').val();
        let amountToRaise = $('#amounttoraiseinput').val()

        if(isNaN(amountToRaise)){
          alert(amountToRaise + " is not a valid number!")
          return
        }

        let groupMembers = [];
        for (let i=0; i<numOfMembers; i++) {
            let groupMemberID = '#groupmember' + (i+1);
            var inputVal =  $(groupMemberID).val();
            if(!(inputVal == "")){
              groupMembers.push(inputVal)
            }
        }

        createTrip(groupMembers, location,amountToRaise);
        renderNewTrip(groupMembers, location);
    });
}
export async function backendDebug(){
  const response = await axios({
    method: 'POST',
    url: 'http://localhost:3000/account/create/',
    data: {
      "name": "chris",
      "pass": "pass123",
      "data": {
        "role": 2,
        "description": "Lazy..."
      }
    }
}).catch(error => {
  console.log(error.response)
});
console.log(response)
}

//UNSURE WHAT WE NEED IN userinfo, we will need stuff to update our backend
//ALSO MIGHT WANT TO UPDATE NAME PARAMETER TO CUSTOMIZE PAYMENT PAGE
export async function redirectToPayment(amount,tripid,userid){
  console.log("Payment debug button clicked");
  const params = new URLSearchParams();
  params.append('success_url','http://localhost:3001/Trips/success.html?amount='+amount+'&user='+userid+"&tripid="+tripid)
  params.append('cancel_url','http://localhost:3001/Trips/trips.html')
  params.append('payment_method_types[0]','card')
  params.append("line_items[0][name]","Trip Contribution")
  params.append("line_items[0][description]","Contribute " + amount + " dollars to your trip")
  params.append("line_items[0][amount]",amount)
  params.append("line_items[0][currency]","usd")
  params.append("line_items[0][quantity]",1)

  var sessionId = 0
  const result = await axios({
    method: 'post',
    url: 'https://api.stripe.com/v1/checkout/sessions',

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer sk_test_702S1G8Evlw75ncc3aPMYT1g00L7g6VPO9`
     },
     data : params
  }).then(response => { 
    console.log(response)
    sessionId = response.data.id

  var stripe = Stripe('pk_test_cCOZBKg8RGeE4rz7xxmLIYyg00RyBxbRhM');
  console.log(stripe)

  var checkout = stripe.redirectToCheckout({
    sessionId: sessionId
  }).then(function (result) {
      console.log("Result: " + result)
  },function(error){
    console.log("Error: " + error)
  }).catch(function (caught){
    console.log("Caught: " + caught)
  });
  //DO STUFF AFTER PAYMENT IN success.html

  })
  .catch(error => {
      console.log(error.response)
  });

}

export async function renderExistingTrips() {


    //pull existing trips data here!!!! store as result like twitter
    let result;

        $('#body').empty();
        $('#body').append(`
        <div id="switchModeButtons" style="width: 300px; margin: auto;">
          <button class="button is-light" id="newTripButton">New Trip</button>
          <button class="button is-light" id="existingTripsButton">Existing Trips</button>
        </div>`);
        // for (let i = 0; i < result.data.length; i ++) {
        //     $('#body').append(`
        //     <div class="section">
        //     <div class="container">
        //     <div id="content" class="box">
        //       <div class="columns">
        //     <div class="media-content">
        //         <p class="title is-4" id="name">LOCATION trip</p>
        //         <div class="column is-half content" id="groupmembers">
        //             <p class="groupmember">
        //               Shelby Poliachik (You)
        //             </p>
        //             <p class="groupmember">
        //                 Carlee Powell
        //             </p>
        //             <p class="groupmember">
        //                 Jakob Klemm
        //             </p>
        //             <p class="groupmember">
        //                 Wesley Leonhardt
        //             </p>
        //         </div>
        //     </div>
        //         <div class="column is-half" id="progress">
        //           <h2>$750 raised out of $1000 goal</h2>
        //           <progress class="progress is-large is-info" value="75" max="100"></progress>
        //         </div>
        //       </div>
        //         <div class="columns">
        //         <div class = "column is-half" id="editTripButtons" style="float:right">
        //           <!-- delete this when 'add funds' clicked -->
        //           <button class="button is-success" style="margin:5px">Add funds</button>
        //         </div>
        //         </div>

        //         <!-- load this when 'add funds' clicked -->
        //     <div id="addfundsform">
        //       <h2>Add funds</h2>
        //         <div class="field">
        //             <div class="control">
        //                 <input class="input is-info is-rounded" type="text" placeholder="How much?">
        //                 <button class="button is-success" id="confirmAddFunds" style="margin:5px">OK</button>
        //             </div>
        //         </div>
        //     </div>

        //   </div>
        //     </div>
        //     </div>
        //     `)
        // }

        $('#newTripButton').on('click', renderNewTrip);
        $('#existingTripsButton').on('click', renderExistingTrips);
}

export function newGroupMember(members) {
    let newID = members;
    let groupMemberInput = `
    <div class="field">
    <div class="control">
        <input class="input is-info is-rounded" type="text" id="groupmember${newID}" data-id="${newID}" placeholder="Group Member Username">
    </div>
    </div>`;
    $('#groupmemberfields').append(groupMemberInput);
}

async function lookupUserByUsername(username){
  var user = await axios({
    method:"GET",
    url:"http://localhost:3000/public/accounts/"+username
  })
  console.log(user)
  return user
}

export async function createTrip(groupMembers, location, amountToRaise) {
        $('.modal').addClass("is-active");
        var jwt = localStorage.getItem("jwt")
        var email = localStorage.getItem("loggedInEmail")
        
        if(!groupMembers.includes(email)){
          groupMembers.push(email)
        }

        var tripId = "trip" + Date.now()        
        
        //Make sure every group member is a valid id
        for(var memberIndex in groupMembers){
          try{
          var memberProfile = await lookupUserByUsername(groupMembers[memberIndex])
          if(memberProfile.data.result.first == undefined){
            alert(groupMembers[memberIndex] + " is not a valid username")
            return
          }
        }catch(e){
          alert(groupMembers[memberIndex] + " is not a valid username")
          return
        }
        }
        
        //Make trip in private datastore
        var trip = await axios({
          method: "POST",
          headers:{
            "Authorization" : "Bearer " + jwt
          },
          url: "http://localhost:3000/private/trips/"+tripId,
          data: {
              data: {
                groupMemberUsernames:groupMembers,
                location:location,
                amountToRaise: amountToRaise,
                amountRaised: 0
              }
          }
      })

      //Add tripid to logged-in user's datastore & initialize amt contributed
      var tripObject = {}
      tripObject[tripId] = {"amountContributed":0}
      var makeUser = await axios({
        method: "POST",
        headers: {
            "Authorization": "Bearer " + jwt
        },
        url: "http://localhost:3000/user/trips/"+tripId,
        data: {
            data: {amountContributed:0}
        }
    })

    alert("New trip created!")
}


$(function () {
    renderSite();
});