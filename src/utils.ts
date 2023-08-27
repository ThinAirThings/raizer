import { generateSchema, getProgramFromFiles } from "typescript-json-schema"
import prettier from "prettier"
import { resolve } from "path"
import { __dirname } from "./main"
export const createJsonSchema = (
    pathToFile: string,
    typeName: string,
) => {
    const schema = generateSchema(
        getProgramFromFiles(
            [pathToFile],
        ),
        typeName
    )?.properties!
    return {
        properties: schema,
        required: Object.keys(schema),
    }
}


export const objectPrettify = async (obj: Record<string, any>) => {
    return await prettier.format(JSON.stringify(obj), { semi: false, parser: "json" })
}



export const createOpenAiFunction = ({
    name,
    description,
}: {
    name: string, 
    description: string, 
}) => {
    return {
        name,
        description,
        parameters: {
            type: "object",
            ...createJsonSchema(
                resolve(__dirname, "ai-interface.d.ts"),
                `AI${name}`
            )
        },
    }
}