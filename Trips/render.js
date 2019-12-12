
export const renderSite = function () {
  const $root = $('#root');
  $root.on('click', '#logButton', handleLogoutPress);
  $root.on('click', '#newTripButton', renderNewTrip);
  $root.on('click', '#existingTripsButton', renderExistingTrips);
  $root.on('click', '#tripInvitationsButton', renderTripInvitations);
  $root.on('click', '#paidOutTripsButton', renderCashedOutTrips);
  renderExistingTrips();
}
function debounce(f, t) {
  return function (args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && ((this.lastCall - previousCall) <= t)) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  }
}

export const handleLogoutPress = function(event) {
  localStorage.removeItem('jwt');
}

export function renderNewTrip() {
  $('#noexistingtrips').html("")
  let numOfMembers = 1;
  let possibleGroupMemers = ['Allison', 'Carlee', 'Brooke', 'Zach'];
  $('#body').empty();
  $('#content').empty();
  $('#body').append(`
      <div class="box tripsbox" id="boxContents">
          <div id="newTrip" id="newTripInputs">
            <p class="title is-1">New Trip</p>
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
          </div>
        </div>
    `);

  $('#newTripButton').on('click', renderNewTrip);

  $('#paymentdebug').on('click', function () {
    //CHANGE 100 TO CUSTOM AMOUNT, need to pull tripid, amount, and userid from fields. Userid can be gotten from localstorage.
    redirectToPayment(100, 'trip1575910089164', 'jakob1')
  });
  // $('.groupmemberinput').autoComplete({
  //   source: possibleGroupMemers
  // });

  $('#tripInvitationsButton').on('click', renderTripInvitations);

  $('#backenddebug').on('click', function () {
    backendDebug()
  })

  // $('#existingTripsButton').on('click', renderExistingTrips);
  // $('#paidOutTripsButton').on('click', renderCashedOutTrips);

  $('#newgroupmember').click(function () {
    numOfMembers++;
    newGroupMember(numOfMembers);
  });

  $('#createtrip').click(function () {
    //get form data and pass through createTrip(groupMembers, location);
    let location = $('#locationinput').val();
    let amountToRaise = $('#amounttoraiseinput').val()

    if (isNaN(amountToRaise)) {
      alert(amountToRaise + " is not a valid number!")
      return
    }

    let groupMembers = [];
    for (let i = 0; i < numOfMembers; i++) {
      let groupMemberID = '#groupmember' + (i + 1);
      var inputVal = $(groupMemberID).val();
      if (!(inputVal == "")) {
        groupMembers.push(inputVal)
      }
    }
    createTrip(groupMembers, location, amountToRaise);
    renderExistingTrips();
  });
  const userSearch = $('.groupmemberinput');
  userSearch.on('input', debounce(searchUsers,200));
}
export async function backendDebug() {
  //UNCOMMENT THESE TO DEBUG AND CHANGE TRIP IDS APPROPRIATELY
  // var acceptedTripData = await getAcceptedTripsInfoForLoggedInUser()
  // var awaitingAcceptanceTripData = await getAwaitingAcceptanceTripsInfoForLoggedInUser()
  // console.log(acceptedTripData)
  // console.log(awaitingAcceptanceTripData)
  //deleteTripForUser('trip1575909491281','jakob1')
  //deleteTrip('trip1575911120842')
  await cashoutTrip('trip1575991806409')
  console.log("done")
}

