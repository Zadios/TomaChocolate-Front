import TomaChocolateLogo from '../../assets/TomaChocolateCircle.svg';

/**
 * Componente: Header
 * Renderiza la barra de navegación superior de la aplicación.
 */
export default function Header() {
  return (
    <header className="bg-chocolate-mid text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        
        {/* Logo Container */}
        <div 
          onClick={() => window.location.href = '/'} 
          className="relative cursor-pointer group flex-shrink-0"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={TomaChocolateLogo} 
              alt="Toma Chocolate Logo" 
              className="w-full h-full object-contain object-center scale-110 transition-all duration-300 drop-shadow-md"
            />
          </div>
        </div>

        {/* Application Title */}
        <h1 
          onClick={() => window.location.href = '/'} 
          className="font-serif cursor-pointer text-2xl italic font-bold tracking-tight hover:text-chocolate-gold hover:underline duration-150 transition-colors"
        >
          Toma Chocolate
        </h1>
      </div>
      <div className="h-1 bg-chocolate-gold"></div>
    </header>
  );
}