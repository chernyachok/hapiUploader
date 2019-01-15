import Boom from 'boom';
import { ClientError } from '../constants';

export const boomDictionary = {
    [ClientError.invalidToken]: () => Boom.unauthorized(ClientError.invalidToken),
    [ClientError.userNotExists]: () => Boom.notFound(ClientError.userNotExists),
    [ClientError.invalidFileFormat]: () => Boom.badData(ClientError.invalidFileFormat),
    [ClientError.fileAlreadyExists]: () => Boom.badRequest(ClientError.fileAlreadyExists),
    [ClientError.fileNotExists]: () => Boom.notFound(ClientError.fileNotExists)
};