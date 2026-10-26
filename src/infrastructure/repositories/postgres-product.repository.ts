import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Product } from '../../domain/entities/product.entity.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { database as defaultDatabase } from '../database/connection.js';
import { ProductSelectRow, productsTable } from '../database/schema.js';

export class PostgresProductRepository implements IProductRepository {
  private readonly databaseInstance: NodePgDatabase<Record<string, never>>;

  constructor(
    databaseInstance: NodePgDatabase<any> = defaultDatabase as unknown as NodePgDatabase<Record<string, never>>,
  ) {
    this.databaseInstance = databaseInstance;
  }

  private mapRowToEntity(row: ProductSelectRow): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: row.stock,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(product: Product): Promise<Product> {
    const [insertedRow] = await this.databaseInstance
      .insert(productsTable)
      .values({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .returning();

    if (!insertedRow) {
      throw new Error('Failed to create product in PostgreSQL database.');
    }

    return this.mapRowToEntity(insertedRow);
  }

  async findById(id: string): Promise<Product | null> {
    const [row] = await this.databaseInstance
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!row) {
      return null;
    }

    return this.mapRowToEntity(row);
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.databaseInstance
      .select()
      .from(productsTable);

    return rows.map((row) => this.mapRowToEntity(row));
  }

  async update(id: string, product: Product): Promise<Product> {
    const [updatedRow] = await this.databaseInstance
      .update(productsTable)
      .set({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        updatedAt: product.updatedAt,
      })
      .where(eq(productsTable.id, id))
      .returning();

    if (!updatedRow) {
      throw new Error(`Failed to update product with id "${id}" in PostgreSQL database.`);
    }

    return this.mapRowToEntity(updatedRow);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.databaseInstance
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning({ deletedId: productsTable.id });

    return result.length > 0;
  }
}
