import { useContext, useMemo } from "react"
import { callFunctionFactory } from "./api/callFunctionFactory"
import { OpenaiContext } from "./OpenAiProvider"
import { transformDataFactory } from "./api/transformDataFactory"


export const useOpenai = () => {
    const openaiClient = useContext(OpenaiContext)
    return useMemo(() => {
        return {
            callFunction: callFunctionFactory(openaiClient),
            transformData: transformDataFactory(openaiClient)
        }
    }, [openaiClient])
}