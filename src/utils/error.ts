import Boom from 'boom';
import { boomDictionary } from "./boom";

export function handleErrorToBoom(msgOrBoom: string | Boom): Boom {
    if (typeof msgOrBoom !== 'string') {
        return msgOrBoom;
    }
    return boomDictionary[msgOrBoom]();
}