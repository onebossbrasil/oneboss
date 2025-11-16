import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, User, ArrowLeft, Phone, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function MobileLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [estado, setEstado] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'initial' | 'login' | 'register'>('initial');
  const [isLoading, setIsLoading] = useState(false);

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleLogin = async () => {
    if (mode === 'initial') {
      setMode('login');
      return;
    }

    // Validações
    if (!email || !password) {
      toast.error('Por favor, preencha e-mail e senha');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await signIn(email, password);

      if (error) {
        console.error('Erro ao fazer login:', error);
        toast.error(error.message || 'E-mail ou senha incorretos');
        return;
      }

      toast.success('Login realizado com sucesso!');
      navigate(returnUrl);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (mode === 'initial') {
      // Passa o returnUrl para a página de registro também
      navigate(`/register?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Validações
    if (!name || !email || !whatsapp || !estado || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await signUp(email, password, {
        full_name: name,
        whatsapp,
        estado,
      });

      if (error) {
        console.error('Erro ao criar conta:', error);
        toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
        return;
      }

      toast.success('Conta criada com sucesso! Verifique seu e-mail.');
      navigate(returnUrl);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMode('initial');
    setEmail('');
    setPassword('');
    setName('');
    setWhatsapp('');
    setEstado('');
  };

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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-8 sm:px-8">

        {/* Logo OneBoss no topo */}
        <div className="flex w-full justify-center pt-12">
          <img
            src="/splash-screen.png"
            alt="OneBoss"
            className="h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(201,162,39,0.6)]"
          />
        </div>

        {/* Card de Login/Register - Glassmorphism Ultra Moderno */}
        <div className="w-full max-w-md">

          {/* Título Bem-vindo */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-[#C9A227] via-[#E6C15A] to-[#C9A227] bg-clip-text text-4xl font-bold text-transparent drop-shadow-lg">
              {mode === 'register' ? 'Criar Conta' : 'Bem-vindo'}
            </h1>
            <p className="text-sm font-light text-white/70">
              {mode === 'register'
                ? 'Preencha os dados para criar sua conta premium'
                : 'Entre para acessar sua conta premium'
              }
            </p>
          </div>

          {/* Card Glassmorphism */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl">

            {/* Botão Voltar (aparece quando está em login ou register) */}
            {mode !== 'initial' && (
              <button
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#C9A227]"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            )}

            {/* Form Fields - LOGIN */}
            {mode === 'login' && (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

                {/* Email Input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A227]/60 transition-all duration-300 group-focus-within:text-[#E6C15A]">
                    <Mail className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-white/40 transition-all duration-300 focus:border-[#C9A227]/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#C9A227]/30"
                  />
                </div>

                {/* Password Input */}
                <div className="group relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A227]/60 transition-all duration-300 group-focus-within:text-[#E6C15A]">
                    <Lock className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder-white/40 transition-all duration-300 focus:border-[#C9A227]/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#C9A227]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A227]/60 transition-colors hover:text-[#E6C15A]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                {/* Esqueceu a senha - minimalista */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="text-xs font-light text-white/50 transition-colors hover:text-[#C9A227]"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

              </form>
            )}

            {/* Botões de Ação */}
            <div className="space-y-3">

              {/* Botão ACESSAR (apenas no modo initial ou login) */}
              {mode !== 'register' && (
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E6C15A] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(201,162,39,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                        <span className="text-base font-bold tracking-wide">ENTRANDO...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base font-bold tracking-wide">ACESSAR</span>
                        <LogIn className="h-4 w-4" strokeWidth={2.5} />
                      </>
                    )}
                  </div>
                </button>
              )}

              {/* Botão CRIAR CONTA (apenas no modo initial) */}
              {mode === 'initial' && (
                <button
                  onClick={handleRegister}
                  className="group w-full rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-[#C9A227]/40 hover:bg-white/10 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                    <span className="text-sm font-semibold">Criar Conta</span>
                  </div>
                </button>
              )}

            </div>

            {/* Divider minimalista (apenas no modo initial) */}
            {mode === 'initial' && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/20" />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-white/30">OU</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/20" />
                </div>

                {/* Continuar como visitante */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 text-center text-sm font-light text-white/50 transition-colors hover:text-white/80"
                >
                  Continuar como visitante
                </button>
              </>
            )}

          </div>

        </div>

        {/* Footer minimalista */}
        <div className="pb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
          </div>
          <p className="text-[10px] font-light tracking-wider text-white/25">
            © 2024 ONEBOSS
          </p>
        </div>

      </div>
    </div>
  );
}
