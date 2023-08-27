#!/usr/bin/env node
import { jsx, Fragment } from 'react/jsx-runtime';
import { render } from 'react-nil';
import { createServer } from 'http';
import { SocketioServer } from '@thinairthings/websocket-server';
import { enableMapSet } from 'immer';
import { createContext, useContext, useRef } from 'react';
import { useNode } from '@thinairthings/react-nodegraph';
import { OpenAIApi, Configuration } from 'openai';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema';
import prettier from 'prettier';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const secretsClient = new SecretsManagerClient({ region: "us-east-1" });
const OpenAiContext = createContext(null);
const useOpenai = () => useContext(OpenAiContext);
const OpenAiProvider = ({ children }) => {
    const [openAiToken] = useNode(async () => {
        // Get Token
        return (await secretsClient.send(new GetSecretValueCommand({
            SecretId: "OPENAI_API_KEY_DEV"
        }))).SecretString;
    }, []);
    const [openAiClient] = useNode(async ([token]) => {
        return new OpenAIApi(new Configuration({
            apiKey: token
        }));
    }, [openAiToken]);
    if (openAiClient.type !== "success")
        return null;
    return jsx(Fragment, { children: jsx(OpenAiContext.Provider, { value: openAiClient.value, children: children }) });
};

const scorerSystemPrompt = `
You are the (3 of 4) node in the path; the 'Scorer Node'.
You are responsible for drawing connections between the Thought State you receive from the Parser Node and the other Thought States in the Thought Graph.
Your ultimate goal is to output a json object which contains a set of key value pairs of type {[nodeId: string]: numerical 3 digit decimal score from 0-1} 
which represents the connectivity score of each Thought State in the Thought Graph.
`;

const createJsonSchema = (pathToFile, typeName) => {
    const schema = generateSchema(getProgramFromFiles([pathToFile]), typeName)?.properties;
    return {
        properties: schema,
        required: Object.keys(schema),
    };
};
const objectPrettify = async (obj) => {
    return await prettier.format(JSON.stringify(obj), { semi: false, parser: "json" });
};
const createOpenAiFunction = (name, description, typeName) => {
    return {
        name,
        description,
        parameters: {
            type: "object",
            ...createJsonSchema(resolve(__dirname, "ai-interface.d.ts"), typeName)
        },
    };
};

const parserSystemPrompt = `
You are the (2 of 4) node in the path; the 'Parser Node'.
You are responsible for parsing and compressing the output of the LLM into a Thought State.
A Thought State is a json object which contains the compressed state of a Thought Node.
The Thought State represents where 
Your ultimate goal is to output a Thought State. 
`;
const useParser = (processChainPreamble, t1) => {
    const openaiClient = useOpenai();
    const [t2] = useNode(async ([t1Value]) => {
        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: processChainPreamble
                        + parserSystemPrompt
                        + `You are adjacent to the (3 of 4) node in the Process Chain; the 'Scorer Node'.
                    The Scorer Node's system prompt is: ${scorerSystemPrompt}.
                    You are also adjacent to the (1 of 4) node in the Process Chain; the 'Prompter Node'.
                    The Prompter Node's system prompt is: ${prompterSystemPrompt}.
                    `
                }, {
                    role: "user",
                    content: t1Value
                }],
            functions: [
                {
                    name: "send_thought_state_to_scorer_node",
                    description: "Send the thought state to the scorer node",
                    parameters: {
                        type: "object",
                        ...createJsonSchema(resolve(__dirname, "schema/ThoughtGraph.d.ts"), "ThoughtState")
                    },
                }
            ],
            function_call: {
                name: "send_thought_state_to_scorer_node",
            }
        });
        return chatResponse.data.choices[0].message;
    }, [t1], {
        pending: () => console.log(chalk.yellow("Parser is pending")),
        success: async (value) => console.log(chalk.green(`Parser Output: ${await objectPrettify(value)}`)),
        failure: {
            final: async ({ errorLog }) => {
                console.log(chalk.yellow(await objectPrettify(errorLog[0])));
            },
        }
    });
    return t2;
};

