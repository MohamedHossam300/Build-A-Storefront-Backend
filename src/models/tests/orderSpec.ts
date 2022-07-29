import { Order, OrderProduct, OrderStore } from '../order';
import { User, UserStore } from '../user';
import { Product, ProductStore } from '../product';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../server';

const productStore = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

const request = supertest(app);

const order: Order = {
    id: 1,
    status: 'succes',
    user_id: 1,
};

const orderProduct: OrderProduct = {
    quantity: 300,
    order_id: 1,
    product_id: 1,
};

let user: User;
let product: Product;
let token: string;

describe('Order Model', () => {
    beforeAll(async () => {
        product = {
            id: 1,
            name: 'name .ex',
            description: 'description .ex',
            price: 1,
            category: 'category .ex',
        };

        user = {
            id: 1,
            firstname: 'firstName .ex',
            lastname: 'lastName .ex',
            password: 'password .ex',
        };

        await productStore.create(product);
        const newUser = await userStore.create(user);

        token = jwt.sign({ user: newUser }, <string>process.env.TOKEN_SECRET);
    });

    it('should have an index method', () => {
        expect(orderStore.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(orderStore.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('create method should add a order', async () => {
        const result = await orderStore.create(order, orderProduct);
        const orderInput = {
            id: order.id,
            status: order.status,
            user_id: <number>user.id,
            quantity: orderProduct.quantity,
            order_id: orderProduct.order_id,
            product_id: <number>product.id,
        };
        expect(result).toEqual(orderInput);
    });

    it('index method should return a list of Orders', async () => {
        const result = await orderStore.index();
        expect(result).toEqual([
            {
                id: order.id,
                status: order.status,
                user_id: <number>user.id,
                quantity: orderProduct.quantity,
                order_id: orderProduct.order_id,
                product_id: <number>product.id,
            },
        ]);
    });

    it('show method should return the correct Order', async () => {
        const result = await orderStore.show(1);

        expect(result).toEqual({
            id: order.id,
            status: order.status,
            user_id: <number>user.id,
            quantity: orderProduct.quantity,
            order_id: orderProduct.order_id,
            product_id: <number>product.id,
        });
    });

    describe('Test endpoint responses', () => {
        it('gets the api endpoint for index', async () => {
            const response = await request
                .get('/order')
                .auth(token, { type: 'bearer' });
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for show', async () => {
            const response = await request
                .get('/order/1')
                .auth(token, { type: 'bearer' });
            expect(response.status).toBe(200);
        });

        it('gets the api endpoint for create', async () => {
            const response = await request
                .post('/order')
                .auth(token, { type: 'bearer' })
                .send({
                    status: order.status,
                    userId: <number>user.id,
                    quantity: orderProduct.quantity,
                    orderId: orderProduct.order_id,
                    productId: <number>product.id,
                });
            expect(response.status).toBe(200);
        });
    });
});
