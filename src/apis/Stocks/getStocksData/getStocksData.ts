
import { restClient } from '@polygon.io/client-js';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const secretsClient = new SecretsManagerClient({ region: "us-east-1" });
const polygonClient = restClient((await secretsClient.send(new GetSecretValueCommand({
    SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString!);


/** This function retrieves stock data from the Polygon.io API*/
export const getStocksData = async (input: {
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
}): Promise<{
    /** The exchange symbol that this item is traded under.*/
    ticker: string
    /** Whether or not this response was adjusted for splits.*/
    adjusted: boolean
    /** The number of aggregates (minute or day) used to generate the response. */
    queryCount: number
    /** A request id assigned by the server. */
    request_id: string
    /** The total number of results for this request. */
    resultsCount: number
    /** The status of this request's response. */
    status: string
    //** Array of data for the requested stock data. */
    results?: Array<{
        /** The close price for the symbol in the given time period. */
        c: number
        /** The highest price for the symbol in the given time period. */
        h: number
        /** The lowest price for the symbol in the given time period. */
        l: number
        /** The number of transactions in the aggregate window. */
        n: number
        /** The open price for the symbol in the given time period. */
        o: number
        /** Whether or not this aggregate is for an OTC ticker. This field will be left off if false. */
        otc: boolean
        /** The Unix Msec timestamp for the start of the aggregate window. */
        t: number
        /** The trading volume of the symbol in the given time period. */
        v: number
        /** The volume weighted average price. */
        vw: number
    }>
    /** If present, this value can be used to fetch the next page of data. */
    next_url?: string
}> => { 
    return polygonClient.stocks.aggregates(
        input.stocksTicker, 
        input.multiplier, 
        input.timespan, 
        input.from, 
        input.to
    ) as any
}
