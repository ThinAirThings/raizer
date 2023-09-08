import { AirNode, NodeValue } from '@thinairthings/react-nodegraph';
import { FC } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

/** This function retrieves stock data from the Polygon.io API*/
declare const getStocksData: (input: {
    /**The ticker symbol of the stock/equity. Examples: APPL, ABT, MMM, ACN, ADBE*/
    stocksTicker: string;
    /**The size of the timespan multiplier.*/
    multiplier: number;
    /**The size of the time window.*/
    timespan: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    /**The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    from: `${number}-${number}-${number}`;
    /**The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    to: `${number}-${number}-${number}`;
    /**Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000.*/
    limit?: number;
}) => Promise<{
    /** The exchange symbol that this item is traded under.*/
    ticker: string;
    /** Whether or not this response was adjusted for splits.*/
    adjusted: boolean;
    /** The number of aggregates (minute or day) used to generate the response. */
    queryCount: number;
    /** A request id assigned by the server. */
    request_id: string;
    /** The total number of results for this request. */
    resultsCount: number;
    /** The status of this request's response. */
    status: string;
    results?: Array<{
        /** The close price for the symbol in the given time period. */
        c: number;
        /** The highest price for the symbol in the given time period. */
        h: number;
        /** The lowest price for the symbol in the given time period. */
        l: number;
        /** The number of transactions in the aggregate window. */
        n: number;
        /** The open price for the symbol in the given time period. */
        o: number;
        /** Whether or not this aggregate is for an OTC ticker. This field will be left off if false. */
        otc: boolean;
        /** The Unix Msec timestamp for the start of the aggregate window. */
        t: number;
        /** The trading volume of the symbol in the given time period. */
        v: number;
        /** The volume weighted average price. */
        vw: number;
    }>;
    /** If present, this value can be used to fetch the next page of data. */
    next_url?: string;
}>;

/** This function retrieves options data from the Polygon.io API*/
declare const getOptionsData: (input: {
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
    optionsTicker: string;
    /**The size of the timespan multiplier.*/
    multiplier: number;
    /**The size of the time window.*/
    timespan: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    /**The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    from: `${number}-${number}-${number}`;
    /**The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    to: `${number}-${number}-${number}`;
    /**Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000.*/
    limit?: number;
}) => Promise<{
    /** The exchange symbol that this item is traded under.*/
    ticker: string;
    /** Whether or not this response was adjusted for splits.*/
    adjusted: boolean;
    /** The number of aggregates (minute or day) used to generate the response. */
    queryCount: number;
    /** A request id assigned by the server. */
    request_id: number;
    /** The total number of results for this request. */
    resultsCount: number;
    /** The status of this request's response. */
    status: string;
    results: Array<{
        /** The close price for the symbol in the given time period. */
        c: number;
        /** The highest price for the symbol in the given time period. */
        h: number;
        /** The lowest price for the symbol in the given time period. */
        l: number;
        /** The number of transactions in the aggregate window. */
        n: number;
        /** The open price for the symbol in the given time period. */
        o: number;
        /** Whether or not this aggregate is for an OTC ticker. This field will be left off if false. */
        otc: boolean;
        /** The Unix Msec timestamp for the start of the aggregate window. */
        t: number;
        /** The trading volume of the symbol in the given time period. */
        v: number;
        /** The volume weighted average price. */
        vw: number;
    }>;
    /** If present, this value can be used to fetch the next page of data. */
    next_url?: string;
}>;

/** Create a simple line chart */
declare const createSimpleLineChart: (input: {
    /** Title of Chart */
    chartTitle: string;
    /** X-Axis Label */
    xLabel: string;
    /** Y-Axis Label */
    yLabel: string;
    /** Data to be plotted */
    data: Array<{
        /** X-data*/
        x: number;
        /** Y-data */
        y: number;
    }>;
}) => Promise<{
    stuff: string;
}>;

/** The success case of this goal being acheieved. */
type SimpleLineChartGoalNode = AirNode<{
    /** Title of Chart */
    chartTitle: string;
    /** X-Axis Label */
    xLabel: string;
    /** Y-Axis Label */
    yLabel: string;
    /** Data to be plotted */
    data: Array<{
        /** X-data*/
        x: number;
        /** Y-data */
        y: number;
    }>;
}, 'SimpleLineChartGoalNode'>;

