import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Crosshair, Zap, Trophy } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const navigate = useNavigate();
  const { login, identity, loginStatus } = useInternetIdentity();

  const handleStartGame = () => {
    if (!identity) {
      login();
    } else {
      navigate({ to: '/game' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.15_0.08_260)] via-[oklch(0.12_0.06_280)] to-[oklch(0.10_0.05_240)] text-foreground">
      {/* Header */}
      <header className="border-b border-[oklch(0.3_0.1_260/0.3)] backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-[oklch(0.75_0.20_260)]" />
            <h1 className="text-2xl font-black tracking-tight">BATTLE ROYALE</h1>
          </div>
          {identity && (
            <div className="text-sm text-muted-foreground">
              Connected: {identity.getPrincipal().toString().slice(0, 8)}...
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Banner */}
          <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/assets/generated/hero-banner.dim_1200x400.png" 
              alt="Battle Royale" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.05_240)] via-transparent to-transparent" />
          </div>

          {/* Title & Description */}
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-[oklch(0.75_0.20_260)] via-[oklch(0.70_0.18_280)] to-[oklch(0.75_0.20_260)] bg-clip-text text-transparent">
              DROP IN. FIGHT. SURVIVE.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Enter the arena in this intense 3D shooter experience. Master movement, aim with precision, and outlast your opponents.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartGame}
              disabled={loginStatus === 'logging-in'}
              className="text-lg px-12 py-6 h-auto font-bold bg-gradient-to-r from-[oklch(0.65_0.25_260)] to-[oklch(0.60_0.22_280)] hover:from-[oklch(0.70_0.27_260)] hover:to-[oklch(0.65_0.24_280)] shadow-[0_8px_30px_oklch(0.65_0.25_260/0.3)] transition-all"
            >
              {loginStatus === 'logging-in' ? 'CONNECTING...' : identity ? 'ENTER BATTLE' : 'LOGIN & PLAY'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[oklch(0.18_0.06_260/0.5)] backdrop-blur-sm border border-[oklch(0.3_0.1_260/0.3)] rounded-xl p-8 text-center">
              <Crosshair className="w-12 h-12 mx-auto mb-4 text-[oklch(0.75_0.20_260)]" />
              <h3 className="text-xl font-bold mb-2">First-Person Action</h3>
              <p className="text-muted-foreground">Immersive 3D gameplay with smooth WASD movement and mouse aim controls</p>
            </div>
            <div className="bg-[oklch(0.18_0.06_260/0.5)] backdrop-blur-sm border border-[oklch(0.3_0.1_260/0.3)] rounded-xl p-8 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-[oklch(0.75_0.20_260)]" />
              <h3 className="text-xl font-bold mb-2">Dynamic Combat</h3>
              <p className="text-muted-foreground">Fast-paced shooting mechanics with visual feedback and weapon systems</p>
            </div>
            <div className="bg-[oklch(0.18_0.06_260/0.5)] backdrop-blur-sm border border-[oklch(0.3_0.1_260/0.3)] rounded-xl p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-[oklch(0.75_0.20_260)]" />
              <h3 className="text-xl font-bold mb-2">Competitive Play</h3>
              <p className="text-muted-foreground">Track your score and compete in the battle royale arena</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.3_0.1_260/0.3)] backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Battle Royale. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.75_0.20_260)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
