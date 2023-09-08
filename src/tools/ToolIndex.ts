import { NodeValue } from "@thinairthings/react-nodegraph"
import { GetStockDataToolExecution, GetStockDataToolInputNode } from "./GetStockData/GetStockData"
import { GetOptionDataToolExecution, GetOptionDataToolInputNode } from "./GetOptionData/GetOptionData"

/** The set of tools available to achieve a goal. */
export type ToolNodeIndex = {
    /** The tool for getting financial stock data. */
    'GetStockDataToolNode': NodeValue<GetStockDataToolInputNode>
    /** The tool for getting financial options data. */
    'GetOptionDataToolNode': NodeValue<GetOptionDataToolInputNode>
    /** The tool for transforming data into the specified goals structure form. */
}

export const ToolExecutionIndex = {
    'GetStockDataToolNode': GetStockDataToolExecution,
    'GetOptionDataToolNode': GetOptionDataToolExecution,
}