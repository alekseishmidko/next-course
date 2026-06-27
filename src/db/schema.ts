import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  price: integer("price").notNull(),

  stock: integer("stock").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
