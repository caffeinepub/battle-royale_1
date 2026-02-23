import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { X, Heart, Target } from 'lucide-react';
import { usePlayerState } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export default function GameHUD() {
  const navigate = useNavigate();
  const { data: playerState, isLoading } = usePlayerState();
  const { isTouchDevice, isMobile } = useDeviceDetection();

  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-6 flex items-start justify-between pointer-events-none z-20">
        <div className="flex flex-col gap-2 sm:gap-4 pointer-events-auto">
          {/* Health Bar */}
          <div className="bg-[oklch(0.15_0.06_260/0.9)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] rounded-lg p-2 sm:p-4 min-w-[180px] sm:min-w-[250px]">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[oklch(0.65_0.25_10)]" />
              <span className="text-xs sm:text-sm font-bold text-foreground">HEALTH</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 sm:h-6 w-full" />
            ) : (
              <div className="relative h-5 sm:h-6 bg-[oklch(0.20_0.05_260)] rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.65_0.25_10)] to-[oklch(0.70_0.22_30)] transition-all duration-300"
                  style={{ width: `${playerState ? Number(playerState.health) : 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-foreground">
                  {playerState ? Number(playerState.health) : 100} / 100
                </div>
              </div>
            )}
          </div>

          {/* Score */}
          <div className="bg-[oklch(0.15_0.06_260/0.9)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] rounded-lg p-2 sm:p-4 min-w-[180px] sm:min-w-[250px]">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[oklch(0.75_0.20_260)]" />
              <span className="text-xs sm:text-sm font-bold text-foreground">SCORE</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-[oklch(0.75_0.20_260)]">
                {playerState ? Number(playerState.score) : 0}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/' })}
          className="pointer-events-auto bg-[oklch(0.15_0.06_260/0.9)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] hover:bg-[oklch(0.20_0.06_260/0.9)] w-10 h-10 sm:w-11 sm:h-11"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {/* Weapon Display - Hidden on mobile to avoid overlap with touch controls */}
      {!isMobile && (
        <div className="absolute bottom-8 right-8 pointer-events-none z-20">
          <div className="bg-[oklch(0.15_0.06_260/0.9)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] rounded-lg p-3 sm:p-4">
            <img 
              src="/assets/generated/weapon-icon.dim_128x128.png" 
              alt="Weapon" 
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
            <div className="text-center mt-2 text-[10px] sm:text-xs font-bold text-[oklch(0.75_0.20_260)]">
              ASSAULT RIFLE
            </div>
          </div>
        </div>
      )}

      {/* Controls Info - Positioned to avoid joystick on mobile */}
      <div className={`absolute pointer-events-none z-20 ${isMobile ? 'top-1/2 left-3 -translate-y-1/2' : 'bottom-8 left-8'}`}>
        <div className="bg-[oklch(0.15_0.06_260/0.9)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] rounded-lg p-2 sm:p-4 text-[10px] sm:text-xs space-y-1">
          <div className="font-bold text-[oklch(0.75_0.20_260)] mb-1 sm:mb-2">CONTROLS</div>
          {isTouchDevice ? (
            <>
              <div><span className="text-muted-foreground">Joystick:</span> Move</div>
              <div><span className="text-muted-foreground">Drag:</span> Look</div>
              <div><span className="text-muted-foreground">Fire:</span> Shoot</div>
            </>
          ) : (
            <>
              <div><span className="text-muted-foreground">WASD:</span> Move</div>
              <div><span className="text-muted-foreground">Mouse:</span> Look</div>
              <div><span className="text-muted-foreground">Click:</span> Shoot</div>
              <div className="text-[oklch(0.60_0.15_260)] mt-2 text-[10px]">Click to lock cursor</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
