import { Request, Response, Application, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Order, OrderProduct, OrderStore } from '../models/order';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    try {
        const order = await store.index();
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(parseInt(req.params.id));
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const order: Order = {
        status: 'succes',
        user_id: parseInt(req.body.userId),
    };

    const orderProduct: OrderProduct = {
        quantity: parseInt(req.body.quantity),
        order_id: parseInt(req.body.productId),
        product_id: parseInt(req.body.productId),
    };

    try {
        const newOrder = await store.create(order, orderProduct);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(<string>token, <string>process.env.TOKEN_SECRET);

        next();
    } catch (error) {
        res.status(401).json('Unauthorized');
    }
};

const order_routes = (app: Application) => {
    app.get('/order', verifyAuthToken, index);
    app.get('/order/:id', verifyAuthToken, show);
    app.post('/order', verifyAuthToken, create);
};

export default order_routes;
