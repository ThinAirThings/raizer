import { Edge } from "@thinairthings/react-nodegraph";



export type NextNode<Node extends (inputEdge: Edge<any>) => Edge<any>> = Parameters<Node>[0] extends Edge<infer T> ? T : never;