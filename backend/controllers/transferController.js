const TransferModel = require("../models/transferModel");
const UserModel = require("../models/userModel");

const TransferController = {
  createTransfer: (req, res) => {
    const { id: senderId } = req.params;
    const { recipientCpf, amount, description, dueDate } = req.body;

    if (!recipientCpf || !amount) {
      return res.status(400).json({ error: "CPF do destinatário e valor são obrigatórios." });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: "O valor da transferência deve ser maior que zero." });
    }

    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const currentDate = new Date();

      if (isNaN(dueDateObj.getTime())) {
        return res.status(400).json({ error: "Data de vencimento inválida." });
      }

      if (dueDateObj < currentDate) {
        return res.status(400).json({ error: "A data de vencimento não pode ser menor que a data atual." });
      }
    }

    UserModel.findById(senderId, (err, sender) => {
      if (err) {
        console.error("Erro ao buscar remetente:", err);
        return res.status(500).json({ error: "Erro ao verificar saldo do remetente." });
      }

      if (!sender) {
        return res.status(404).json({ error: "Remetente não encontrado." });
      }

      if (sender.saldo < amount) {
        return res.status(400).json({ error: "Saldo insuficiente." });
      }

      const transfer = {
        sender_id: senderId,
        recipient_cpf: recipientCpf,
        amount: parseFloat(amount),
        description: description || null,
        due_date: dueDate || null,
        created_at: new Date().toISOString(),
      };

      TransferModel.create(transfer, (err, transferId) => {
        if (err) {
          console.error("Erro ao processar a transferência:", err);
          return res.status(500).json({ error: "Erro ao processar a transferência." });
        }

        UserModel.updateBalance(senderId, -amount, (err) => {
          if (err) {
            console.error("Erro ao atualizar o saldo do remetente:", err);
            return res.status(500).json({ error: "Erro ao atualizar o saldo do remetente." });
          }
        });

        UserModel.updateBalanceByCpf(recipientCpf, amount, (err) => {
          if (err) {
            console.error("Erro ao atualizar o saldo do destinatário:", err);
            return res.status(500).json({ error: "Erro ao atualizar o saldo do destinatário." });
          }
        });

        console.log("Transferência criada com sucesso:", transferId);
        res.status(201).json({
          message: "Transferência realizada com sucesso.",
          transferId,
        });
      });
    });
  },

  getTransferSummary: (req, res) => {
    const { id } = req.params;

    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar dados do usuário." });
      }

      const userCpf = user.cpf;

      TransferModel.getTransferSummary(id, userCpf, (err, result) => {
        if (err) {
          console.error("Erro ao buscar resumo das transferências:", err);
          return res.status(500).json({ error: "Erro ao buscar resumo das transferências." });
        }

        res.json({
          totalSent: result.total_sent || 0,
          totalReceived: result.total_received || 0,
        });
      });
    });
  },

  getAllTransactions: (req, res) => {
    const { id } = req.params;

    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar dados do usuário." });
      }

      const userCpf = user.cpf;

      TransferModel.getAllTransactionsByUserId(id, userCpf, (err, transactions) => {
        if (err) {
          console.error("Erro ao buscar transações:", err);
          return res.status(500).json({ error: "Erro ao buscar transações." });
        }

        res.json(transactions);
      });
    });
  },

  getTransferDetails: (req, res) => {
    const { id, transferId } = req.params;

    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar dados do usuário." });
      }

      const userCpf = user.cpf;

      TransferModel.getTransferById(transferId, userCpf, (err, transfer) => {
        if (err) {
          console.error("Erro ao buscar transferência:", err);
          return res.status(500).json({ error: "Erro ao buscar transferência." });
        }

        if (!transfer) {
          return res.status(404).json({ error: "Transferência não encontrada." });
        }

        res.json(transfer);
      });
    });
  },
};

module.exports = TransferController;
