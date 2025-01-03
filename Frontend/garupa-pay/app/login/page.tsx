'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavHeader } from '../components/nav-header'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('userToken')
    if (token) {
      setIsLoggedIn(true)
      toast.success('Você já está logado!')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = `http://localhost:3001/api/users/${isLogin ? 'login' : 'register'}`
    const payload = isLogin
      ? { email, password }
      : { name: name, email, password, cpf }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        if (isLogin) {
      
          toast.success('Login realizado com sucesso!')
          localStorage.setItem('userToken', data.token) 
          localStorage.setItem('userId', data.user.id)
          localStorage.setItem('userCpf', data.user.cpf)
          setIsLoggedIn(true)
          router.push('/transactions')
        } else {

          toast.success('Conta criada com sucesso! Fazendo login...')

          const loginResponse = await fetch('http://localhost:3001/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const loginData = await loginResponse.json()
          if (loginResponse.ok) {
            localStorage.setItem('userToken', loginData.token)
            localStorage.setItem('userId', loginData.user.id) 
            localStorage.setItem('userCpf', loginData.user.cpf) 
            setIsLoggedIn(true)
            router.push('/transactions')
          } else {
            toast.error('Erro ao fazer login automático. Por favor, faça login manualmente.')
          }
        }
      } else {
        toast.error(data.error || 'Algo deu errado. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      toast.error('Erro na conexão com o servidor.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userId') 
    localStorage.removeItem('userCpf') 
    setIsLoggedIn(false)
    toast.success('Logout realizado com sucesso!')
  }

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#1E0B38]">
        <NavHeader />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex items-center justify-center px-4 py-12">
          <div className="bg-[#2A0F4C] rounded-3xl shadow-xl overflow-hidden p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Você já está logado!</h2>
            <div className="space-y-4">
              <Link href="/transactions" className="block text-[#3DDAB4] hover:text-[#3DDAB4]/80 font-semibold">
                Ir para a área de transações
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-[#3DDAB4] text-[#2A0F4C] px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#3DDAB4]/90 transition-colors"
              >
                Fazer Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#1E0B38]">
      <NavHeader />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#2A0F4C] rounded-3xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Image
                    src="/icono_banco.png"
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                </h2>
                <p className="text-[#3DDAB4] text-sm">
                  {isLogin
                    ? 'Entre com suas credenciais para acessar sua conta'
                    : 'Preencha os dados abaixo para criar sua conta'}
                </p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-white">
                        Nome completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3DDAB4] focus:border-transparent transition-colors"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cpf" className="block text-sm font-medium text-white">
                        CPF
                      </label>
                      <input
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3DDAB4] focus:border-transparent transition-colors"
                        placeholder="123.456.789-00"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3DDAB4] focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3DDAB4] focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3DDAB4] text-[#2A0F4C] px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#3DDAB4]/90 transition-colors"
                >
                  {isLogin ? 'Entrar' : 'Criar conta'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/80">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#3DDAB4] hover:text-[#3DDAB4]/80 font-semibold"
                >
                  {isLogin ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
