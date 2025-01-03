import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-96px)] flex items-center">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 max-w-xl">
          <h1 className="text-5xl font-bold leading-tight text-white">
            Movimentar o dinheiro{" "}
            <span className="text-[#3DDAB4]">ficou tão fácil</span>
            {" "}quanto movimentar{" "}
            <span className="text-[#3DDAB4]">você de Garupa!</span>
          </h1>
          <p className="text-white text-lg leading-relaxed">
            Com o Garupa Pay, você passa a ter um parceiro também 
            na área financeira, recebe mais rapidamente e tem a 
            possibilidade de realizar transações em tempo real.
          </p>
          <button className="bg-[#3DDAB4] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#3DDAB4]/90 transition-colors">
            Solicite a sua conta
          </button>
        </div>
        <div className="relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3DDAB4] rounded-full blur-3xl opacity-20" />
          <Image
            src="/cards.png"
            alt="Cartões GarupaPay"
            width={800}
            height={600}
            className="relative z-10"
            priority
          />
        </div>
      </div>
    </section>
  )
}

