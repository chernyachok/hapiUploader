interface WhereObj<T> {
    where: T
}
interface FindOne {
    id: number;
}

interface FindAll {
    id?: number;
    filename?: string;
    url?: string;
}

interface SequalResult {
    dataValues: {
        id: number;
        filename: string;
        url: string;
    }
}

type Detect<S, T> = (options?: WhereObj<S>) => Promise<T>;

export interface SequelizeModel {
    findOne: Detect<FindOne, SequalResult>;
    findAll: Detect<FindAll, Array<SequalResult>>;
    create(options: { filename: string, url: string }): Promise<SequalResult>
    update(options1: { filename?: string; url?: string }, options2: WhereObj<FindOne>): Promise<number>;
    destroy: Detect<FindOne, number>;
}