export { ThoughtState } from "./schema/ThoughtGraph";

import { Edge } from "@thinairthings/react-nodegraph";
import { useLLMNode } from "./components/hooks/useLLMNode.ai";

export type AIuseLLM = Parameters<typeof useLLMNode>[0] extends Edge<infer T> ? T : never;