import Client from '../database';

export type Order = {
    id?: number;
    status: string;
    user_id: number;
};

export type OrderProduct = {
    quantity: number;
    order_id: number;
    product_id: number;
};

export class OrderStore {
    async index(): Promise<Order[] & OrderProduct[]> {
        try {
            const conn = await Client.connect();
            const sql =
                'SELECT * FROM orders JOIN order_product ON orders.id=order_product.order_id';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get order: ${err}`);
        }
    }

    async show(id: number): Promise<Order & OrderProduct> {
        try {
            const conn = await Client.connect();
            const sql: string =
                'SELECT * FROM orders JOIN order_product ON orders.id=order_product.order_id WHERE user_id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`unable get order ${id}. Error: ${err}`);
        }
    }

    async create(
        order: Order,
        orderStore: OrderProduct
    ): Promise<Order & OrderProduct> {
        try {
            const sql1: string =
                'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const conn1 = await Client.connect();
            const result1 = await conn1.query(sql1, [
                order.status,
                <number>order.user_id,
            ]);
            const orderResponse: Order = result1.rows[0];
            conn1.release();

            const sql2: string =
                'INSERT INTO order_product (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const conn2 = await Client.connect();
            const result2 = await conn2.query(sql2, [
                orderStore.quantity,
                <number>orderStore.order_id,
                <number>orderStore.product_id,
            ]);
            const orderProductResponse: OrderProduct = result2.rows[0];
            conn2.release();
            const response = { ...orderResponse, ...orderProductResponse };

            return response;
        } catch (err) {
            throw new Error(`Could not add order. Error: ${err}`);
        }
    }
}
