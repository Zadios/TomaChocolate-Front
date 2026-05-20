import { GithubIcon, LinkedinIcon } from '../Icons';
import { Mail } from 'lucide-react';

/**
 * Componente: Footer
 * Renderiza el pie de página con información de contacto y enlaces a redes profesionales.
 */
export default function Footer() {
  return (
    <footer className="mt-auto w-full py-12 bg-chocolate-mid border-t-4 border-chocolate-gold">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          
          {/* Branding */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl text-white italic font-bold tracking-tight">
              Toma Chocolate
            </h3>
            <p className="text-white/70 mt-1 font-medium">
              Gestión inteligente de gastos grupales.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-5">
            <a 
              href="https://github.com/Zadios/TomaChocolate-API" 
              target="_blank" 
              rel="noreferrer" 
              className="group flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all hover:bg-white hover:scale-110 shadow-lg"
              title="Código Fuente"
            >
              <GithubIcon className="w-5 h-5 fill-white group-hover:fill-chocolate-mid transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/arielviscovich/" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all hover:bg-white hover:scale-110 shadow-lg"
              title="LinkedIn Profesional"
            >
              <LinkedinIcon className="w-5 h-5 fill-white group-hover:fill-chocolate-mid transition-colors" />
            </a>
            <a 
              href="mailto:arielviscovich@gmail.com" 
              className="group flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all hover:bg-white hover:scale-110 shadow-lg"
              title="Contactame por Email"
            >
              <Mail 
                size={20} 
                className="text-white group-hover:text-chocolate-mid transition-colors" 
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Professional Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-white/50 font-bold uppercase tracking-[0.10em]">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>© {new Date().getFullYear()} TOMA CHOCOLATE</p>
            <span className="hidden md:inline text-white/20">|</span>
            <p>Sistemas y Desarrollo</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-white/40">Desarrollado por</span>
            <span className="text-white font-bold">Ariel Viscovich</span>
          </div>
        </div>
      </div>
    </footer>
  );
}