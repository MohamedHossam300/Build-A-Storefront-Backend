import { User, UserStore } from '../user';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server';

const store = new UserStore();

const request = supertest(app);

const users: User = {
    id: 1,
    firstname: 'firstName .ex',
    lastname: 'lastName .ex',
    password: 'password .ex',
};

let token: string;

describe('User Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('create method should add a User', async () => {
        const result = await store.create(users);
        expect(result).toEqual({
            id: 3,
            firstname: users.firstname,
            lastname: users.lastname,
            password: result.password,
        });

        token = jwt.sign({ user: result }, <string>process.env.TOKEN_SECRET);
    });

    it('index method should return a list of User', async () => {
        const result = await store.index();
        expect(result).toEqual([
            {
                id: 1,
                firstname: users.firstname,
                lastname: users.lastname,
                password: result[0].password,
            },
            {
                id: 2,
                firstname: users.firstname,
                lastname: users.lastname,
                password: result[1].password,
            },
            {
                id: 3,
                firstname: users.firstname,
                lastname: users.lastname,
                password: result[2].password,
            },
        ]);
    });

    it('show method should return the correct User', async () => {
        const result = await store.show(1);
        expect(result).toEqual({
            id: users.id,
            firstname: users.firstname,
            lastname: users.lastname,
            password: result.password,
        });
    });

    describe('Test endpoint responses', () => {
        it('gets the api endpoint', async () => {
            const response = await request
                .get('/user')
                .auth(token, { type: 'bearer' });
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for show', async () => {
            const response = await request
                .get('/user/1')
                .auth(token, { type: 'bearer' });
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for create', async () => {
            const response = await request.post('/user').send({
                firstName: 'firstName .ex',
                lastName: 'lastName .ex',
                password: 'password .ex'
            });
            expect(response.status).toBe(200);
        });
    });
});
