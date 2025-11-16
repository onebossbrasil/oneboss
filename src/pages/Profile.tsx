import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Bell,
  Settings,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  // Proteção de rota - redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?returnUrl=/perfil');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="text-[#C9A227] text-lg">Carregando...</div>
      </div>
    );
  }

  // Se não estiver autenticado, não mostra nada (vai redirecionar)
  if (!user) {
    return null;
  }

  const menuItems = [
    {
      id: 'orders',
      label: 'Meus Pedidos',
      icon: Package,
      path: '/perfil/pedidos',
    },
    {
      id: 'data',
      label: 'Dados Cadastrais',
      icon: User,
      path: '/perfil/dados',
    },
    {
      id: 'addresses',
      label: 'Endereços',
      icon: MapPin,
      path: '/perfil/enderecos',
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      path: '/perfil/notificacoes',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/perfil/configuracoes',
    },
  ];

  const bottomMenuItems = [
    {
      id: 'privacy',
      label: 'Política de Privacidade',
      icon: FileText,
      path: '/privacidade',
    },
    {
      id: 'delete',
      label: 'Cancelar Conta',
      icon: Trash2,
      path: '/cancelar',
      isDestructive: true,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Lamborghini Preta - com overlay escuro */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074&auto=format&fit=crop')`,
        }}
      />

      {/* Overlay escuro para destacar o conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />

      {/* Particles/Glow effect dourado */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A227]/10 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen px-6 py-8 sm:px-8">

        {/* Logo OneBoss no topo */}
        <div className="flex w-full justify-center pt-12 mb-8">
          <img
            src="/splash-screen.png"
            alt="OneBoss"
            className="h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(201,162,39,0.6)]"
          />
        </div>

        {/* Container Principal */}
        <div className="mx-auto w-full max-w-2xl">

          {/* Card de Perfil - Header com Informações do Usuário */}
          <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl">

            {/* Avatar e Nome */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A227]/20 to-[#E6C15A]/20 border-2 border-[#C9A227]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.3)]">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#C9A227]" strokeWidth={1.5} />
                  )}
                </div>
                {/* Badge de verificado */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <h1 className="mb-2 bg-gradient-to-r from-[#C9A227] via-[#E6C15A] to-[#C9A227] bg-clip-text text-3xl font-bold text-transparent drop-shadow-lg">
                {user.user_metadata?.full_name || 'Usuário OneBoss'}
              </h1>

              {/* Informações de contato */}
              <div className="flex flex-col items-center gap-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#C9A227]/60" strokeWidth={1.5} />
                  <span>{user.email}</span>
                </div>
                {user.user_metadata?.whatsapp && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#C9A227]/60" strokeWidth={1.5} />
                    <span>{user.user_metadata.whatsapp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Principal */}
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className="group w-full flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-[#C9A227]/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227]/10 transition-all duration-300 group-hover:bg-[#C9A227]/20">
                        <Icon className="h-5 w-5 text-[#C9A227]" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-white/90 transition-colors group-hover:text-[#C9A227]">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-[#C9A227]" strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Secundário */}
          <div className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <div className="space-y-2">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`group w-full flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 ${
                      item.isDestructive
                        ? 'hover:border-red-500/30 hover:bg-red-500/5'
                        : 'hover:border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                        item.isDestructive
                          ? 'bg-red-500/10 group-hover:bg-red-500/20'
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          item.isDestructive ? 'text-red-500' : 'text-white/70'
                        }`} strokeWidth={1.5} />
                      </div>
                      <span className={`font-medium ${
                        item.isDestructive
                          ? 'text-red-500'
                          : 'text-white/70 group-hover:text-white/90'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-all group-hover:translate-x-1 ${
                      item.isDestructive ? 'text-red-500/60' : 'text-white/40'
                    }`} strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão de Sair */}
          <button
            onClick={handleSignOut}
            className="group w-full flex items-center justify-center gap-3 rounded-xl border-2 border-red-500/30 bg-red-500/5 px-6 py-4 font-semibold text-red-500 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-bold tracking-wide">SAIR DA CONTA</span>
          </button>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-white/50">OneBoss Brasil</p>
            <p className="text-xs text-white/25 mt-1">Versão 1.0.0</p>
          </div>

        </div>
      </div>
    </div>
  );
}