export async function redirectToPayment(amount, tripid, userid) {
  console.log("Payment debug button clicked");
  const params = new URLSearchParams();
  params.append('success_url', 'http://localhost:3001/Trips/success.html?amount=' + amount + '&user=' + userid + "&tripid=" + tripid)
  params.append('cancel_url', 'http://localhost:3001/Trips/trips.html')
  params.append('payment_method_types[0]', 'card')
  params.append("line_items[0][name]", "Trip Contribution")
  params.append("line_items[0][description]", "Contribute " + amount/100.0 + " dollars to your trip")
  params.append("line_items[0][amount]", amount)
  params.append("line_items[0][currency]", "usd")
  params.append("line_items[0][quantity]", 1)

  var sessionId = 0
  const result = await axios({
      method: 'post',
      url: 'https://api.stripe.com/v1/checkout/sessions',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer sk_test_702S1G8Evlw75ncc3aPMYT1g00L7g6VPO9`
      },
      data: params
    }).then(response => {
      console.log(response)
      sessionId = response.data.id

      var stripe = Stripe('pk_test_cCOZBKg8RGeE4rz7xxmLIYyg00RyBxbRhM');
      console.log(stripe)

      var checkout = stripe.redirectToCheckout({
        sessionId: sessionId
      }).then(function (result) {
        console.log("Result: " + result)
      }, function (error) {
        console.log("Error: " + error)
      }).catch(function (caught) {
        console.log("Caught: " + caught)
      });
      //DO STUFF AFTER PAYMENT IN success.html

    })
    .catch(error => {
      console.log(error.response)
    });

}

export async function renderCashedOutTrips() {
  $('#noexistingtrips').html("")
  var tripsData = await getAcceptedTripsInfoForLoggedInUser() 
  var user = localStorage.getItem('loggedInEmail')
  var result = tripsData.filter(function(tripdata){
      return tripdata.cashedOut != undefined && tripdata.cashedOut
  })
  //console.log(cashedOutTrips)
  
    let location=[];
    let goalAmount=[];
    let currentAmount=[];
    let groupMembersAccepted=[];
    let groupMembersAwaitingAcceptance=[];
    let tripid =[];

    
    for (let i = 0; i < result.length; i++) {
      location[i] = result[i].location;
      goalAmount[i] = result[i].amountToRaise;
      currentAmount[i] = result[i].amountRaisedBeforeCashout;
      groupMembersAccepted[i] = result[i].accepted;
      groupMembersAwaitingAcceptance[i] = result[i].awaitingAcceptance;
      tripid[i] = result[i].tripId;
    }

    console.log(groupMembersAwaitingAcceptance);
    console.log(groupMembersAccepted);
    let groupMembersHTML= [];
    for (let i = 0; i < location.length; i++){
      //IGNORE CASHED OUT TRIPS
      
      groupMembersHTML[i] = "";
      for (let j = 0; j < groupMembersAccepted[i].length; j++) {
        if (groupMembersAccepted[i][j] != localStorage.getItem("loggedInEmail")) {
          groupMembersHTML[i] += `<p>${groupMembersAccepted[i][j]} -- accepted </p>`;
        }
      }
    }

    for (let i = 0; i < location.length; i++){
      for (let j = 0; j < groupMembersAwaitingAcceptance[i].length; j++) {
          groupMembersHTML[i] += `<p>${groupMembersAwaitingAcceptance[i][j]} -- invite sent </p>`;
      }
    }

        $('#body').empty();
        $('#content').empty();

        if (tripid.length == 0) {
          $('#content').empty();
          $('#content').append(`
          <div class="section">
          <div class="container">
          <div id="noTripsExisting" class="box">
            <div class="columns">
          <div class="media-content">
              <p class="title is-4">You have no cashed out trips.</p>
          </div>
        </div>
          </div>
          </div>
          `)
        }

  let bodyHTML = ""
  for (let i = 0; i < location.length; i++) {
    var amountUserHasContributed = await getAmountContributedByLoggedInUserForTripid(tripid[i])
    bodyHTML += `
          <div class="section">
          <div class="container">
          <div id="content${tripid[i]}" class="box">
            <div class="columns">
          <div class="media-content">
              <p class="title is-4" id="name">${location[i]} trip </p>
              <div class="column is-half content" id="groupmembers">
              <!-- loop through for each group member --> 
                  <p class="groupmember">
                    ${localStorage.getItem("loggedInEmail")} (You) -- accepted
                  </p>
                  ${groupMembersHTML[i]}
                  </div>
          </div>
              <div class="column is-half" id="progress">
                <h2>$${parseInt(currentAmount[i])} raised out of $${parseInt(goalAmount[i])} goal (${parseInt(amountUserHasContributed)} contributed by you)</h2>
                <progress class="progress is-large is-info" value="${parseInt(currentAmount[i])}" max="${parseInt(goalAmount[i])}"></progress>
              </div>
            </div>
              <div class="columns">
              <div class = "column is-half" id="editTripButtons${tripid[i]}" style="float:right">`
                if(result[i].host == user){
                bodyHTML += `<button class="button is-danger deleteTripButton" style="margin:5px" id="deleteTripButton" data-tripid="${tripid[i]}">Delete Trip</button>`
                }
                bodyHTML += `
              </div>
              </div>
        </div>
          </div>
          </div>
          `
  }

        $('#body').append(bodyHTML);

        // $('#newTripButton').on('click', renderNewTrip);
        // $('#existingTripsButton').on('click', renderExistingTrips);
        // $('#tripInvitationsButton').on('click', renderTripInvitations);
        // $('#paidOutTripsButton').on('click',renderCashedOutTrips) 
        $('.deleteTripButton').on('click', function() {
          deleteTrip(event.target.dataset.tripid);
        });

  //DO STUFF TO RENDER HERE
}

export async function renderExistingTrips() {
    var user = localStorage.getItem('loggedInEmail')
    let location=[];
    let goalAmount=[];
    let currentAmount=[];
    let groupMembersAccepted=[];
    let groupMembersAwaitingAcceptance=[];
    let tripid =[];
    var result = await getAcceptedTripsInfoForLoggedInUser()
    var counter = 0
    for (let i = 0; i < result.length; i++) {
      if(result[i].cashedOut){
        continue
      }
      location[counter] = result[i].location;
      goalAmount[counter] = result[i].amountToRaise;
      currentAmount[counter] = result[i].amountRaised;
      groupMembersAccepted[counter] = result[i].accepted;
      groupMembersAwaitingAcceptance[counter] = result[i].awaitingAcceptance;
      tripid[counter] = result[i].tripId;
      counter++
    }


    console.log(groupMembersAwaitingAcceptance);
    console.log(groupMembersAccepted);
    let groupMembersHTML= [];
    for (let i = 0; i < location.length; i++){
      //IGNORE CASHED OUT TRIPS
      
      groupMembersHTML[i] = "";
      for (let j = 0; j < groupMembersAccepted[i].length; j++) {
        if (groupMembersAccepted[i][j] != localStorage.getItem("loggedInEmail")) {
          groupMembersHTML[i] += `<p>${groupMembersAccepted[i][j]} -- accepted </p>`;
        }
      }
    }

    for (let i = 0; i < location.length; i++){
      for (let j = 0; j < groupMembersAwaitingAcceptance[i].length; j++) {
          groupMembersHTML[i] += `<p>${groupMembersAwaitingAcceptance[i][j]} -- invite sent </p>`;
      }
    }

        $('#body').empty();
        $('#content').empty();

        if (tripid.length == 0 && $('#noexistingtrips').length == 0) {
          $('#body').append(`
          <div class="section" id="noexistingtrips">
          <div class="container">
          <div id="noTripsExisting" class="box">
            <div class="columns">
          <div class="media-content">
              <p class="title is-4">You have no existing trips.</p>
              <p class="title is-7">Click 'New Trip' to create one!</p>
            </div>
              <div class="columns">
              <div class = "column" id="editTripButtons">
                <button class="button is-success" style="margin:5px" id="goToNewTrip">New Trip</button>
              </div>
              </div>
        </div>
          </div>
          </div>
          `)
          $('#goToNewTrip').on('click', renderNewTrip);
        }else if(tripid.length == 0 && $('#noexistingtrips').length != 0){
          $('#noexistingtrips').html(`
          <div class="section" id="noexistingtrips">
          <div class="container">
          <div id="noTripsExisting" class="box">
            <div class="columns">
          <div class="media-content">
              <p class="title is-4">You have no existing trips.</p>
              <p class="title is-7">Click 'New Trip' to create one!</p>
            </div>
              <div class="columns">
              <div class = "column" id="editTripButtons">
                <button class="button is-success" style="margin:5px" id="goToNewTrip">New Trip</button>
              </div>
              </div>
        </div>
          </div>
          </div>
          `)
          $('#goToNewTrip').on('click', renderNewTrip);
        }else if(tripid.length > 0){
          $('#noexistingtrips').html("")
        }

        

  let bodyHTML = ""
  for (let i = 0; i < location.length; i++) {
    var amountUserHasContributed = await getAmountContributedByLoggedInUserForTripid(tripid[i])
    bodyHTML += `
          <div class="section">
          <div class="container">
          <div id="content${tripid[i]}" class="box">
            <div class="columns">
          <div class="media-content">
              <p class="title is-4" id="name">${location[i]} trip</p>
              <div class="column is-half content" id="groupmembers">
              <!-- loop through for each group member --> 
                  <p class="groupmember">
                    ${localStorage.getItem("loggedInEmail")} (You) -- accepted
                  </p>
                  ${groupMembersHTML[i]}
                  </div>
          </div>
              <div class="column is-half" id="progress">
                <h2>$${currentAmount[i]} raised out of $${parseInt(goalAmount[i])} goal (${parseInt(amountUserHasContributed)} contributed by you)</h2>
                <progress class="progress is-large is-info" value="${parseInt(currentAmount[i])}" max="${parseInt(goalAmount[i])}"></progress>
              </div>
            </div>
              <div class="columns">
              <div class = "column is-half" id="editTripButtons${tripid[i]}" style="float:right">
                <!-- delete this when 'add funds' clicked -->
                <button class="button is-success addFundsButton" style="margin:5px" id="addFundsButton" data-tripid="${tripid[i]}">Add funds</button>`
                if(result[i].host == user){
                bodyHTML += `<button class="button is-success cashOutButton" style="margin:5px" id="cashoutButton" data-tripid="${tripid[i]}">Cash Out Trip</button>
                <button class="button is-danger deleteTripButton" style="margin:5px" id="deleteTripButton" data-tripid="${tripid[i]}">Delete Trip</button>`
                
                }
                bodyHTML += `
              </div>
              </div>
        </div>
          </div>
          </div>
          `
  }

        $('#body').append(bodyHTML);

        $('.deleteTripButton').on('click', function() {
          deleteTrip(event.target.dataset.tripid);
        });
        
        $('.cashOutButton').on('click', function() {
          cashoutTrip(event.target.dataset.tripid);
        });

            $('.addFundsButton').on('click', function () {
              let tripid = event.target.dataset.tripid;
              $('#editTripButtons' + tripid).empty();
              $('#content' + tripid).append(`
              <div id="addfundsform">
              <h2>Add funds</h2>
                <div class="field">
                    <div class="control">
                        <input class="input is-info is-rounded addFundsAmount" type="text" id="addFundsAmount${tripid}" placeholder="How much? $">
                        <button class="button is-success confirmAddFunds" id="confirmAddFunds${tripid}" style="margin:5px">OK</button>
                    </div>
                </div>
            </div>
              `)
              $('.confirmAddFunds').on('click', function () {
                let amount = document.getElementById('addFundsAmount' + tripid).value * 100;
                var email = localStorage.getItem("loggedInEmail")
                console.log("adding " + amount);
                redirectToPayment(amount, tripid, email);
              });
            });

        // $('#newTripButton').on('click', renderNewTrip);
        // $('#existingTripsButton').on('click', renderExistingTrips);
        // $('#tripInvitationsButton').on('click', renderTripInvitations);
        // $('#paidOutTripsButton').on('click',renderCashedOutTrips)

}


export async function renderTripInvitations() {
  $('#noexistingtrips').html("")
  let sentFrom = [];
  let locations = [];
  let tripid = [];
  getAwaitingAcceptanceTripsInfoForLoggedInUser().then(function (result) {
    for (let i = 0; i < result.length; i++) {
      locations[i] = result[i].location;
      sentFrom[i] = result[i].host;
      tripid[i] = result[i].tripId;
    }

  $('#body').empty();
  $('#content').empty();

  if (tripid.length == 0) {
    $('#content').empty();
    $('#content').append(`
    <div class="section">
    <div class="container">
    <div id="noTripsExisting" class="box">
      <div class="columns">
    <div class="media-content">
        <p class="title is-4">You have no trip invitations.</p>
    </div>
  </div>
    </div>
    </div>
    `)
  }

  let bodyHTML = "";
  for (let i = 0; i < sentFrom.length; i++) {
    bodyHTML += `
    <div class="section">
    <div class="container">
    <div id="invitationsBox" class="box">
      <div class="columns">
    <div class="media-content">
        <p class="title is-4" id="name">${locations[i]} trip</p>
        <p class="title is-7" id="inviteSentBy">Invitation from ${sentFrom[i]}</p>
      </div>
        <div class="columns">
        <div class = "column" id="editTripButtons">
          <button class="button is-success" style="margin:5px" id="acceptInviteButton" data-tripid="${tripid[i]}">Accept</button>
          <button class="button is-danger" style="margin:5px" id="declineInviteButton" data-tripid="${tripid[i]}">Decline</button>
        </div>
        </div>
  
  </div>
    </div>
    </div>`
  }

  $('#body').append(bodyHTML);
  $('#acceptInviteButton').on('click', function() {
    acceptInvite(event.target.dataset.tripid);
  });

$('#declineInviteButton').on('click', function() {
    declineInvite(event.target.dataset.tripid);
  });
});
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
  $(`#groupmember${newID}`).on('input', searchUsers);
}

async function lookupUserByUsername(username) {
  var user = await axios({
    method: "GET",
    url: "http://localhost:3000/public/accounts/" + username
  })
  console.log(user)
  return user
}

export async function createTrip(groupMembers, location, amountToRaise) {
  $('.modal').addClass("is-active");
  var jwt = localStorage.getItem("jwt")
  var email = localStorage.getItem("loggedInEmail")

  if (!groupMembers.includes(email)) {
    groupMembers.push(email)
  }

  var tripId = "trip" + Date.now()
  var nonHostUsers = []
  var memberData = []

  //Make sure every group member is a valid id
  for (var memberIndex in groupMembers) {
    try {
      var memberProfile = await lookupUserByUsername(groupMembers[memberIndex])
      memberProfile.data.result['username'] = groupMembers[memberIndex]
      memberData.push(memberProfile.data.result)
      var username = memberProfile.data.result.username
      if (username == undefined) {
        alert(groupMembers[memberIndex] + " is not a valid username")
        return
      }
      if (!(username == email)) {
        nonHostUsers.push(username)
      }
    } catch (e) {
      alert(groupMembers[memberIndex] + " is not a valid username")
      return
    }
  }

  //Make trip in private datastore
  var trip = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId,
    data: {
      data: {
        awaitingAcceptance: nonHostUsers,
        accepted: [email],
        location: location,
        amountToRaise: amountToRaise,
        amountRaised: 0,
        host: email,
        cashedOut: false
      }
    }
  })

  //Add tripid to logged-in user's datastore & initialize amt contributed
  var makeUser = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/user/trips/" + tripId,
    data: {
      data: {
        amountContributed: 0
      }
    }
  })

  for (var memberDataIndex in memberData) {
    var currMemberData = memberData[memberDataIndex]

    if (currMemberData.username == email) {
      delete currMemberData.username
      currMemberData.acceptedTrips.push(tripId)
      currMemberData.hostedTrips.push(tripId)
      //Add tripId to 'acceptedTrips' for host in public
      var addToAcceptedTripForhost = await axios({
        method: "POST",
        url: "http://localhost:3000/public/accounts/" + email,
        data: {
          data: currMemberData
        }
      });
    } else {
      var guestEmail = currMemberData.username
      delete currMemberData.username
      currMemberData.awaitingAcceptance.push(tripId)
      //Add tripId to 'acceptedTrips' for host in public
      var addToAcceptedTripForhost = await axios({
        method: "POST",
        url: "http://localhost:3000/public/accounts/" + guestEmail,
        data: {
          data: currMemberData
        }
      });
    }
  }
}

