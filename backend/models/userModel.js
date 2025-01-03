const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../bd/database.sqlite");
const db = new sqlite3.Database(dbPath);

const UserModel = {
  findById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.get(query, [id], callback);
  },

  create: (user, callback) => {
    const query = "INSERT INTO users (name, cpf, email, password, saldo) VALUES (?, ?, ?, ?, ?)";
    db.run(query, [user.name, user.cpf, user.email, user.password, user.saldo], function (err) {
      callback(err, this?.lastID);
    });
  },

  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], callback);
  },

  findTransactionsByUserId: (userId, callback) => {
    const query = "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC";
    db.all(query, [userId], callback);
  },

  createTransaction: (transaction, callback) => {
    const query = "INSERT INTO transactions (user_id, description, amount, date) VALUES (?, ?, ?, ?)";
    db.run(query, [transaction.user_id, transaction.description, transaction.amount, transaction.date], function (err) {
      callback(err, this?.lastID);
    });
  },

  updateBalance: (userId, amount, callback) => {
    const query = "UPDATE users SET saldo = saldo + ? WHERE id = ?";
    db.run(query, [amount, userId], callback);
  },

  updateBalanceByCpf: (cpf, amount, callback) => {
    const query = "UPDATE users SET saldo = saldo + ? WHERE cpf = ?";
    db.run(query, [amount, cpf], callback);
  }
};

module.exports = UserModel;
