export interface UserResult {
    id: number;
    username: string;
    password: string;
}

export type UsersResult = Array<UserResult>;