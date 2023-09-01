#!/usr/bin/env node

// src/main.tsx
import { render } from "react-nil";
import { createServer } from "http";
import { SocketioServer } from "@thinairthings/websocket-server";
import { enableMapSet } from "immer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// src/clients/OpenAi/OpenAiProvider.tsx
import { createContext, useContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import { useVertex } from "@thinairthings/react-nodegraph";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { Fragment, jsx } from "react/jsx-runtime";
var secretsClient = new SecretsManagerClient({ region: "us-east-1" });
var OpenAiContext = createContext(null);
var OpenAiProvider = ({ children }) => {
  const [openAiToken] = useVertex(async () => {
    return (await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: "OPENAI_API_KEY_DEV"
      })
    )).SecretString;
  }, []);
  const [openAiClient] = useVertex(async ([token]) => {
    return new OpenAIApi(new Configuration({
      apiKey: token
    }));
  }, [openAiToken]);
  if (openAiClient.type !== "success")
    return null;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(OpenAiContext.Provider, { value: openAiClient.value, children }) });
};

// src/components/RootAi/RootAi.tsx
import { LiveblocksNodeRoomProvider } from "@thinairthings/liveblocks-model";

// src/components/LiveblocksTestConnection.tsx
import { useErrorListener, useLostConnectionListener, useStorage } from "@thinairthings/liveblocks-model";
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
var LiveblocksTestConnection = () => {
  useErrorListener((error) => {
    console.log(error);
  });
  useLostConnectionListener((event) => {
    console.log(event);
  });
  const data = useStorage((root) => {
    console.log("Here");
    console.log(root);
    return root;
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
  return /* @__PURE__ */ jsx3(Fragment3, { children: /* @__PURE__ */ jsx3(OpenAiProvider, { children: /* @__PURE__ */ jsx3(
    LiveblocksNodeRoomProvider,
    {
      userId,
      spaceId,
      serverName: `aiNode-${userId}-${spaceId}`,
      children: () => /* @__PURE__ */ jsx3(LiveblocksTestConnection, {})
    }
  ) }) });
};

// src/main.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
enableMapSet();
var httpServer = createServer();
var socketioServer = new SocketioServer(httpServer, {});
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
render(
  /* @__PURE__ */ jsx4(
    RootAi,
    {
      userId: "777",
      spaceId: "777",
      rawInput: "I want to see the data for Apple from 2011 to 2012 on a daily bar chart."
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