async function getAcceptedTripsInfoForLoggedInUser() {
  var jwt = localStorage.getItem("jwt")
  var email = localStorage.getItem("loggedInEmail")

  var userdata = await axios({
    method: "GET",
    url: "http://localhost:3000/public/accounts/" + email
  });

  var listOfAcceptedTrips = userdata.data.result.acceptedTrips
  var dataToReturn = []
  for (var tripIndex in listOfAcceptedTrips) {
    var tripId = listOfAcceptedTrips[tripIndex]
    var tripData = await axios({
      method: "GET",
      headers: {
        "Authorization": "Bearer " + jwt
      },
      url: "http://localhost:3000/private/trips/" + tripId
    })
    tripData = tripData.data.result
    tripData.tripId = tripId
    dataToReturn.push(tripData)
  }
  return dataToReturn
}

async function getAwaitingAcceptanceTripsInfoForLoggedInUser() {
  var jwt = localStorage.getItem("jwt")
  var email = localStorage.getItem("loggedInEmail")

  var userdata = await axios({
    method: "GET",
    url: "http://localhost:3000/public/accounts/" + email
  });

  var listOfTripIds = userdata.data.result.awaitingAcceptance
  var dataToReturn = []
  for (var tripIndex in listOfTripIds) {
    var tripId = listOfTripIds[tripIndex]
    var tripData = await axios({
      method: "GET",
      headers: {
        "Authorization": "Bearer " + jwt
      },
      url: "http://localhost:3000/private/trips/" + tripId
    })
    tripData = tripData.data.result
    tripData.tripId = tripId
    dataToReturn.push(tripData)
  }
  return dataToReturn
}

