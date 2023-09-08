import { NodeValue } from "@thinairthings/react-nodegraph";
import { SimpleLineChartGoalExecution, SimpleLineChartGoalNode } from "./SimpleLineChart/SimpleLineChart";
import { PieChartGoalNode } from "./PieChart/PieChart";


/** The set of possible goals. */
export type GoalNodeIndex = {
    /** The goal of creating a simple line chart to visualize data. */
    'SimpleLineChartGoalNode': NodeValue<SimpleLineChartGoalNode>
    /** The goal of creating a pie chart to visualize data. */
    'PieChartGoalNode': NodeValue<PieChartGoalNode>
}

export const GoalExecutionIndex = {
    'SimpleLineChartGoalNode': SimpleLineChartGoalExecution,
    'PieChartGoalNode': SimpleLineChartGoalExecution,
} as const