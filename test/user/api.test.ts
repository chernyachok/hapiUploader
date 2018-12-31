import { expect } from 'chai';
import { Sequelize } from 'sequelize';
import startServer from '../init';
import { newUser } from '../mocks/data';
import { ClientError } from '../../src/constants';
import { Server } from '../../src/types';
import { UserResult } from '../../src/api/user/types';
import { createUrl } from '../../src/utils/file';

describe('Users API', () => {

    let server: Server;
    let url: string;
    let dbConn: Sequelize;
    let token: string;
    let user: UserResult;

    const getMe = async (authToken: string) =>
        server.inject({
            method: 'GET',
            url: url + '/users/me',
            headers: { authorization: authToken }
        });

    const getAllUsers = async () => 
        server.inject({
            method: 'GET',
            url: url + '/users',
            headers: { authorization: token }
        });

    const getUser = async (id: number) => 
        server.inject({
            method: 'GET',
            url: url + `/users/${id}`,
            headers: { authorization: token }
        });
        
    const testUserData = async (data: UserResult) => {
        const { id, username, password } = data;

        expect(id).to.equal(user.id);
        expect(username).to.equal(user.username);
        expect(password).to.equal(user.password);
    };

    const clearDb = async (db: Sequelize) => {
        db.query('DROP TABLE users;');
    };
    
    before(async () => {

        ({ server, dbConn } = await startServer());
        url = createUrl();

        const res = await server.inject({
            method: 'POST',
            url: url + '/users',
            payload: newUser
        });

        ({ token } = JSON.parse(res.payload));
        const data = await getMe(token);
        user = JSON.parse(data.payload);

    });

    it('GET /users - Should return list of all users, returns 200', async () => {
        const res = await getAllUsers();
        const data = JSON.parse(res.payload);

        expect(res.statusCode).to.equal(200);
        expect(data).to.be.an("array");
    });

    it('GET /users/{id} - Should return a user by id, returns 200', async () => {
        const res = await getUser(user.id);
        const data = JSON.parse(res.payload);

        expect(res.statusCode).to.equal(200);
        await testUserData(data);
    });

    it('GET /users/{id} with bad id - Should return non-existing user, returns 404', async () => {
        const res = await getUser(666);
        const data = JSON.parse(res.payload);
        expect(res.statusCode).to.equal(404);
        expect(data.message).to.equal(ClientError.userNotExists);
    });

    after(async () => {
        clearDb(dbConn);
    });
});