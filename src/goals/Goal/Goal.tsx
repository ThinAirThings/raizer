
import { AirNode, nodeFromValue, useEdge, useNodeResolver } from "@thinairthings/react-nodegraph";
import { FC, createContext, useRef } from "react";
import { GoalExecutionIndex } from "../GoalIndex";
import { AchieveGoal } from "../../type-index";

/** The input to the system providing the contextual information necessary to achieve the goal.  */
export type GoalInputNode = AirNode<{
    /** The key to the goal index */
    goalKey: keyof typeof GoalExecutionIndex
    /** The initial prompt from which this goal was derived. */
    initialPrompt: string
    /** Reasoning as to why this goal was chosen based on the input prompt. */
    reasoning: string
    /** The type structure of the goal encoded in JSON schema format. */
    goalStructure: Record<string, any>
}, 'GoalInputNode'>

export const Goal: FC<{input: GoalInputNode}> = ({
    input
}) => {
    // Create Goal Resolver Ref
    const [goalResolver, goalResolutionNode] = useNodeResolver()

    // Create Goal Success Edge
    const [ExecuteGoalNode] = useEdge(async ([input, goalStructure]) => {
        const GoalExecutionFunction = GoalExecutionIndex[input.goalKey]
        return () => <GoalExecutionFunction input={nodeFromValue(goalStructure) as any}/>
    },[input, goalResolutionNode] as const)
    return <>
        <AchieveGoal 
            input={input}
            goalResolver={goalResolver}
        />
        {ExecuteGoalNode.state === 'success' && <ExecuteGoalNode.value/>}
    </>
}