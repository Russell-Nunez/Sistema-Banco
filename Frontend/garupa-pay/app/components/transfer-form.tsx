'use client'

import { useState } from 'react'
import { Button } from './button'
import Image from 'next/image'

interface TransferFormProps {
  onClose: () => void
  onTransfer: (transferData: TransferData) => void
  senderBalance: number
}

interface TransferData {
  recipientCpf: string
  amount: number
  description?: string
  dueDate?: string
}

export function TransferForm({ onClose, onTransfer, senderBalance }: TransferFormProps) {
  const [recipientCpf, setRecipientCpf] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amountValue = parseFloat(amount.replace(',', '.'))

    if (recipientCpf.trim() === '') {
      setError('O CPF do destinatário é obrigatório.')
      return
    }
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('O valor deve ser um número positivo.')
      return
    }
    if (amountValue > senderBalance) {
      setError('Saldo insuficiente para realizar a transferência.')
      return
    }
    if (dueDate && new Date(dueDate) <= new Date()) {
      setError('A data de vencimento deve ser futura.')
      return
    }

    try {
      await onTransfer({
        recipientCpf,
        amount: amountValue,
        description: description || undefined,
        dueDate: dueDate || undefined,
      })
    } catch (error) {
      console.error('Erro ao realizar a transferência:', error)
      setError('Erro ao realizar a transferência. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-xl">
        <div className="bg-[#2A0F4C] p-6 text-center">
          <Image
            src="/icono_banco.png"
            alt="GarupaPay Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Nova Transferência</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="recipientCpf" className="block text-sm font-medium text-[#2A0F4C]">
              CPF do Destinatário
            </label>
            <input
              type="text"
              id="recipientCpf"
              value={recipientCpf}
              onChange={(e) => setRecipientCpf(e.target.value)}
              className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-[#3DDAB4] focus:ring-[#3DDAB4] text-[#2A0F4C]"
              required
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-[#2A0F4C]">
              Valor
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                className="block w-full pl-12 pr-4 py-3 rounded-md border-gray-300 focus:border-[#3DDAB4] focus:ring-[#3DDAB4] text-[#2A0F4C]"
                placeholder="0,00"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-[#2A0F4C]">
              Descrição (opcional)
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-[#3DDAB4] focus:ring-[#3DDAB4] text-[#2A0F4C]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="dueDate" className="block text-sm font-medium text-[#2A0F4C]">
              Data de Vencimento (opcional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-[#3DDAB4] focus:ring-[#3DDAB4] text-[#2A0F4C]"
              min={new Date().toISOString().split('T')[0]} // Data mínima é hoje
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-6">
            <Button onClick={onClose} className="bg-gray-200 text-[#2A0F4C] hover:bg-gray-300 px-6 py-3">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3DDAB4] text-[#2A0F4C] hover:bg-[#3DDAB4]/90 px-6 py-3">
              Transferir
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
