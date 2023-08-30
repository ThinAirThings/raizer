
import { restClient } from '@polygon.io/client-js';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { useNode } from '@thinairthings/react-nodegraph';
const secretsClient = new SecretsManagerClient({ region: "us-east-1" });
const polygonClient = restClient((await secretsClient.send(new GetSecretValueCommand({
    SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString!);

export const getStockData = async (
/** This function retrieves stock data from the Polygon.io API*/{
    stocksTicker,
    multiplier,
    timespan,
    from,
    to,
    limit,
}: {
    /**The ticker symbol of the stock/equity. Examples: APPL, ABT, MMM, ACN, ADBE*/ 
    stocksTicker: string,
    /**The size of the timespan multiplier.*/ 
    multiplier: number,
    /**The size of the time window.*/ 
    timespan: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' |'year'
    /**The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    from: `${number}-${number}-${number}`,
    /**The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    to: `${number}-${number}-${number}`,
    /**Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000.*/
    limit?: number,
}) => {
    console.log((await secretsClient.send(new GetSecretValueCommand({
        SecretId: "POLYGON_API_KEY_DEV"
    }))).SecretString!)
    return await polygonClient.stocks.aggregates(stocksTicker, multiplier, timespan, from, to)
}