export async function acceptInvite(tripId) {
  var jwt = localStorage.getItem("jwt")
  var user = localStorage.getItem("loggedInEmail")

  //Update public
  var publicData = await lookupUserByUsername(user)
  publicData = publicData.data.result

  //Move from awaitingAcceptance to accepted
  publicData.acceptedTrips.push(tripId)
  publicData.awaitingAcceptance = publicData.awaitingAcceptance.filter(function (tripidInArray) {
    return tripidInArray != tripId
  })

  //Repost to update
  var addToAcceptedTripForhost = await axios({
    method: "POST",
    url: "http://localhost:3000/public/accounts/" + user,
    data: {
      data: publicData
    }
  });

  //Update private
  var privateTripDataAxios = await axios({
    method: "GET",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId
  })
  var privateData = privateTripDataAxios.data.result

  //Move from awaiting acceptance to accepted
  privateData.accepted.push(user)
  privateData.awaitingAcceptance = privateData.awaitingAcceptance.filter(function (userInArray) {
    return userInArray != user
  })

  //Repost to update
  var trip = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId,
    data: {
      data: privateData
    }
  })

  //Update user
  var makeUser = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/user/trips/" + tripId,
    data: {
      data: {
        amountContributed: 0
      }
    }
  })

  console.log(publicData)
  console.log(privateData)
  console.log(userData)
}

