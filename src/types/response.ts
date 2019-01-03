import * as Boom from 'boom';
import { ResponseToolkit as ResponseExtended} from 'hapi';

type BoomCreator = (message?: string) => Boom;

export interface Response extends ResponseExtended, IBoomMethods {}

export interface IBoomMethods {
    badImplementation: BoomCreator;
    notFound: BoomCreator;
    badData: BoomCreator;
    unauthorized: BoomCreator;
    badRequest: BoomCreator;
}