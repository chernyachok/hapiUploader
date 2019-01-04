import { boomDictionary } from "./boom";

export const handleErrorToBoom = (message: string) =>
    boomDictionary[message]();