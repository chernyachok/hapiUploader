import Boom from 'boom';

type BoomCreator = (message?: string) => Boom;

export interface IBoomMethods {
    badImplementation: BoomCreator;
    notFound: BoomCreator;
    badData: BoomCreator;
    unauthorized: BoomCreator;
    badRequest: BoomCreator;
}