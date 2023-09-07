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
import { useEdge } from "@thinairthings/react-nodegraph";
import { Fragment, jsx } from "react/jsx-runtime";
var secretsClient = new SecretsManagerClient({ region: "us-east-1" });
var OpenaiContext = createContext(null);
var OpenaiProvider = ({ children }) => {
  const [tokenNode] = useEdge(async () => {
    return (await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: "OPENAI_API_KEY_DEV"
      })
    )).SecretString;
  }, []);
  const [clientNode] = useEdge(async ([token]) => {
    return new OpenAIApi(new Configuration({
      apiKey: token
    }));
  }, [tokenNode]);
  if (clientNode.state !== "success")
    return null;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(OpenaiContext.Provider, { value: clientNode.value, children }) });
};

// src/components/Resolution/Resolution.tsx
import { useEdge as useEdge2 } from "@thinairthings/react-nodegraph";

// src/clients/OpenAi/useOpenai.ts
import { useContext as useContext2 } from "react";
var useOpenai = () => {
  const openaiClient = useContext2(OpenaiContext);
  return openaiClient;
};

// src/components/Resolution/Resolution.tsx
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api";
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
var Resolution = ({ input }) => {
  const openai = useOpenai();
  const [GoalNodes] = useEdge2(async ([{ initialPrompt }]) => {
    const outputNodeJson = jsonStructureFromAirNode("ResolutionOutputNode");
    const goalIndexJson = jsonStructureFromNodeIndex("GoalNodeIndex");
    console.log(JSON.stringify(goalIndexJson, null, 4));
    console.log(`${Object.entries(jsonStructureFromNodeIndex("GoalNodeIndex").index).map(([key, value]) => {
      return `${key}: ${value.description}`;
    }).join("\n")}`);
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You're an ai which generates a set of goals based on a predetermined set of possible goals.
                Your task is to interpret the user prompt and define 1-5 goals to be achieved.
                The set of goals you may choose from are defined as follows:
                ${Object.entries(jsonStructureFromNodeIndex("GoalNodeIndex").index).map(([key, value]) => {
          return `${key}: ${value.description}`;
        }).join("\n")}
                `
      }, {
        role: "user",
        content: initialPrompt
      }],
      functions: [{
        name: outputNodeJson.name,
        description: outputNodeJson.description,
        parameters: outputNodeJson.structure
      }]
    });
    if (!chatResponse.data.choices[0].message?.function_call || !chatResponse.data.choices[0].message?.function_call?.arguments) {
      console.log("HERE!!!");
      throw new Error("Model did not find a relevant function to call");
    }
    const functionCallString = chatResponse.data.choices[0].message.function_call;
    const functionCallArguments = chatResponse.data.choices[0].message.function_call.arguments;
    console.log(functionCallString, functionCallArguments);
  }, [input], {
    lifecycleHandlers: {
      pending: () => console.log("Trying Resolution Node"),
      success: () => console.log("Resolution Node Success"),
      failure: {
        final: (error) => console.log("Resolution Node Error", JSON.stringify(error, null, 4))
      }
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
      children: () => /* @__PURE__ */ jsx3(Resolution, { input: {
        type: "ResolutionInputNode",
        state: "success",
        value: {
          initialPrompt: rawInput
        }
      } })
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
