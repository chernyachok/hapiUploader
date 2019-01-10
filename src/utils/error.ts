import Boom from 'boom';
import { boomDictionary } from "./boom";

export function handleErrorToBoom(error: Error | Boom) {
    return (error as Boom).isBoom 
        ? error
        : boomDictionary[error.message](); 
}