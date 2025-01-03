import Image from 'next/image'
import Link from 'next/link'

export function NavHeader() {
  return (
    <header className="w-full py-4 bg-[#2A0F4C] shadow-lg">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="GarupaPay"
            width={180}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
        
        <ul className="flex items-center gap-6">
          <li>
            <Link 
              href="/" 
              className="text-[#3DDAB4] hover:text-[#3DDAB4]/80 transition-colors text-sm font-semibold"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link 
              href="/transactions" 
              className="text-[#3DDAB4] hover:text-[#3DDAB4]/80 transition-colors text-sm font-semibold"
            >
              AREA DE TRANSACÇÕES
            </Link>
          </li>
          <li>
            <Link 
              href="/login" 
              className="bg-[#3DDAB4] text-[#2A0F4C] hover:bg-[#3DDAB4]/90 transition-colors px-4 py-2 rounded-full text-sm font-semibold"
            >
              LOGIN
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

