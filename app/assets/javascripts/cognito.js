//For testing of Amazon Cognito in the browser
//

CognitoService = new function () {
    self = this;

    this.getCognitoID = function(datasetCB) {
        // set the Amazon Cognito region
        AWS.config.region = 'us-east-1';

        // Joseph's Cognito id stuff
        /*
        var AWS_REGION = "us-east-1";
        var ACCOUNT_ID = '057712867440';
        var DATASET = "UserDM";
        var POOL_ID = 'us-east-1:aa00ea17-5449-4148-b4ee-5cc5f7d5698f';
        var UNAUTH_ROLE_ARN = 'arn:aws:iam::057712867440:role/Cognito_UserDMUnauth_DefaultRole';
        */

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

            client.openOrCreateDataset('testDataset', function(err, dataset) {
                //do something with dataset right here.

                if(datasetCB) {
                    console.log("calling datasetCB");
                    datasetCB();
                } else {
                    console.log("datasetCB not called");
                }
            
            })
        });
    }

    /**
     * sync to s3, if callback, executes after object has been pushed to s3
     * @param cb
     */
    this.syncToS3 = function(cb) {

        var s3 = new AWS.S3();

        //console.log(AWS.config.credentials);

        var objKey = AWS.config.credentials.identityId + '/stuff2';
        var bucket = 'cognitousers';

        var params = {
            Bucket: bucket,
            Key: objKey,
            ContentType: 'text/plain',
            Body: "Hello",
            ACL: 'public-read'
        };

        var getParams = {
            Bucket: bucket,
            Key: objKey
        }

        console.log("About to place stuff in bucket");

        s3.headObject(getParams, function(err, data) {
            if (err) {
                console.log("Object does not exist " + err);
            } else {
                console.log("Object does exist " + JSON.stringify(data));
            }
        });
        /*
        s3.putObject(params, function(err, data) {
            if (data) {
                console.log("Successfully placed stuff in bucket");
                if (cb) {
                    cb(data);
                }
            } else {
                console.log(err, err.stack);
            }
        });

        s3.getObject(getParams, function(err, data) {
            if (data) {
                console.log("Successfully retrieved data");
            } else {
                console.log(err);
            }
        });
        */
    }
}

CognitoService.getCognitoID(CognitoService.syncToS3);
//CognitoService.syncToS3();
