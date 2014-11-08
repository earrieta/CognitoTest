# Cognito Demo

Using code sampled from [Amazon Cognito js](https://github.com/aws/amazon-cognito-js)

This demo currently only shows an unauthenticated user connecting to my AWS account.

In order to get Cognito working correctly, it's important to define your account's unauthenticated user role very precisely, making sure that the trust relationship between it and entities that can assume this role are very well defined.

A sample trust policy for an unauthenticated user is:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "YOUR_IDENTITY_POOL_ID"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
```

Permissions must be granted as well. This is a sample permission policy for an unauthenticated user (though it can be more conservative):

```
{
    "Version": "2012-10-17",
    "Statement": [{
        "Action": [
            "mobileanalytics:PutEvents",
            "cognito-identity:*",
            "cognito-sync:*",
            "sts:*"
        ],
        "Effect": "Allow",
        "Resource": [
            "*"
        ]
    }]
}
```

These resources were helpful in getting me to understand the service better, and how to implement this successfully: 

* [Understanding Amazon Cognito Authentication](http://mobile.awsblog.com/post/Tx2UQN4KWI6GDJL/Understanding-Amazon-Cognito-Authentication)
* [Using Amazon Cognito in your Website](http://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication)
