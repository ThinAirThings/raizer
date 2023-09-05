import { OpenAIApi } from "openai";



export const makeDecisionFactory = (
    openaiClient: OpenAIApi
) => async <T,>({
    context
}) => {
    const chatResponse = await openaiClient.createChatCompletion({
        model: 'gpt-4',
        messages: [{
            role: "system",
            content: `Generate a structured JSON string as arguments based on the provided user input, ensuring it aligns with the parameters specified by the function_calling parameters specification. 
            The output should be a valid and relevant argument structure for the intended function.
            `
        }, {
            role: "user",
            content: context
        }],
        functions: [{
            name: 'makeDecision',
            description: 'makeDecision',
            parameters: {
                context: {
                    type: 'string',
                    description: 'context'
                }
            }
        }],
        function_call: {
            name: 'makeDecision'
        }
    })
    if (!chatResponse.data.choices[0].message?.function_call || 
        !chatResponse.data.choices[0].message?.function_call?.arguments) {
        throw new Error("Model did not find a relevant function to call")
    }
    const functionCallString = chatResponse.data.choices[0].message.function_call
    return {
        result: JSON.parse(functionCallString.arguments!),
        outputForm: {
            decision: {
                type: 'string',
                description: 'decision'
            }
        }
    }
}