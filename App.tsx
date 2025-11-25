import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Share2, ArrowLeft, Cake, Wand2 } from 'lucide-react';
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

// --- Page: Home ---
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-purple-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-white rounded-full shadow-xl">
        <Cake className="w-16 h-16 text-brand-500" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
        FestaGenius
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Crie convites de aniversário incríveis em segundos com a ajuda de Inteligência Artificial.
      </p>
      <Button 
        onClick={() => navigate('/create')} 
        className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Criar Convite Agora
      </Button>
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
        tone: 'excited' // Default tone
      });
      setData(prev => ({ ...prev, customMessage: message }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </button>
          
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Detalhes da Festa</h2>
          
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Nome do Aniversariante" 
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
              label="Local da Festa" 
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
                placeholder="Digite uma mensagem ou gere uma com IA..."
              />
              <button
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                className="absolute right-2 bottom-3 text-xs flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Wand2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                {isGenerating ? 'Criando...' : 'Gerar com IA'}
              </button>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/preview')}
              disabled={!data.name || !data.date || !data.location}
            >
              Visualizar Convite
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview Section (Desktop) */}
      <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center p-8 sticky top-0 h-screen overflow-hidden">
         <div className="transform scale-90 lg:scale-100 transition-all">
            <InvitationCard data={data} />
         </div>
         <div className="absolute bottom-4 text-gray-500 text-sm">
            Pré-visualização em tempo real
         </div>
      </div>
    </div>
  );
};

// --- Page: Preview & Share ---
const PreviewPage: React.FC<{ data: InvitationData }> = ({ data }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect if no data
    if (!data.name) {
      navigate('/create');
    }
  }, [data, navigate]);

  const handleShare = () => {
    // Determine the base URL dynamically
    const baseUrl = window.location.href.split('#')[0];
    const textToShare = `🎈 Você foi convidado para o aniversário de ${data.name}! \n\n📅 Data: ${data.date} às ${data.time}\n📍 Local: ${data.location}\n\n"${data.customMessage}"`;
    
    if (navigator.share) {
      navigator.share({
        title: `Aniversário de ${data.name}`,
        text: textToShare,
        url: baseUrl // In a real app with backend, this would be a unique link
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        
        {/* The Card */}
        <div className="w-full md:w-1/2 flex justify-center">
          <InvitationCard data={data} />
        </div>

        {/* Actions */}
        <div className="w-full md:w-1/2 text-white space-y-6 text-center md:text-left">
          <h2 className="text-3xl font-bold">Seu convite está pronto!</h2>
          <p className="text-gray-300">
            Agora é só compartilhar com seus amigos e familiares. O design foi ajustado para ficar perfeito em celulares.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button onClick={handleShare} variant="primary" className="px-8 py-3 text-lg">
              <Share2 className="w-5 h-5 mr-2" />
              {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
            
            <Button onClick={() => navigate('/create')} variant="outline" className="px-8 py-3 text-lg bg-transparent text-white border-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Editar
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-400">
            <p className="font-semibold mb-1 text-gray-300">Dica:</p>
            Tire um print (screenshot) da tela se quiser enviar como imagem no WhatsApp!
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
      </Routes>
    </HashRouter>
  );
};

export default App;