import { useContext } from "react"
import { PolygonContext } from "./PolygonProvider"


export const usePolygon = () => {
    const polygonClient = useContext(PolygonContext)
    return polygonClient
}