export async function declineInvite(tripId) {
  var jwt = localStorage.getItem("jwt")
  var user = localStorage.getItem("loggedInEmail")

  //Update public
  var publicData = await lookupUserByUsername(user)
  publicData = publicData.data.result

  //Move from awaitingAcceptance to accepted
  publicData.awaitingAcceptance = publicData.awaitingAcceptance.filter(function (tripidInArray) {
    return tripidInArray != tripId
  })

  //Repost to update
  var declineTripForHost = await axios({
    method: "POST",
    url: "http://localhost:3000/public/accounts/" + user,
    data: {
      data: publicData
    }
  });

  //Update private
  var privateTripDataAxios = await axios({
    method: "GET",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId
  })
  var privateData = privateTripDataAxios.data.result

  //Move from awaiting acceptance to accepted
  privateData.awaitingAcceptance = privateData.awaitingAcceptance.filter(function (userInArray) {
    return userInArray != user
  })

  //Repost to update
  var postUpdatedPrivateData = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId,
    data: {
      data: privateData
    }
  })

}

export async function deleteTrip(tripId) {
  var jwt = localStorage.getItem("jwt")
  var user = localStorage.getItem("loggedInEmail")

  var privateTripDataAxios = await axios({
    method: "GET",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId
  })
  var tripData = privateTripDataAxios.data.result

  if(tripData.host != user){
    alert("Only the host can delete this trip! Contact " + tripData.host)
    return
  }
  var awaitingAcceptanceUserList = tripData.awaitingAcceptance
  var acceptedList = tripData.accepted

  //Delete for all the awaitingAcceptance users then for all the accepted users
  for(var userIndex in awaitingAcceptanceUserList){
    var user = awaitingAcceptanceUserList[userIndex]
    await deleteTripForUser(tripId,user)
  }

  for(var userIndex in acceptedList){
    var user = acceptedList[userIndex]
    await deleteTripForUser(tripId,user)
  }

  var privateTripDataAxios = await axios({
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId
  })
}

