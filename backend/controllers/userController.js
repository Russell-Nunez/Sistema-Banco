const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserController = {
  register: (req, res) => {
    const { name, cpf, email, password } = req.body;

    if (!name || !cpf || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const saldo = Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao processar senha." });
      }

      UserModel.create({ name, cpf, email, password: hash, saldo }, (err, userId) => {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(409).json({ error: "CPF ou e-mail já cadastrados." });
          }
          return res.status(500).json({ error: "Erro ao registrar usuário." });
        }

        res.status(201).json({
          message: "Usuário registrado com sucesso.",
          id: userId,
          saldo
        });
      });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    UserModel.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar usuário." });
      }

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao validar senha." });
        }

        if (result) {
          res.json({
            message: "Login bem-sucedido.",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              saldo: user.saldo
            }
          });
        } else {
          res.status(401).json({ error: "Senha incorreta." });
        }
      });
    });
  },

  getUserById: (req, res) => {
    const { id } = req.params;

    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar usuário." });
      }

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      res.json(user);
    });
  },

  getUserBalance: (req, res) => {
    const userId = req.params.id;

    UserModel.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar saldo" });
      }

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ balance: user.saldo });
    });
  },

  getUserTransactions: (req, res) => {
    const userId = req.params.id;

    UserModel.findTransactionsByUserId(userId, (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar transações" });
      }

      res.json(transactions);
    });
  },
};

module.exports = UserController;
