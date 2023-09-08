import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { IRestClient, restClient } from "@polygon.io/client-js";
import { useEdge } from "@thinairthings/react-nodegraph";
import { ReactNode, createContext } from "react";


const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

export const PolygonContext = createContext<IRestClient>(null as any)
export const PolygonProvider = ({ children }: { children: ReactNode }) => {
    const [tokenNode] = useEdge(async () => {
        return (await secretsClient.send(new GetSecretValueCommand({
            SecretId: "POLYGON_API_KEY_DEV"
        }))).SecretString!;
    },[])
    const [clientNode] = useEdge(async ([token]) => {
        return restClient(token)
    }, [tokenNode])
    if (clientNode.state !== "success") return null
    return <>
        <PolygonContext.Provider value={clientNode.value}>
            {children}
        </PolygonContext.Provider>
    </>
}