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

// src/components/RootAi/RootAi.tsx
import { nodeFromValue as nodeFromValue3 } from "@thinairthings/react-nodegraph";

// src/components/Resolution/Resolution.tsx
import { nodeFromValue as nodeFromValue2, useEdge as useEdge5 } from "@thinairthings/react-nodegraph";

// src/clients/OpenAi/useOpenai.ts
import { useContext as useContext2 } from "react";
var useOpenai = () => {
  const openaiClient = useContext2(OpenaiContext);
  return openaiClient;
};

// src/components/Resolution/Resolution.tsx
import { jsonStructureFromAirNode as jsonStructureFromAirNode2, jsonStructureFromNodeIndex as jsonStructureFromNodeIndex2 } from "@thinairthings/ts-ai-api";

// src/goals/Goal/Goal.tsx
import { nodeFromValue, useEdge as useEdge4 } from "@thinairthings/react-nodegraph";
import { createContext as createContext2, useRef } from "react";

// src/goals/SimpleLineChart/SimpleLineChart.tsx
import { useMutation, useMutationCreateNode } from "@thinairthings/liveblocks-model";
import { useEdge as useEdge2 } from "@thinairthings/react-nodegraph";
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
var SimpleLineChartGoalExecution = ({
  input
}) => {
  const createUiNode = useMutationCreateNode(useMutation);
  useEdge2(async ([{ chartTitle, xLabel, yLabel, data }]) => {
    createUiNode({
      key: "SimpleLineChart",
      state: {
        chartTitle,
        xLabel,
        yLabel,
        data,
        containerState: {
          width: 500,
          height: 500,
          x: 0,
          y: 0,
          scale: 1
        }
      }
    });
  }, [input]);
  return /* @__PURE__ */ jsx2(Fragment2, {});
};

// src/goals/GoalIndex.ts
var GoalExecutionIndex = {
  "SimpleLineChartGoalNode": SimpleLineChartGoalExecution,
  "PieChartGoalNode": SimpleLineChartGoalExecution
};

