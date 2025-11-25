import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Share2, ArrowLeft, Cake, Wand2, MapPin, CalendarPlus, Link as LinkIcon, Home } from 'lucide-react';
import { ThemeStyle, InvitationData } from './types';
import { generateInvitationMessage } from './services/geminiService';
import { Button, Input, Select, TextArea } from './components/UIComponents';
import { InvitationCard } from './components/InvitationCard';

// Initial State
const initialData: InvitationData = {
  name: '',
  age: '',
  date: '',
  time: '',
  location: '',
  theme: ThemeStyle.FUN,
  customMessage: ''
};

// --- Helpers ---
const generateGoogleCalendarLink = (data: InvitationData) => {
  if (!data.date || !data.time) return '#';
  
  try {
    // Combine date and time to create start date
    const startDateTime = new Date(`${data.date}T${data.time}`);
    // Assume 4 hour duration for the party
    const endDateTime = new Date(startDateTime.getTime() + (4 * 60 * 60 * 1000));
    
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Aniversário de ${data.name} 🎂`,
      details: `${data.customMessage}\n\nConvite gerado por FestaGenius`,
      location: data.location,
      dates: `${formatDate(startDateTime)}/${formatDate(endDateTime)}`
    });
    
    return `https://www.google.com/calendar/render?${params.toString()}`;
  } catch (e) {
    console.error("Error generating calendar link", e);
    return '#';
  }
};

const generateGoogleMapsLink = (location: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

// --- Page: Home ---
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-purple-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-6 bg-white rounded-full shadow-xl animate-bounce-slow">
        <Cake className="w-16 h-16 text-brand-500" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-serif">
        FestaGenius
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
        Crie convites de aniversário digitais e compartilhe o link com seus amigos. Powered by IA.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/create')} 
          className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all bg-gradient-to-r from-brand-600 to-purple-600 border-none"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Criar Convite Grátis
        </Button>
      </div>
    </div>
  );
};

