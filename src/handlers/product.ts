import { Request, Response, Application, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
    try {
        const product = await store.index();
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(parseInt(req.params.id));
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        category: req.body.category,
    };

    try {
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);

        next();
    } catch (error) {
        res.status(401).json('Unauthorized');
    }
};

const product_routes = (app: Application) => {
    app.get('/product', index);
    app.get('/product/:id', show);
    app.post('/product', verifyAuthToken, create);
};

export default product_routes;