const prompterSystemPrompt = `
You are the (1 of 4) node in the path; the 'Prompter Node'.
You are responsible for encoding the relevant Thought Node state from the Thought Graph into the prompt.
You are also responsible for encoding the relevant direct inputs from the parent Thought Node into the prompt.
Your ultimate goal is to output a prompt which can be sent to an LLM.
`;
const usePrompter = (processChainPreamble, inputPrompt) => {
    const openaiClient = useOpenai();
    const [prompterOutput] = useNode(async () => {
        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                    role: "system",
                    content: processChainPreamble
                        + prompterSystemPrompt
                        + `You are adjacent to the (2 of 4) node in the Process Chain; the 'Parser Node'.
                    The Parser Node's system prompt is: ${parserSystemPrompt}
                    `
                }, {
                    role: "user",
                    content: inputPrompt
                }],
            functions: [
                createOpenAiFunction("send_prompt_to_llm", "Send the prompt to the LLM", "LLMProps")
                // {
                //     name: "send_prompt_to_llm",
                //     description: "Send the prompt to the LLM",
                //     parameters: {
                //         type: "object",
                //         ...createJsonSchema(
                //             resolve(__dirname, "components/hooks/useLLM.d.ts"),
                //             "LLMProps"
                //         )
                //     },
                // }
            ],
            function_call: {
                name: "send_prompt_to_llm",
            }
        });
        return JSON.parse(chatResponse.data.choices[0].message?.function_call?.arguments);
    }, [], {
        pending: () => console.log(chalk.yellow("Prompter is pending")),
        success: async (value) => console.log(chalk.green(await objectPrettify(value))),
        failure: {
            final: ({ errorLog }) => console.log(chalk.red(`Prompter Error: ${errorLog[0].message}`)),
        }
    });
    return prompterOutput;
};

const useLLM = (inputPrompt) => {
    const openaiClient = useOpenai();
    const [t2] = useNode(async ([inputPrompt]) => {
        const response = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                    role: "user",
                    content: inputPrompt.prompt
                }],
        });
        return response.data.choices[0].message?.content;
    }, [inputPrompt], {
        pending: () => console.log(chalk.yellow("LLM is running")),
        success: (value) => console.log(chalk.green(`LLM Output: ${value}`)),
    });
    return t2;
};

const processChainPreamble = `
    A 'Process Chain' is an atomic directed graph with an order of 4 path of nodes nested within a 'Thought Node' of a 'Thought Graph'.
    A Thought Node is a node in a Thought Graph which contains 'Thought State'.
    The purpose of a Process Chain is to perform a series of actions based on a prompt and a set of direct inputs derived from the parent Thought Node of the Thought Node which contains the Process Chain.
`;
const useProcessChain = ({ prompt }) => {
    const prompterOutput = usePrompter(processChainPreamble, prompt);
    const llmOutput = useLLM(prompterOutput);
    const parserOutput = useParser(processChainPreamble, llmOutput);
    return parserOutput;
};
// const useScorer = (processChainPreamble: string, t1: ReturnType<typeof useParser>) => {
//     const t2 = useNode(async ([t2Value]) => {
//         const chatResponse = await openaiClient.createChatCompletion({
//             model: "gpt-4",
//             messages: [{ 
//                 role: "system", 
//                 content: processChainPreamble 
//                     + scorerSystemPrompt
//             }, {
//                 role: "user",
//                 content: t2Value
//             }]
//         })
//         return chatResponse.data.choices[0].message?.content!
//     }, [t1])
//     return t2
// }

const DepthContext = createContext(0);
const useDepth = () => useContext(DepthContext);
const RootThought = () => {
    // Depth Ref
    const depthRef = useRef(0);
    return jsx(Fragment, { children: jsx(OpenAiProvider, { children: jsx(DepthContext.Provider, { value: depthRef.current + 1, children: jsx(Thought, {}) }) }) });
};
const Thought = ({ t1, lifecycle }) => {
    const depth = useDepth();
    useProcessChain({
        prompt: "I want to know more about how sales fluctuate by the season"
    });
    // Decision
    return jsx(DepthContext.Provider, { value: depth + 1 });
};

enableMapSet();
const httpServer = createServer();
const socketioServer = new SocketioServer(httpServer, {});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
render(jsx(RootThought, {}));
httpServer.listen(3001, () => {
    console.log('listening on port 3001');
});

export { __dirname, __filename, socketioServer };
