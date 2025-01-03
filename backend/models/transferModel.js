const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../bd/database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      recipient_cpf TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      due_date TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (sender_id) REFERENCES users (id)
    )
  `);
});

const TransferModel = {
  create: (transfer, callback) => {
    const query = `
      INSERT INTO transfers (sender_id, recipient_cpf, amount, description, due_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      query,
      [
        transfer.sender_id,
        transfer.recipient_cpf,
        transfer.amount,
        transfer.description,
        transfer.due_date,
        transfer.created_at,
      ],
      function (err) {
        if (err) {
          return callback(err);
        }

        const updateBalanceQuery = `
          UPDATE users
          SET saldo = saldo - ?
          WHERE id = ?
        `;
        db.run(updateBalanceQuery, [transfer.amount, transfer.sender_id], function (err) {
          if (err) {
            return callback(err);
          }

          const updateRecipientBalanceQuery = `
            UPDATE users
            SET saldo = saldo + ?
            WHERE cpf = ?
          `;
          db.run(updateRecipientBalanceQuery, [transfer.amount, transfer.recipient_cpf], function (err) {
            if (err) {
              return callback(err);
            }

            callback(null, this.lastID);
          });
        });
      }
    );
  },

  getAllTransactionsByUserId: (userId, userCpf, callback) => {
    const query = `
      SELECT t.id, t.sender_id, t.recipient_cpf, t.amount, t.description, t.due_date, t.created_at, u.name as sender_name
      FROM transfers t
      LEFT JOIN users u ON t.sender_id = u.id
      WHERE t.sender_id = ? OR t.recipient_cpf = ?
      ORDER BY t.created_at DESC
    `;
    db.all(query, [userId, userCpf], callback);
  },

  getTransferSummary: (userId, userCpf, callback) => {
    const query = `
      SELECT
        SUM(CASE WHEN sender_id = ? THEN -amount ELSE 0 END) AS total_sent,
        SUM(CASE WHEN recipient_cpf = ? THEN amount ELSE 0 END) AS total_received
      FROM transfers
    `;
    db.get(query, [userId, userCpf], callback);
  },

  updateBalance: (userId, amount, callback) => {
    const query = `
      UPDATE users
      SET saldo = saldo + ?
      WHERE id = ?
    `;
    db.run(query, [amount, userId], callback);
  },

  updateBalanceByCpf: (recipientCpf, amount, callback) => {
    const query = `
      UPDATE users
      SET saldo = saldo + ?
      WHERE cpf = ?
    `;
    db.run(query, [amount, recipientCpf], callback);
  },

  getTransferById: (id, callback) => {
    const query = `
      SELECT t.id, t.sender_id, t.recipient_cpf, t.amount, t.description, t.due_date, t.created_at, u.name as sender_name
      FROM transfers t
      LEFT JOIN users u ON t.sender_id = u.id
      WHERE t.id = ?
    `;
    db.get(query, [id], callback);
  }
};

module.exports = TransferModel;
