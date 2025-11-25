import React from 'react';
import { ThemeStyle, InvitationData } from '../types';
import { MapPin, Calendar, Clock, PartyPopper } from 'lucide-react';

interface InvitationCardProps {
  data: InvitationData;
  scale?: number;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ data, scale = 1 }) => {
  const getThemeStyles = (theme: ThemeStyle) => {
    switch (theme) {
      case ThemeStyle.FUN:
        return {
          container: "bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 border-4 border-yellow-300",
          title: "font-script text-pink-600 drop-shadow-sm",
          text: "text-gray-800 font-sans",
          accent: "text-orange-500",
          iconBg: "bg-white/80 text-orange-500",
          decor: (
            <>
              <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </>
          )
        };
      case ThemeStyle.ELEGANT:
        return {
          container: "bg-slate-900 border border-amber-400/30",
          title: "font-serif text-amber-100 tracking-wide",
          text: "text-slate-300 font-serif",
          accent: "text-amber-400",
          iconBg: "bg-slate-800 border border-amber-500/30 text-amber-400",
          decor: (
            <div className="absolute inset-0 border-[12px] border-double border-slate-800 pointer-events-none"></div>
          )
        };
      case ThemeStyle.SPACE:
        return {
          container: "bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white",
          title: "font-sans font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300",
          text: "text-indigo-100 font-sans",
          accent: "text-cyan-400",
          iconBg: "bg-white/10 backdrop-blur-sm text-cyan-300",
          decor: (
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-ping"></div>
               <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full blur-[2px]"></div>
               <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl"></div>
            </div>
          )
        };
      case ThemeStyle.NATURE:
        return {
          container: "bg-[#f3f4f1] border-8 border-[#e6e9e1]",
          title: "font-serif text-[#4a5d4e]",
          text: "text-[#5c6b5f] font-sans",
          accent: "text-[#8a9a8b]",
          iconBg: "bg-[#e6e9e1] text-[#4a5d4e]",
          decor: (
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <PartyPopper size={64} className="text-green-800" />
             </div>
          )
        };
      default: // MINIMAL
        return {
          container: "bg-white border border-gray-200 shadow-xl",
          title: "font-sans font-black text-gray-900 tracking-tighter",
          text: "text-gray-600 font-sans",
          accent: "text-black",
          iconBg: "bg-gray-100 text-black",
          decor: null
        };
    }
  };

  const styles = getThemeStyles(data.theme);

  return (
    <div 
      className="relative w-full max-w-sm mx-auto transition-transform duration-300 origin-top shadow-2xl rounded-xl overflow-hidden"
      style={{ transform: `scale(${scale})` }}
    >
      <div className={`relative p-8 h-[600px] flex flex-col justify-between ${styles.container}`}>
        {styles.decor}
        
        {/* Header */}
        <div className="relative z-10 text-center space-y-2 mt-4">
          <span className={`text-sm uppercase tracking-widest opacity-80 ${styles.text}`}>
            Você está convidado
          </span>
          <h1 className={`text-5xl mb-2 ${styles.title}`}>
            {data.name || "Nome"}
          </h1>
          <div className={`flex items-center justify-center gap-2 text-xl font-bold ${styles.accent}`}>
            <span className="w-8 h-[1px] bg-current opacity-50"></span>
            <span>{data.age ? `${data.age} Anos` : "Idade"}</span>
            <span className="w-8 h-[1px] bg-current opacity-50"></span>
          </div>
        </div>

        {/* Message */}
        <div className="relative z-10 my-6 text-center">
          <p className={`text-lg leading-relaxed italic px-4 ${styles.text}`}>
            "{data.customMessage || "Venha celebrar este momento especial conosco!"}"
          </p>
        </div>

        {/* Details */}
        <div className="relative z-10 space-y-4 bg-black/5 p-4 rounded-xl backdrop-blur-[2px]">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
              <Calendar size={20} />
            </div>
            <div className={`text-left ${styles.text}`}>
              <p className="text-xs uppercase opacity-70 font-bold">Data</p>
              <p className="font-semibold">{data.date || "DD/MM/AAAA"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
              <Clock size={20} />
            </div>
            <div className={`text-left ${styles.text}`}>
              <p className="text-xs uppercase opacity-70 font-bold">Hora</p>
              <p className="font-semibold">{data.time || "00:00"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
              <MapPin size={20} />
            </div>
            <div className={`text-left ${styles.text}`}>
              <p className="text-xs uppercase opacity-70 font-bold">Local</p>
              <p className="font-semibold break-words w-48 leading-tight">{data.location || "Endereço da Festa"}</p>
            </div>
          </div>
        </div>
        
        <div className={`relative z-10 text-center mt-4 ${styles.text}`}>
          <p className="text-xs opacity-60">Criado com FestaGenius</p>
        </div>
      </div>
    </div>
  );
};