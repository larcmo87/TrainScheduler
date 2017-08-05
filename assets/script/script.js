// Initialize Firebase


var config = {
     apiKey: "AIzaSyBl1so79zJancP0wXZrw9s-Fvvc3covb44",
    authDomain: "trainschedule-6b90c.firebaseapp.com",
    databaseURL: "https://trainschedule-6b90c.firebaseio.com",
    projectId: "trainschedule-6b90c",
    storageBucket: "trainschedule-6b90c.appspot.com",
    messagingSenderId: "66097298732"
    };

    //connect to database
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    $("#enter_info").on("click",function(){
        
        //capture the input data
        var trainName = $("#train_name").val();
        var trainDest = $("#train_dest").val();
        var trainStartTime =  $("#train_stt").val();
        var trainMinFrequency =  $("#train_mf").val();
        var trainNextArrivalTime = "";
        var trainMinutesAway = "";

        //add captured input data to object trainInfo
        var trainInfo = {
            trainName : trainName,
            trainDest : trainDest,
            trainStartTime : trainStartTime,
            trainMinFrequency : trainMinFrequency,
            trainNextArrivalTime : trainNextArrivalTime,
            trainMinutesAway : trainMinutesAway
        }

        //add the new data to firebase
        database.ref(trainName).set(trainInfo);
        
        $("#train_name").val("");
        $("#train_dest").val("");
        $("#train_stt").val("");
         $("#train_mf").val("");
    });

        //do when value change
        database.ref().on("value",function(snapshot) {

            //clear train data in table
             $(".train_info").html("");

             //loop through the objects
            snapshot.forEach(function(childSnapshot) {

              // key will be the name of the train
              var key = childSnapshot.key;             
             
                //make call to getNextArival function and pass in start time, minutes frequency and 1 (next arrival time) or 2 (minutes remaining)
               var newArrivalTime = getNextArival(childSnapshot.val().trainStartTime, childSnapshot.val().trainMinFrequency, 1);
               var newMinutes =  getNextArival(childSnapshot.val().trainStartTime, childSnapshot.val().trainMinFrequency, 2);
                  
                //write train data to table
              $("#add_train").append("<tr><td class='train_info'>" + key + "</td><td class='train_info'>" + childSnapshot.val().trainDest + "</td><td class='train_info'>" + childSnapshot.val().trainMinFrequency + "</td><td class='train_info'>" + newArrivalTime +  "</td><td class='train_info'>" + newMinutes + "</td></tr>");
              
            });
        });


    //function to get either the next arrival time or minutes till next train
    var getNextArival = function(startTime, frequency, returnValue){
        //frequency in minutes
        var tFrequency = frequency;

        // train start time
        var startTime = startTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");
        console.log(startTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        nextTrain =  moment(nextTrain).format("hh:mm");


        //return updated train arrival time
        if(returnValue === 1){
            return nextTrain;
        }
        
        //return updated minutes til next train
        if(returnValue === 2){
            return tMinutesTillTrain;
        }
    }