// src/apis/Stocks/getStocksData/getStocksData.ts
import { restClient } from "@polygon.io/client-js";
import { GetSecretValueCommand as GetSecretValueCommand2, SecretsManagerClient as SecretsManagerClient2 } from "@aws-sdk/client-secrets-manager";
var secretsClient2 = new SecretsManagerClient2({ region: "us-east-1" });
var polygonClient = restClient((await secretsClient2.send(new GetSecretValueCommand2({
  SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString);

// src/apis/Stocks/getOptionsData/getOptionsData.ts
import { restClient as restClient2 } from "@polygon.io/client-js";
import { GetSecretValueCommand as GetSecretValueCommand3, SecretsManagerClient as SecretsManagerClient3 } from "@aws-sdk/client-secrets-manager";
var secretsClient3 = new SecretsManagerClient3({ region: "us-east-1" });
var polygonClient2 = restClient2((await secretsClient3.send(new GetSecretValueCommand3({
  SecretId: "POLYGON_API_KEY_DEV"
}))).SecretString);

// src/components/AchieveGoal/AchieveGoal.tsx
import { useEdge as useEdge3 } from "@thinairthings/react-nodegraph";
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api";
import { Fragment as Fragment3, jsx as jsx3 } from "react/jsx-runtime";
var AchieveGoal = ({ input }) => {
  const openai = useOpenai();
  const [ToolNode] = useEdge3(async ([goalInput]) => {
    const toolNodeIndexJson = jsonStructureFromNodeIndex("ToolNodeIndex");
    console.log("ToolNodeIndexJson: ", JSON.stringify(toolNodeIndexJson, null, 2));
    const toolSelectionOutputNodeJson = jsonStructureFromAirNode("ToolSelectionOutputNode");
    const toolResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You're an ai which selects a tool from a set of possible tools to achieve a goal.
                You will receive a prompt in JSON encoded form of the following structure:
                ${jsonStructureFromAirNode("GoalInputNode").structure}.
                Your task is to return the structure specified in the function_calling specification which
                specifies the next tool to be used to achieve the goal.
                The set of tools you may choose from are defined as follows:
                ${Object.entries(toolNodeIndexJson.index).map(([key, value]) => {
          return `${key}: ${value.description}`;
        }).join("\n")}
                `
      }, {
        role: "user",
        content: `${JSON.stringify(goalInput)}`
      }],
      // This is really the return statement of the llm
      functions: [{
        name: toolSelectionOutputNodeJson.name,
        description: toolSelectionOutputNodeJson.description,
        parameters: toolSelectionOutputNodeJson.structure
      }],
      function_call: {
        name: toolSelectionOutputNodeJson.name
      }
    });
    if (!toolResponse.data.choices[0].message?.function_call?.arguments) {
      throw new Error("Model did not find a relevant function to call");
    }
    const functionCallArguments = toolResponse.data.choices[0].message.function_call.arguments;
    const toolSelectionOutput = JSON.parse(functionCallArguments);
    console.log(JSON.stringify(toolSelectionOutput, null, 2));
    return "";
  }, [input], {
    lifecycleHandlers: {
      pending: () => console.log("Achieve goal pending")
    }
  });
  return /* @__PURE__ */ jsx3(Fragment3, {});
};

// src/goals/Goal/Goal.tsx
import { Fragment as Fragment4, jsx as jsx4, jsxs } from "react/jsx-runtime";
var GoalResolverContext = createContext2(null);
var Goal = ({
  input
}) => {
  const goalResolverRef = useRef();
  const [goalResolutionNode] = useEdge4(async () => {
    return await new Promise((success, failure) => {
      goalResolverRef.current = { success, failure };
    });
  }, []);
  const [ExecuteGoalNode] = useEdge4(async ([input2, goalStructure]) => {
    const GoalExecutionFunction = GoalExecutionIndex[input2.goalKey];
    return () => /* @__PURE__ */ jsx4(GoalExecutionFunction, { input: nodeFromValue(goalStructure) });
  }, [input, goalResolutionNode]);
  return /* @__PURE__ */ jsxs(Fragment4, { children: [
    /* @__PURE__ */ jsx4(GoalResolverContext.Provider, { value: goalResolverRef.current, children: /* @__PURE__ */ jsx4(AchieveGoal, { input }) }),
    ExecuteGoalNode.state === "success" && /* @__PURE__ */ jsx4(ExecuteGoalNode.value, {})
  ] });
};

// src/components/Resolution/Resolution.tsx
import { Fragment as Fragment5, jsx as jsx5 } from "react/jsx-runtime";
var Resolution = ({ input }) => {
  const openai = useOpenai();
  const [GoalNodes] = useEdge5(async ([{ initialPrompt }]) => {
    const outputNodeJson = jsonStructureFromAirNode2("ResolutionOutputNode");
    const goalIndexJson = jsonStructureFromNodeIndex2("GoalNodeIndex");
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You're an ai which generates a set of goals based on a predetermined set of possible goals.
                Your task is to interpret the user prompt and define 1-5 goals to be achieved.
                The set of goals you may choose from are defined as follows:
                ${Object.entries(goalIndexJson.index).map(([key, value]) => {
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
      }],
      function_call: {
        name: outputNodeJson.name
      }
    });
    if (!chatResponse.data.choices[0].message?.function_call?.arguments) {
      throw new Error("Model did not find a relevant function to call");
    }
    const functionCallArguments = chatResponse.data.choices[0].message.function_call.arguments;
    const resolutionOutput = JSON.parse(functionCallArguments);
    return resolutionOutput.goals.map(({ goalKey, reasoning }) => {
      return {
        initialPrompt,
        goalKey,
        reasoning,
        goalStructure: goalIndexJson.index[goalKey].structure
      };
    });
  }, [input], {
    lifecycleHandlers: {
      pending: () => console.log("Trying Resolution Node"),
      success: (output) => {
        console.log("Resolution Node Success");
        console.log(JSON.stringify(output, null, 4));
      },
      failure: {
        final: (error) => console.log("Resolution Node Error", JSON.stringify(error, null, 4))
      }
    }
  });
  if (GoalNodes.state !== "success")
    return null;
  return /* @__PURE__ */ jsx5(Fragment5, { children: GoalNodes.value.map((goalInputValue) => {
    return /* @__PURE__ */ jsx5(
      Goal,
      {
        input: nodeFromValue2(goalInputValue, "GoalInputNode")
      },
      goalInputValue.reasoning
    );
  }) });
};

// src/clients/Polygon/PolygonProvider.tsx
import { GetSecretValueCommand as GetSecretValueCommand4, SecretsManagerClient as SecretsManagerClient4 } from "@aws-sdk/client-secrets-manager";
import { restClient as restClient3 } from "@polygon.io/client-js";
import { useEdge as useEdge6 } from "@thinairthings/react-nodegraph";
import { createContext as createContext3 } from "react";
import { Fragment as Fragment6, jsx as jsx6 } from "react/jsx-runtime";
var secretsClient4 = new SecretsManagerClient4({ region: "us-east-1" });
var PolygonContext = createContext3(null);
var PolygonProvider = ({ children }) => {
  const [tokenNode] = useEdge6(async () => {
    return (await secretsClient4.send(new GetSecretValueCommand4({
      SecretId: "POLYGON_API_KEY_DEV"
    }))).SecretString;
  }, []);
  const [clientNode] = useEdge6(async ([token]) => {
    return restClient3(token);
  }, [tokenNode]);
  if (clientNode.state !== "success")
    return null;
  return /* @__PURE__ */ jsx6(Fragment6, { children: /* @__PURE__ */ jsx6(PolygonContext.Provider, { value: clientNode.value, children }) });
};

// src/components/RootAi/RootAi.tsx
import { Fragment as Fragment7, jsx as jsx7 } from "react/jsx-runtime";
var RootAi = ({
  userId,
  spaceId,
  rawInput
}) => {
  return /* @__PURE__ */ jsx7(Fragment7, { children: /* @__PURE__ */ jsx7(OpenaiProvider, { children: /* @__PURE__ */ jsx7(PolygonProvider, { children: /* @__PURE__ */ jsx7(
    LiveblocksNodeRoomProvider,
    {
      userId,
      spaceId,
      serverName: `aiNode-${userId}-${spaceId}`,
      children: () => /* @__PURE__ */ jsx7(
        Resolution,
        {
          input: nodeFromValue3({
            initialPrompt: rawInput
          }, "ResolutionInputNode")
        }
      )
    }
  ) }) }) });
};

// src/main.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
enableMapSet();
var httpServer = createServer();
var socketioServer = new SocketioServer(httpServer, {});
render(
  /* @__PURE__ */ jsx8(
    RootAi,
    {
      userId: "777",
      spaceId: "777",
      rawInput: "I want to see the options data for Nvidia at a strike price of $550 leading up to their earnings call which happened on August 23rd 2023."
    }
  )
);
httpServer.listen(3001, () => {
  console.log("listening on port 3001");
});
export {
  socketioServer
};
