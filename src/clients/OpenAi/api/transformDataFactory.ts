import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api";
import { OpenAIApi } from "openai";


export const transformDataFactory = (openaiClient: OpenAIApi) => async <T1,T2>({
    prompt,
    fn1,
    fn2
}: {
    prompt: string,
    fn1: (input: any) => Promise<T1>,
    fn2: (input: any) => Promise<T2>
}) => {
    const jsonStructureFn1 = await jsonStructureFromFunction(fn1)
    const jsonStructureFn2 = await jsonStructureFromFunction(fn2)
    const chatResponse = await openaiClient.createChatCompletion({
        model: 'gpt-4',
        messages: [{
            role: "system",
            content: `
                Generate a string of valid JavaScript function body code that transforms the output of the first function into the input of the second function and returns the data in the form of the input of the second function.
                Your output should look like this: {javascriptFunctionBodyCode: "return { {{transformationCode}} }"}, not like this {javascriptFunctionBodyCode: "\\n { return {{transformationCode}} }"}.
                In other words, the string should not have a newline character at the beginning.
                The output should be a string which can be passed as the input to a JavaScript Function constructor.

                Example Output: "return { 
                    chartTitle: 'Nvidia closing prices', 
                    xLabel: 'Time', 
                    yLabel: 'Price', 
                    data: data.results.map(item => ({ x: item.t, y: item.c })) 
                };"
            `
        }, {
            role: "user",
            content: `
                First Function Output: ${JSON.stringify(jsonStructureFn1.output)}.
                Second Function Input: ${JSON.stringify(jsonStructureFn2.input)}.
                Use this prompt as context for your transform: ${prompt}
            `
        }],
        functions: [{
            name: "transformDataFunctionBody",
            description: "Transforms the output of the first function into the input of the second function",
            parameters: {
                type: "object",
                properties: {
                    javascriptFunctionBodyCode: {
                        type: "string",
                        description: "The function body code which will be used to transform the data"
                    },
                },
                required: ["javascriptFunctionBodyCode"]
            }
        }],
        function_call: {
            name: "transformDataFunctionBody"
        }
    })
    if (!chatResponse.data.choices[0].message?.function_call || 
        !chatResponse.data.choices[0].message?.function_call?.arguments) {
        console.log("HERERE")
        throw new Error("Model did not find a relevant function to call")
    }
    const functionCallString = chatResponse.data.choices[0].message.function_call
    return await JSON.parse(functionCallString.arguments!) as {
        javascriptFunctionBodyCode: string
    }
}


