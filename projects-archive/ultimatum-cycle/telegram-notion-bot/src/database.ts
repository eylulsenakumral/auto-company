import Database from 'better-sqlite3';
import path from 'path';

interface Order {
  id?: number;
  telegram_user_id: number;
  telegram_username?: string;
  template_id: string;
  amount_stars: number;
  payment_status: 'pending' | 'completed' | 'failed';
  telegram_payment_charge_id?: string;
  created_at?: string;
  completed_at?: string;
  delivery_message_id?: number;
}

export class OrdersDatabase {
  private db: Database.Database;

  constructor(dbPath: string = './orders.db') {
    this.db = new Database(dbPath);

    // Enable WAL mode for better concurrency (multiple users can buy simultaneously)
    this.db.pragma('journal_mode = WAL');

    this.init();
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_user_id BIGINT NOT NULL,
        telegram_username TEXT,
        template_id TEXT NOT NULL,
        amount_stars INTEGER NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        telegram_payment_charge_id TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        delivery_message_id BIGINT
      );

      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(telegram_user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
    `);
  }

  createOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const stmt = this.db.prepare(`
      INSERT INTO orders (
        telegram_user_id, telegram_username, template_id,
        amount_stars, payment_status, telegram_payment_charge_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      order.telegram_user_id,
      order.telegram_username || null,
      order.template_id,
      order.amount_stars,
      order.payment_status,
      order.telegram_payment_charge_id || null
    );

    return { ...order, id: info.lastInsertRowid as number };
  }

  updateOrderStatus(
    orderId: number,
    status: 'completed' | 'failed',
    completedAt?: string,
    deliveryMessageId?: number
  ) {
    const stmt = this.db.prepare(`
      UPDATE orders
      SET payment_status = ?, completed_at = ?, delivery_message_id = ?
      WHERE id = ?
    `);

    stmt.run(status, completedAt || null, deliveryMessageId || null, orderId);
  }

  getOrdersByUser(userId: number): Order[] {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE telegram_user_id = ?');
    return stmt.all(userId) as Order[];
  }

  getOrderByPaymentChargeId(chargeId: string): Order | undefined {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE telegram_payment_charge_id = ?');
    return stmt.get(chargeId) as Order | undefined;
  }

  close() {
    this.db.close();
  }
}
