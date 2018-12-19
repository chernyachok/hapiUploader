interface WhereObj<T> {
    where: T
}
interface FindOne {
    id: number;
}

interface FindAll {
    [keyname: string]: number | string
}

export interface SequelizeModel {
    findOne(options?: WhereObj<FindOne>): Promise<object>
    findAll(options?: WhereObj<FindAll>): Promise<object>
    create(options?: {filename: string, url: string}): Promise<object>
}