async function deleteTripForUser(tripId, user) {
  var jwt = localStorage.getItem("jwt")

  //Update public
  var publicData = await lookupUserByUsername(user)
  publicData = publicData.data.result

  //Move from awaitingAcceptance to accepted
  publicData.awaitingAcceptance = publicData.awaitingAcceptance.filter(function (tripidInArray) {
    return tripidInArray != tripId
  })

  publicData.acceptedTrips = publicData.acceptedTrips.filter(function (tripidInArray) {
    return tripidInArray != tripId
  })

  publicData.hostedTrips = publicData.acceptedTrips.filter(function (tripidInArray) {
    return tripidInArray != tripId
  })

  //Repost to update
  var deleteTripInPublic = await axios({
    method: "POST",
    url: "http://localhost:3000/public/accounts/" + user,
    data: {
      data: publicData
    }
  });

  console.log("Done deleting trip " + tripId)
}

async function cashoutTrip(tripId){
  var jwt = localStorage.getItem("jwt")

  //Get current state 
  var tripDataAxios = await axios({
    method: "GET",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId
  })

  //Set to 0 and cashed out
  var tripData = tripDataAxios.data.result
  tripData.amountRaisedBeforeCashout = tripData.amountRaised
  tripData.cashedOut = true
  tripData.amountRaised = 0

  //Repost to update
  var trip = await axios({
    method: "POST",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/private/trips/" + tripId,
    data: {
      data: tripData
    }
  })
}

