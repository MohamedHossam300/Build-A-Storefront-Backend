import Client from '../database';

export type Product = {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM product';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get products: ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM product WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`unable get products ${id}. Error: ${err}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql =
                'INSERT INTO product (name, description, price, category) VALUES($1, $2, $3, $4) RETURNING *';
            const result = await conn.query(sql, [
                product.name,
                product.description,
                product.price,
                product.category,
            ]);
            const insertProduct = result.rows[0];
            conn.release;
            return insertProduct;
        } catch (err) {
            throw new Error(
                `unable add product ${product.name}. Error: ${err}`
            );
        }
    }
}
