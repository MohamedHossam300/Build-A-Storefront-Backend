import { Product, ProductStore } from '../product';
import { User, UserStore } from '../user';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server';

const productStore = new ProductStore();
const userStore = new UserStore();

const request = supertest(app);

const product: Product = {
    id: 1,
    name: 'name .ex',
    description: 'description .ex',
    price: 1,
    category: 'category .ex',
};

let token: string;

describe('Product Model', () => {
    beforeAll(async () => {
        const user: User = {
            id: 1,
            firstname: 'firstName .ex',
            lastname: 'lastName .ex',
            password: 'password .ex',
        };

        const newUser = await userStore.create(user);
        token = jwt.sign({ user: newUser }, <string>process.env.TOKEN_SECRET);
    });

    it('should have an index method', () => {
        expect(productStore.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(productStore.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(productStore.create).toBeDefined();
    });

    it('create method should add a Product', async () => {
        const porduct: Product = {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
        };
        const result = await productStore.create(porduct);

        expect(result).toEqual({
            id: result.id,
            name: result.name,
            description: result.description,
            price: result.price,
            category: result.category,
        });
    });

    it('index method should return a list of Product', async () => {
        const result = await productStore.index();
        expect(result).toEqual([
            {
                id: 1,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
            },
            {
                id: 2,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
            },
        ]);
    });

    it('show method should return the correct Product', async () => {
        const result = await productStore.show(1);
        expect(result).toEqual({
            id: 1,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
        });
    });

    describe('Test endpoint responses', () => {
        it('gets the api endpoint for index', async () => {
            const response = await request.get('/product');
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for show', async () => {
            const response = await request.get('/product/1');
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for create', async () => {
            const response = await request
                .post('/product')
                .auth(token, { type: 'bearer' })
                .send(product);
            expect(response.status).toBe(200);
        });
    });
});
