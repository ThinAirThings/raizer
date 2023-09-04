
import { restClient } from '@polygon.io/client-js';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const secretsClient = new SecretsManagerClient({ region: "us-east-1" });
const polygonClient = restClient((await secretsClient.send(new GetSecretValueCommand({
    SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString!);


/** This function retrieves options data from the Polygon.io API*/
export const getOptionsData = async (input:{ 
    /**The ticker symbol of the options contract.
     * To help illustrate how to read an options ticker, take a look at the following examples.
     *  A January 21, 2022 Call Option for Uber with a $50 Strike Price
     *  UBER220121C00050000 = UBER + 220121 + C + 00050000
     *  Underlying Stock - UBER
     *  Expiration Date - January 21st, 2022 or ‘220121’ (YYMMDD)
     *  Option Type - Call or ‘C’
     *  Strike Price - 00050000 (50000/1000) or $50
     *  A November 19, 2021 Put Option for Ford with a $14 Strike Price
     *  F211119P00014000 = F + 211119 + P + 00014000
     *  Underlying Stock - F (Ford)
     *  Expiration Date - November 19th, 2021 or ‘211119’ (YYMMDD)
     *  Option Type - Put or ‘P’
     *  Strike Price - 00014000 (14000/1000) or $14
    */
    optionsTicker: string,
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
    request_id: number
    /** The total number of results for this request. */
    resultsCount: number
    /** The status of this request's response. */
    status: string
    //** Array of data for the requested stock data. */
    results: Array<{
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
    return await polygonClient.stocks.aggregates(
        input.optionsTicker, 
        input.multiplier, 
        input.timespan, 
        input.from, 
        input.to
    ) as any
}