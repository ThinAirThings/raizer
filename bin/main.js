#!/usr/bin/env node

// src/main.tsx
import { render } from "react-nil";
import { createServer } from "http";
import { SocketioServer } from "@thinairthings/websocket-server";
import { enableMapSet } from "immer";

// src/clients/OpenAi/OpenAiProvider.tsx
import { createContext, useContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import { useNode } from "@thinairthings/react-nodegraph";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { Fragment, jsx } from "react/jsx-runtime";
var secretsClient = new SecretsManagerClient({ region: "us-east-1" });
var OpenAiContext = createContext(null);
var useOpenai = () => useContext(OpenAiContext);
var OpenAiProvider = ({ children }) => {
  const [openAiToken] = useNode(async () => {
    return (await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: "OPENAI_API_KEY_DEV"
      })
    )).SecretString;
  }, []);
  const [openAiClient] = useNode(async ([token]) => {
    return new OpenAIApi(new Configuration({
      apiKey: token
    }));
  }, [openAiToken]);
  if (openAiClient.type !== "success")
    return null;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(OpenAiContext.Provider, { value: openAiClient.value, children }) });
};

// src/components/hooks/useArgumentParser.ts
import { useNode as useNode2 } from "@thinairthings/react-nodegraph";
import chalk from "chalk";

// src/aiApis/Stocks.ai/Stocks.json
var Stocks_default = {
  apiName: "Stocks",
  description: "This is an API with functions which can receive data about financial stocks from the Polygon.io api",
  functions: {
    getStockData: {
      name: "getStockData",
      description: "This function retrieves stock data from the Polygon.io API",
      parameters: {
        type: "object",
        properties: {
          stocksTicker: {
            type: "string",
            description: "The ticker symbol of the stock/equity. Example: Apple -> APPL, Tesla -> TSLA, etc."
          },
          multiplier: {
            type: "number",
            description: "The size of the timespan multiplier."
          },
          timespan: {
            type: "string",
            enum: [
              "second",
              "minute",
              "hour",
              "day",
              "week",
              "month",
              "quarter",
              "year"
            ],
            description: "The size of the time window."
          },
          from: {
            type: "string",
            description: "The start of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp."
          },
          to: {
            type: "string",
            description: "The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp."
          },
          limit: {
            type: "number",
            description: "Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000."
          }
        },
        required: [
          "stocksTicker",
          "multiplier",
          "timespan",
          "from",
          "to"
        ],
        additionalProperties: false
      }
    }
  }
};

// src/aiApis/Stocks.ai/getStockData.ai.ts
import { restClient } from "@polygon.io/client-js";
import { GetSecretValueCommand as GetSecretValueCommand2, SecretsManagerClient as SecretsManagerClient2 } from "@aws-sdk/client-secrets-manager";
var secretsClient2 = new SecretsManagerClient2({ region: "us-east-1" });
var polygonClient = restClient((await secretsClient2.send(new GetSecretValueCommand2({
  SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString);
var getStockData = async ({
  stocksTicker,
  multiplier,
  timespan,
  from,
  to,
  limit
}) => {
  console.log((await secretsClient2.send(new GetSecretValueCommand2({
    SecretId: "POLYGON_API_KEY_DEV"
  }))).SecretString);
  return await polygonClient.stocks.aggregates(stocksTicker, multiplier, timespan, from, to);
};

// src/components/hooks/useArgumentParser.ts
var argumentsParserSystemPrompt = `
You are a node designed to parse arguments from an input string and call the function with those arguments.
You are responsible for taking the the input string and parsing into the proper argument structure for the function.
`;
var useArgumentParser = (dispatcherEdge) => {
  const openaiClient = useOpenai();
  const [argumentsEdge] = useNode2(async ([{ functionName, argumentsEncoding }]) => {
    const chatResponse = await openaiClient.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: argumentsParserSystemPrompt
      }, {
        role: "user",
        content: argumentsEncoding
      }],
      functions: [{
        name: functionName,
        description: Stocks_default.functions[functionName].description,
        parameters: Stocks_default.functions[functionName].parameters
      }],
      function_call: {
        name: functionName
      }
    });
    const args = JSON.parse(chatResponse.data.choices[0].message.function_call.arguments);
    const stockData = await getStockData(args);
    console.log(stockData);
    return chatResponse.data.choices[0].message;
  }, [dispatcherEdge], {
    pending: () => console.log(chalk.yellow("Parser is pending")),
    success: async (value) => console.log(chalk.green(`Parser Output: ${JSON.stringify(value)}`)),
    failure: {
      final: async ({ errorLog }) => {
        console.log("Failure");
        console.log(chalk.yellow(
          JSON.stringify(errorLog[0])
        ));
      }
    }
  });
  return argumentsEdge;
};

// src/components/ThoughtNode/ThoughtNode.tsx
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
var ThoughtNode = ({
  rawInputEdge
}) => {
  const nextNodes = useArgumentParser({
    type: "success",
    value: {
      functionName: "getStockData",
      argumentsEncoding: "I want to see the data for Nvidia from the beginning of 2022 to the middle of it on a daily bar chart."
    }
  });
  return /* @__PURE__ */ jsx2(Fragment2, {});
};

// src/components/RootThought/RootThought.tsx
import { Fragment as Fragment3, jsx as jsx3 } from "react/jsx-runtime";
var RootThought = ({ rawInputEdge }) => {
  return /* @__PURE__ */ jsx3(Fragment3, { children: /* @__PURE__ */ jsx3(OpenAiProvider, { children: /* @__PURE__ */ jsx3(
    ThoughtNode,
    {
      rawInputEdge
    }
  ) }) });
};

// src/main.tsx
import { fileURLToPath } from "url";
import { dirname } from "path";
import { jsx as jsx4 } from "react/jsx-runtime";
enableMapSet();
var httpServer = createServer();
var socketioServer = new SocketioServer(httpServer, {});
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
render(
  /* @__PURE__ */ jsx4(
    RootThought,
    {
      rawInputEdge: {
        type: "success",
        value: {
          rawInput: "I want to see the data for Apple from 2011 to 2012 on a daily bar chart."
        }
      }
    }
  )
);
httpServer.listen(3001, () => {
  console.log("listening on port 3001");
});
export {
  __dirname,
  __filename,
  socketioServer
};
