
// System Prompts
export const ThoughtIndex = {
    initializer: {
        key: 'initializer',
        config: {
            prompter: {
                purpose: 'Initialize the Thought Graph',
            },
            parser:  {

            },
            scorer:  {

            },
            decider: {
                
            },
        }
    }    
}

export type ThoughtState = {
    embedding?: Array<number>
    main_idea: string
    key_points: Array<string>
}
export type ThoughtNode = {}