import { generateSchema, getProgramFromFiles } from "typescript-json-schema"


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