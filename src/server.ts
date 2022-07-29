import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import product_routes from './handlers/product';
import user_routes from './handlers/user';
import order_routes from './handlers/order';

const app: Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

product_routes(app);
user_routes(app);
order_routes(app);

app.listen(port, () => {
    console.log(`server started at http://localhost:${port};`);
});

export default app;
