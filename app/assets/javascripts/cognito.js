//For testing of Amazon Cognito in the browser
//

function getCognitoID() {
    // set the Amazon Cognito region
    AWS.config.region = 'us-east-1';

    // initialize the Credentials object with our parameters
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        AccountId: "154366951325",
        IdentityPoolId: "us-east-1:8fb63f8b-bf2a-47cd-af3b-9b4a19214e31",
        RoleArn: "arn:aws:iam::154366951325:role/Cognito_TestUnauth_DefaultRole"    
    });

    // We can set the get method of the Credentials object to retrieve
    // the unique identifier for the end user (identityId) once the provider
    // has refreshed itself

    AWS.config.credentials.get(function() {
        client = new AWS.CognitoSyncManager();

        console.log(client.getIdentityId());

        //My code here...

        client.openOrCreateDataset('testDataset', function(err, dataset) {
            //do something with dataset right here.
    
            dataset.put('time2', 'opened browser', function(err, record) {
                if (!err) {
                    console.log(record);
                } else {
                    console.log('Error making entry in dataset');
                }
            })
     
            dataset.get('time2', function(err, value) {
                if (!err) {
                    console.log('time1 : ' + value)
                } else {
                    console.log('Error retrieving record');
                }
            })
    
            dataset.synchronize({

                onSuccess: function(dataset, newRecords) {
                    console.log("Success synchronizing: " + newRecords);
                    console.log("Current Dataset: " + JSON.stringify(dataset));
                },

                onFailure: function(err) {
                    console.log("Error in synchonization: " + err);
                },

                onConflict: function(dataset, conflicts, callback) {

                     var resolved = [];

                     for (var i=0; i<conflicts.length; i++) {

                        // Take remote version.
                        resolved.push(conflicts[i].resolveWithRemoteRecord());

                        // Or... take local version.
                        // resolved.push(conflicts[i].resolveWithLocalRecord());

                        // Or... use custom logic.
                        // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
                        // resolved.push(conflicts[i].resovleWithValue(newValue);

                     }

                     dataset.resolve(resolved, function() {
                        return callback(true);
                     });

                     // Or... callback false to stop the synchronization process.
                     // return callback(false);
                },

                onDatasetDeleted: function(dataset, datasetName, callback) {
                     // Return true to delete the local copy of the dataset.
                     // Return false to handle deleted datasets outsid ethe synchronization callback.

                     return callback(true);
                },

                onDatasetMerged: function(dataset, datasetNames, callback) {
                     // Return true to continue the synchronization process.
                     // Return false to handle dataset merges outside the synchroniziation callback.

                     return callback(true);
                }
            })
        
        })


    });
}

getCognitoID();
