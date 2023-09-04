// src/main.tsx
import { render } from "react-nil";
import { createServer } from "http";
import { SocketioServer } from "@thinairthings/websocket-server";
import { enableMapSet } from "immer";

// src/components/RootAi/RootAi.tsx
import { LiveblocksNodeRoomProvider } from "@thinairthings/liveblocks-model";

// src/clients/OpenAi/OpenAiProvider.tsx
import { createContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { useNode } from "@thinairthings/react-nodegraph";
import { Fragment, jsx } from "react/jsx-runtime";
var secretsClient = new SecretsManagerClient({ region: "us-east-1" });
var OpenaiContext = createContext(null);
var OpenaiProvider = ({ children }) => {
  const [openaiToken] = useNode(async () => {
    return (await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: "OPENAI_API_KEY_DEV"
      })
    )).SecretString;
  }, []);
  const [openaiClient] = useNode(async ([token]) => {
    return new OpenAIApi(new Configuration({
      apiKey: token
    }));
  }, [openaiToken]);
  if (openaiClient.type !== "success")
    return null;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(OpenaiContext.Provider, { value: openaiClient.next, children }) });
};

// src/clients/OpenAi/useOpenai.ts
import { useContext as useContext2, useMemo as useMemo2 } from "react";

// src/clients/OpenAi/api/callFunctionFactory.ts
import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api";
var callFunctionFactory = (openaiClient) => async ({
  context,
  fn
}) => {
  const jsonStructure = await jsonStructureFromFunction(fn);
  const chatResponse = await openaiClient.createChatCompletion({
    model: "gpt-4",
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
      name: jsonStructure.name,
      description: jsonStructure.description,
      parameters: jsonStructure.input
    }],
    function_call: {
      name: jsonStructure.name
    }
  });
  if (!chatResponse.data.choices[0].message?.function_call || !chatResponse.data.choices[0].message?.function_call?.arguments) {
    throw new Error("Model did not find a relevant function to call");
  }
  const functionCallString = chatResponse.data.choices[0].message.function_call;
  return await fn(JSON.parse(functionCallString.arguments));
};

// src/clients/OpenAi/api/transformDataFactory.ts
import { jsonStructureFromFunction as jsonStructureFromFunction2 } from "@thinairthings/ts-ai-api";
var transformDataFactory = (openaiClient) => async ({
  prompt,
  fn1,
  fn2
}) => {
  console.log("Here");
  const jsonStructureFn1 = await jsonStructureFromFunction2(fn1);
  const jsonStructureFn2 = await jsonStructureFromFunction2(fn2);
  const chatResponse = await openaiClient.createChatCompletion({
    model: "gpt-4",
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
          }
        },
        required: ["javascriptFunctionBodyCode"]
      }
    }],
    function_call: {
      name: "transformDataFunctionBody"
    }
  });
  if (!chatResponse.data.choices[0].message?.function_call || !chatResponse.data.choices[0].message?.function_call?.arguments) {
    console.log("HERERE");
    throw new Error("Model did not find a relevant function to call");
  }
  const functionCallString = chatResponse.data.choices[0].message.function_call;
  return await JSON.parse(functionCallString.arguments);
};

// src/clients/OpenAi/useOpenai.ts
var useOpenai = () => {
  const openaiClient = useContext2(OpenaiContext);
  return useMemo2(() => {
    return {
      callFunction: callFunctionFactory(openaiClient),
      transformData: transformDataFactory(openaiClient)
    };
  }, [openaiClient]);
};

// src/components/ProcessChain/ProcessChain.tsx
import { useNode as useNode2 } from "@thinairthings/react-nodegraph";

// src/apis/Stocks/getStockData/getStockData.ts
import { restClient } from "@polygon.io/client-js";
import { GetSecretValueCommand as GetSecretValueCommand2, SecretsManagerClient as SecretsManagerClient2 } from "@aws-sdk/client-secrets-manager";
var secretsClient2 = new SecretsManagerClient2({ region: "us-east-1" });
var polygonClient = restClient((await secretsClient2.send(new GetSecretValueCommand2({
  SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString);
var getStockData = async (input) => {
  return polygonClient.stocks.aggregates(
    input.stocksTicker,
    input.multiplier,
    input.timespan,
    input.from,
    input.to
  );
};

// src/apis/Charts/createSimpleLineChart/createSimpleLineChart.ts
var createSimpleLineChart = async (input) => {
  return {
    stuff: "stuff"
  };
};

// src/components/ProcessChain/ProcessChain.tsx
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
var ProcessChain = ({
  prompt
}) => {
  const openAiClient = useOpenai();
  const [NextNode] = useNode2(async () => {
    const stockData = await openAiClient.callFunction({
      context: "Show me data for Nvidia",
      fn: getStockData
    });
    console.log(stockData);
    const transformCode = await openAiClient.transformData({
      prompt,
      fn1: getStockData,
      fn2: createSimpleLineChart
    });
    console.log(transformCode.javascriptFunctionBodyCode);
    const dataTransformFunction = new Function("data", transformCode.javascriptFunctionBodyCode);
    const result = dataTransformFunction(stockData);
    console.log(result);
    return 5;
  }, [], {
    pending: () => console.log("Running Transform Data"),
    failure: {
      maxRetryCount: 3,
      retry: (error, { runRetry }) => runRetry(),
      final: (err) => console.log("Error Transforming Data", JSON.stringify(err))
    }
  });
  return /* @__PURE__ */ jsx2(Fragment2, {});
};

// src/components/RootAi/RootAi.tsx
import { Fragment as Fragment3, jsx as jsx3 } from "react/jsx-runtime";
var RootAi = ({
  userId,
  spaceId,
  rawInput
}) => {
  return /* @__PURE__ */ jsx3(Fragment3, { children: /* @__PURE__ */ jsx3(OpenaiProvider, { children: /* @__PURE__ */ jsx3(
    LiveblocksNodeRoomProvider,
    {
      userId,
      spaceId,
      serverName: `aiNode-${userId}-${spaceId}`,
      children: () => /* @__PURE__ */ jsx3(ProcessChain, { prompt: rawInput })
    }
  ) }) });
};

// src/main.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
enableMapSet();
var httpServer = createServer();
var socketioServer = new SocketioServer(httpServer, {});
render(
  /* @__PURE__ */ jsx4(
    RootAi,
    {
      userId: "777",
      spaceId: "777",
      rawInput: "Show me daily data for Apple opening prices from April 2023 - July 2023."
    }
  )
);
httpServer.listen(3001, () => {
  console.log("listening on port 3001");
});
export {
  socketioServer
};
