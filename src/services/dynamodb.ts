import AWS from 'aws-sdk';

const { DYNAMO_HOST, TABLE_NAME, AWS_REGION } = process.env;

const client = new AWS.DynamoDB.DocumentClient({
    endpoint: DYNAMO_HOST,
    region: AWS_REGION || 'eu-west-2',
});

const table = TABLE_NAME || '';

export async function getItem(
    PK: string
): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {
    const result = await client
        .get({
            TableName: table,
            Key: {
                PK,
            },
        })
        .promise();
    if (!result.$response.data) throw result.$response.error;
    return result.$response.data;
}

export async function putItem(
    PK: string,
    count: number
): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const result = await client
        .put({
            TableName: table,
            Item: {
                PK,
                count: count,
            },
        })
        .promise();
    if (!result.$response.data) throw result.$response.error;
    return result.$response.data;
}
