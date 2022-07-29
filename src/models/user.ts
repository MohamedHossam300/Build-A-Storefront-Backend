import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Client from '../database';

dotenv.config();

const { SALT_ROUNDS, PEPPER } = process.env;

export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    password: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable get user: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`unable get user ${id}. Error: ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql =
                'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
            const hash = bcrypt.hashSync(
                user.password + PEPPER,
                Number(SALT_ROUNDS)
            );

            const result = await conn.query(sql, [
                user.firstname,
                user.lastname,
                hash,
            ]);
            const createUser = result.rows[0];
            conn.release();
            return createUser;
        } catch (err) {
            throw new Error(`unable create user (${user.firstname}): ${err}`);
        }
    }
}
