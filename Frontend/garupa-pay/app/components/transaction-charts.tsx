'use client'

import { useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
}

interface TransactionChartsProps {
  transactions: Transaction[]
}

export function TransactionCharts({ transactions }: TransactionChartsProps) {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'doughnut'>('bar')

  if (transactions.length === 0) {
    return <p className="text-center text-gray-600">Nenhuma transação disponível para exibir os gráficos.</p>
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = {
    labels: sortedTransactions.map(t => new Date(t.date).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Valor da Transação',
        data: sortedTransactions.map(t => t.amount),
        backgroundColor: sortedTransactions.map(t => 
          t.amount > 0 ? 'rgba(61, 218, 180, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: sortedTransactions.map(t => 
          t.amount > 0 ? 'rgb(61, 218, 180)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Histórico de Transações',
        color: '#2A0F4C',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#2A0F4C',
        },
      },
      y: {
        ticks: {
          color: '#2A0F4C',
          callback: (value: number) => `R$ ${value}`,
        },
      },
    },
  }

  const doughnutData = {
    labels: ['Entradas', 'Saídas'],
    datasets: [
      {
        data: [
          transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
          Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
        ],
        backgroundColor: ['rgba(61, 218, 180, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgb(61, 218, 180)', 'rgb(239, 68, 68)'],
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribuição de Entradas e Saídas',
        color: '#2A0F4C',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
  }

  const renderChartButtons = () => (
    <div className="flex justify-center space-x-4 mb-4">
      {['bar', 'line', 'doughnut'].map((type) => (
        <button
          key={type}
          onClick={() => setActiveChart(type as 'bar' | 'line' | 'doughnut')}
          className={`px-4 py-2 rounded-full ${
            activeChart === type
              ? 'bg-[#3DDAB4] text-[#2A0F4C]'
              : 'bg-[#2A0F4C] text-[#3DDAB4]'
          }`}
        >
          {type === 'bar' ? 'Gráfico de Barras' : type === 'line' ? 'Gráfico de Linha' : 'Gráfico de Rosca'}
        </button>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      {renderChartButtons()}
      <div className="h-[400px]">
        {activeChart === 'bar' && <Bar options={options} data={chartData} />}
        {activeChart === 'line' && <Line options={options} data={chartData} />}
        {activeChart === 'doughnut' && <Doughnut options={doughnutOptions} data={doughnutData} />}
      </div>
    </div>
  )
}
