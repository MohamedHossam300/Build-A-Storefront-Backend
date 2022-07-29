import { Request, Response, Application, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const user = await store.index();
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(parseInt(req.params.id));
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const user: User = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        password: req.body.password,
    };

    try {
        const newUser = await store.create(user);
        var token = jwt.sign(
            { user: newUser },
            <string>process.env.TOKEN_SECRET
        );
        res.json(token);
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

const user_routes = (app: Application) => {
    app.get('/user', verifyAuthToken, index);
    app.get('/user/:id', verifyAuthToken, show);
    app.post('/user', create);
};

export default user_routes;
