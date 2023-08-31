import { getStockData } from "./getStockData/getStockData.ai";
import { useGetStockData } from "./useGetStockData/useGetStockData.ai";


export const StocksApi = {
    getStockData : getStockData,
} as const