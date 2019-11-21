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
        <div class="box">
        <h2>New Trip Created!</h2>
        </div>
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
            <div id="groupmemberfields">
            <div class="field">
              <div class="control">
                <input class="input is-info is-rounded groupmemberinput" id="groupmember1" type="text" data-id="1" placeholder="Group Member">
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
    $('#existingTripsButton').on('click', renderExistingTrips);
    $('#newgroupmember').click(function () {
        numOfMembers++;
        newGroupMember(numOfMembers);
    });
    $('#createtrip').click(function () {
        //get form data and pass through createTrip(groupMembers, location);
        let location = $('#locationinput').val();
        let groupMembers = [];
        for (let i=0; i<numOfMembers; i++) {
            let groupMemberID = '#groupmember' + (i+1);
            groupMembers[i] = $(groupMemberID).val();
        }

        // alert('location: ' + location);
        // alert('group members: ' + groupMembers);
        createTrip(groupMembers, location);
        renderNewTrip(groupMembers, location);
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
        <input class="input is-info is-rounded" type="text" id="groupmember${newID}" data-id="${newID}" placeholder="Group Member">
    </div>
    </div>`;
    $('#groupmemberfields').append(groupMemberInput);
}

export async function createTrip(groupMembers, location) {
        // alert('create trip clicked');
        //change html to show they clicked it
        //assign groupMembers to info from group members input boxes
        //assign location to info from location input box
        //push location & groupMembers onto server in form of new trip!
        $('.modal').addClass("is-active");
}


$(function () {
    renderSite();
});