export async function getAmountContributedByLoggedInUserForTripid(tripid){
  var jwt = localStorage.getItem("jwt")

  var userTripData = await axios({
    method: "GET",
    headers: {
      "Authorization": "Bearer " + jwt
    },
    url: "http://localhost:3000/user/trips/" + tripid
  })

  var amountContributed = userTripData.data.result.amountContributed
  return amountContributed
}

async function searchUsers(event) {
  let id = event.target.id;
  const res = await fetch("../comp426-backend/data/account.json");
  let users = await res.json();
  users = Object.keys(users['users'])
  const searchText = $(`#${id}`).val();

  let matches = users.filter(user => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return user.match(regex); //maybe add first/last name too
  });
  if (searchText.length === 0) {
    matches = [];
  } 
  outputHTML(matches,searchText, id);
}

function outputHTML(matches, searchText, id) {
  $('#dropdown').remove();
  if(matches.length === 0) {
    return;
  }
  let html = '<div id="dropdown">'
  html += matches.map(match => 
    `<div class="card autocomplete"><p><strong>${searchText}</strong>${match.substring(searchText.length)}</p></div>`
  ).join('');
  html += '</div>';
  html = $(html)[0];
  $(`#${id}`)[0].parentElement.append(html);
  $(`.autocomplete`).on('click', fillInputBox);
}

export function fillInputBox(event) {
  let text = event.target.innerText;
  let id = event.target.closest('.control').children[0].getAttribute('id');
  $(`#${id}`).val(text);
  $('#dropdown').remove();
}

$(function () {
  renderSite();
});