/** The success case of this goal being acheieved. */
type PieChartGoalNode = AirNode<{
    /** Title of Chart */
    chartTitle: string;
    /** Pie Chart Data */
    data: Array<{
        /** Name of section in pie chart*/
        name: string;
        /** Percentage value this section represents of the whole pie chart */
        percentage: number;
    }>;
}, 'PieChartGoalNode'>;

/** The set of possible goals. */
type GoalNodeIndex = {
    /** The goal of creating a simple line chart to visualize data. */
    'SimpleLineChartGoalNode': NodeValue<SimpleLineChartGoalNode>;
    /** The goal of creating a pie chart to visualize data. */
    'PieChartGoalNode': NodeValue<PieChartGoalNode>;
};
declare const GoalExecutionIndex: {
    readonly SimpleLineChartGoalNode: ({ input }: {
        input: SimpleLineChartGoalNode;
    }) => react_jsx_runtime.JSX.Element;
    readonly PieChartGoalNode: ({ input }: {
        input: SimpleLineChartGoalNode;
    }) => react_jsx_runtime.JSX.Element;
};

type ResolutionInputNode = AirNode<{
    initialPrompt: string;
}, 'ResolutionInputNode'>;
/** The input to the system which will take an array of goals and begin trying to achieve them. */
type ResolutionOutputNode = AirNode<{
    /** An array of goals */
    goals: Array<{
        /** The name of the goal. */
        goalKey: keyof GoalNodeIndex;
        /** The reasoning behind choosing this goal. */
        reasoning: string;
    }>;
}, 'ResolutionOutputNode'>;
declare const Resolution: FC<{
    input: ResolutionInputNode;
}>;

/** The input to the system providing the contextual information necessary to achieve the goal.  */
type GoalInputNode = AirNode<{
    /** The key to the goal index */
    goalKey: keyof typeof GoalExecutionIndex;
    /** The initial prompt from which this goal was derived. */
    initialPrompt: string;
    /** Reasoning as to why this goal was chosen based on the input prompt. */
    reasoning: string;
    /** The type structure of the goal encoded in JSON schema format. */
    goalStructure: Record<string, any>;
}, 'GoalInputNode'>;

/** The input structure for the function which retrieves stock data from the Polygon.io API*/
type GetStockDataToolInputNode = AirNode<{
    /**The ticker symbol of the stock/equity. Examples: APPL, ABT, MMM, ACN, ADBE*/
    stocksTicker: string;
    /**The size of the timespan multiplier.*/
    multiplier: number;
    /**The size of the time window.*/
    timespan: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    /**The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    from: `${number}-${number}-${number}`;
    /**The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    to: `${number}-${number}-${number}`;
    /**Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000.*/
    limit?: number;
}, 'GetStockDataToolInputNode'>;

/** This function retrieves options data from the Polygon.io API*/
type GetOptionDataToolInputNode = AirNode<{
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
    optionsTicker: string;
    /**The size of the timespan multiplier.*/
    multiplier: number;
    /**The size of the time window.*/
    timespan: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    /**The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    from: `${number}-${number}-${number}`;
    /**The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.*/
    to: `${number}-${number}-${number}`;
    /**Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000.*/
    limit?: number;
}, 'GetOptionDataToolInputNode'>;

/** The set of tools available to achieve a goal. */
type ToolNodeIndex = {
    /** The tool for getting financial stock data. */
    'GetStockDataToolNode': NodeValue<GetStockDataToolInputNode>;
    'GetOptionDataToolNode': NodeValue<GetOptionDataToolInputNode>;
};

/** The information representing the selected tool and the reasoning for selecting the tool. */
type ToolSelectionOutputNode = AirNode<{
    /** The name of the tool. */
    toolKey: keyof ToolNodeIndex;
    /** The reasoning behind choosing the tool. */
    reasoning: string;
}, 'ToolSelectionOutputNode'>;
declare const AchieveGoal: FC<{
    input: GoalInputNode;
}>;

export { AchieveGoal, Resolution, ResolutionInputNode, ResolutionOutputNode, ToolSelectionOutputNode, createSimpleLineChart, getOptionsData, getStocksData };
