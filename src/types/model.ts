interface WhereObj<T> {
    where: T
}
interface FindOne {
    id: number;
}

interface SequalResult {
    dataValues: {
        id: number;
        filename: string;
        url: string;
    }
}

interface FindAll {
    [keyname: string]: number | string | boolean
}

export interface SequelizeModel {
    findOne(options: WhereObj<FindOne>): Promise<SequalResult>;
    findAll(options?: WhereObj<FindAll>): Promise<Array<SequalResult>>
    create(options: { filename: string, url: string }): Promise<SequalResult>
    update(options1: { filename: string; url: string }, options2: WhereObj<FindOne>): Promise<number>;
    destroy(options: WhereObj<FindOne>): Promise<number>;
}