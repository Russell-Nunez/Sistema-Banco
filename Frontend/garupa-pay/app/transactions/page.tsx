'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavHeader } from '../components/nav-header'
import { TransactionCharts } from '../components/transaction-charts'
import { Button } from '../components/button'
import { TransferForm } from '../components/transfer-form'

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  sender_name: string
  created_at: string
  due_date: string
}

interface TransferData {
  recipientCpf: string
  amount: number
  description?: string
  dueDate?: string
}

export default function TransactionsPage() {
  const [showCharts, setShowCharts] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [accountBalance, setAccountBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transferSummary, setTransferSummary] = useState({
    totalSent: 0,
    totalReceived: 0,
  })
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.push('/login')
    } else {
      fetchAccountData()
    }
  }, [])

  const fetchAccountData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      console.log('User ID:', userId)

      if (!userId) {
        console.error('ID do usuário não encontrado no cache.')
        alert('Erro ao carregar os dados: ID do usuário não encontrado.')
        return
      }

      const balanceResponse = await fetch(`http://localhost:3001/api/users/${userId}/balance`)
      console.log('Balance Response:', balanceResponse)

      if (!balanceResponse.ok) {
        console.error('Erro ao buscar saldo:', balanceResponse.status)
        alert('Erro ao buscar saldo. Tente novamente mais tarde.')
        return
      }

      const balanceData = await balanceResponse.json()
      console.log('Balance Data:', balanceData)
      setAccountBalance(balanceData.balance)

      const summaryResponse = await fetch(`http://localhost:3001/api/transfers/${userId}/transfer-summary`)
      const summaryData = await summaryResponse.json()
      setTransferSummary({
        totalSent: summaryData.totalSent,
        totalReceived: summaryData.totalReceived,
      })

      const transactionsResponse = await fetch(`http://localhost:3001/api/transfers/${userId}/transactions`)
      const transactionsData = await transactionsResponse.json()
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Erro ao buscar dados da conta:', error)
      alert('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.')
    }
  }

  const handleTransfer = async (transferData: TransferData) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.error('ID do usuário não encontrado no cache.')
        alert('Erro ao realizar transferência: ID do usuário não encontrado.')
        return
      }

      const response = await fetch(`http://localhost:3001/api/transfers/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientCpf: transferData.recipientCpf,
          amount: transferData.amount,
          description: transferData.description,
          dueDate: transferData.dueDate,
        }),
      })

      if (response.ok) {
        await fetchAccountData()
        setShowTransferModal(false)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erro ao realizar a transferência')
      }
    } catch (error) {
      console.error('Erro ao realizar a transferência:', error)
      alert('Erro ao conectar com o servidor.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2A0F4C]">Área de Transações</h1>
          <Button
            onClick={() => setShowTransferModal(true)}
            className="bg-[#3DDAB4] text-[#2A0F4C] hover:bg-[#3DDAB4]/90"
          >
            Nova Transferência
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#3DDAB4]">
            <h2 className="text-xl font-semibold text-[#2A0F4C] mb-4">Saldo da Conta</h2>
            <p className="text-3xl font-bold text-[#3DDAB4]">
              {accountBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#2A0F4C]">
            <h2 className="text-xl font-semibold text-[#2A0F4C] mb-4">Resumo das Transferências</h2>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Entradas</p>
                <p className="text-lg font-semibold text-green-600">
                  {transferSummary.totalReceived.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Saídas</p>
                <p className="text-lg font-semibold text-red-600">
                  {Math.abs(transferSummary.totalSent).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2A0F4C]">
              {showCharts ? 'Gráficos de Transações' : 'Transações Recentes'}
            </h2>
            <Button
              onClick={() => setShowCharts(!showCharts)}
              className="bg-[#3DDAB4] text-[#2A0F4C] hover:bg-[#3DDAB4]/90"
            >
              {showCharts ? 'Mostrar Tabela' : 'Mostrar Gráficos'}
            </Button>
          </div>

          {showCharts ? (
            <TransactionCharts transactions={transactions} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="p-2 text-[#2A0F4C]">Descrição</th>
                    <th className="p-2 text-[#2A0F4C]">Data de Vencimento</th>
                    <th className="p-2 text-[#2A0F4C]">De</th>
                    <th className="p-2 text-[#2A0F4C]">Valor</th>
                    <th className="p-2 text-[#2A0F4C]">Data da Transferência</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 text-gray-800">{transaction.description}</td>
                      <td className="p-2 text-gray-600">
                        {transaction.due_date ? transaction.due_date : '--/--/----'}
                      </td>
                      <td className="p-2 text-gray-600">{transaction.sender_name}</td>
                      <td className={`p-2 font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-2 text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showTransferModal && (
        <TransferForm
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
          senderBalance={accountBalance}
        />
      )}
    </div>
  )
}