// --- Page: Create ---
const CreatePage: React.FC<{ 
  data: InvitationData; 
  setData: React.Dispatch<React.SetStateAction<InvitationData>> 
}> = ({ data, setData }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateMessage = async () => {
    if (!data.name || !data.age) {
      alert("Por favor, preencha o nome e a idade primeiro.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const message = await generateInvitationMessage({
        name: data.name,
        age: data.age,
        theme: data.theme,
        tone: 'excited'
      });
      setData(prev => ({ ...prev, customMessage: message }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 overflow-y-auto h-auto md:h-screen z-10">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </button>
          
          <h2 className="text-3xl font-bold mb-2 text-gray-900 font-serif">Detalhes da Festa</h2>
          <p className="text-gray-500 mb-8">Preencha as informações para gerar seu convite.</p>
          
          <div className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Nome" 
                name="name" 
                value={data.name} 
                onChange={handleInputChange} 
                placeholder="Ex: Maria"
              />
              <Input 
                label="Idade" 
                name="age" 
                type="number"
                value={data.age} 
                onChange={handleInputChange} 
                placeholder="Ex: 5"
              />
            </div>

            <Select 
              label="Tema Visual"
              name="theme"
              value={data.theme}
              onChange={handleInputChange}
              options={[
                { value: ThemeStyle.FUN, label: '🎉 Divertido & Colorido' },
                { value: ThemeStyle.ELEGANT, label: '✨ Elegante & Gold' },
                { value: ThemeStyle.MINIMAL, label: '⚪ Minimalista' },
                { value: ThemeStyle.SPACE, label: '🚀 Espacial' },
                { value: ThemeStyle.NATURE, label: '🌿 Natureza' },
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Data" 
                name="date" 
                type="date"
                value={data.date} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Hora" 
                name="time" 
                type="time"
                value={data.time} 
                onChange={handleInputChange} 
              />
            </div>

            <Input 
              label="Endereço Completo" 
              name="location" 
              value={data.location} 
              onChange={handleInputChange} 
              placeholder="Ex: Rua das Flores, 123"
            />

            <div className="relative">
              <TextArea 
                label="Mensagem do Convite"
                name="customMessage"
                value={data.customMessage}
                onChange={handleInputChange}
                rows={4}
                placeholder="Digite uma mensagem ou gere com IA..."
              />
              <button
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                className="absolute right-2 bottom-3 text-xs flex items-center bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors disabled:opacity-50 font-medium border border-brand-200"
              >
                {isGenerating ? <Wand2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                {isGenerating ? 'Criando...' : 'Gerar Texto IA'}
              </button>
            </div>

            <Button 
              className="w-full mt-2 py-3 text-lg" 
              onClick={() => navigate('/preview')}
              disabled={!data.name || !data.date || !data.location}
            >
              Visualizar Convite
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview Section (Desktop) */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-8 sticky top-0 h-screen overflow-hidden border-l border-gray-200">
         <div className="transform scale-[0.85] lg:scale-100 transition-all duration-500 ease-out">
            <InvitationCard data={data} />
         </div>
         <div className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Pré-visualização em tempo real
         </div>
      </div>
    </div>
  );
};

// --- Page: Preview & Share (Owner View) ---
const PreviewPage: React.FC<{ data: InvitationData }> = ({ data }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data.name) {
      navigate('/create');
    }
  }, [data, navigate]);

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if(data.name) params.append('name', data.name);
    if(data.age) params.append('age', data.age);
    if(data.date) params.append('date', data.date);
    if(data.time) params.append('time', data.time);
    if(data.location) params.append('location', data.location);
    if(data.theme) params.append('theme', data.theme);
    if(data.customMessage) params.append('customMessage', data.customMessage);
    
    // HashRouter format: base/#/view?params
    return `${window.location.origin}${window.location.pathname}#/view?${params.toString()}`;
  };

  const shareUrl = generateShareUrl();

  const handleShare = async () => {
    const shareData = {
      title: `Convite de Aniversário de ${data.name}`,
      text: `🎈 Você foi convidado para o aniversário de ${data.name}!`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* The Card */}
        <div className="w-full md:w-auto flex justify-center order-2 md:order-1">
          <div className="transform scale-90 md:scale-100 origin-top md:origin-center">
            <InvitationCard data={data} />
          </div>
        </div>

        {/* Actions */}
        <div className="w-full md:w-96 text-white space-y-6 order-1 md:order-2">
          <div>
            <h2 className="text-3xl font-bold mb-2">Convite Pronto! 🎉</h2>
            <p className="text-gray-400">
              Seu convite foi gerado com sucesso. Compartilhe o link abaixo com seus convidados.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3">
             <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Link do Convite</label>
             <div className="flex gap-2">
                <input 
                  readOnly 
                  value={shareUrl} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-brand-500"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
                  title="Copiar Link"
                >
                  <LinkIcon size={18} />
                </button>
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleShare} variant="primary" className="w-full py-3 text-lg bg-brand-600 hover:bg-brand-500">
              <Share2 className="w-5 h-5 mr-2" />
              {copied ? 'Link Copiado!' : 'Compartilhar Link'}
            </Button>
            
            <Button onClick={() => navigate('/create')} variant="outline" className="w-full py-3 bg-transparent text-gray-300 border-gray-600 hover:bg-white/5 hover:text-white hover:border-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Editar Informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page: View (Guest View) ---
const ViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query params to reconstruct the invitation data
  const data: InvitationData = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return {
      name: query.get('name') || '',
      age: query.get('age') || '',
      date: query.get('date') || '',
      time: query.get('time') || '',
      location: query.get('location') || '',
      theme: (query.get('theme') as ThemeStyle) || ThemeStyle.FUN,
      customMessage: query.get('customMessage') || ''
    };
  }, [location.search]);

  if (!data.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <p className="text-gray-500 mb-4">Link de convite inválido ou incompleto.</p>
        <Button onClick={() => navigate('/')}>Criar meu próprio convite</Button>
      </div>
    );
  }

  const calendarLink = generateGoogleCalendarLink(data);
  const mapsLink = generateGoogleMapsLink(data.location);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* The Card */}
        <InvitationCard data={data} />

        {/* Guest Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-brand-200 transition-all group text-decoration-none"
            >
              <MapPin className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">Ver Mapa</span>
            </a>

            <a 
              href={calendarLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-brand-200 transition-all group text-decoration-none ${!data.date ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <CalendarPlus className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">Add Agenda</span>
            </a>
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-gray-500 mb-4">Gostou do convite?</p>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Crie o seu com IA Grátis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [data, setData] = useState<InvitationData>(initialData);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/create" 
          element={<CreatePage data={data} setData={setData} />} 
        />
        <Route 
          path="/preview" 
          element={<PreviewPage data={data} />} 
        />
        <Route 
          path="/view" 
          element={<ViewPage />} 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;