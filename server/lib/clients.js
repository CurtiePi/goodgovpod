// Load the AWS SDK for Node.js
import { fromIni } from '@aws-sdk/credential-providers';
import { EC2Client } from '@aws-sdk/client-ec2';

const ec2Client = new EC2Client({
        credentials: fromIni({
                profile: 'BrooklynBrown'
        }),
        region: 'us-east-2'
});

export { ec2Client, s3Client };
