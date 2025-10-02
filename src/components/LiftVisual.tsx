import { Lift } from '@/types/lift';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, AlertTriangle, Minus } from 'lucide-react';

interface LiftVisualProps {
  lift: Lift;
  numFloors: number;
  onInternalRequest: (floor: number) => void;
  onToggleFault: () => void;
}

const LiftVisual = ({ lift, numFloors, onInternalRequest, onToggleFault }: LiftVisualProps) => {
  const getStatusColor = () => {
    switch (lift.status) {
      case 'moving-up':
        return 'bg-primary shadow-glow';
      case 'moving-down':
        return 'bg-primary shadow-glow';
      case 'fault':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (lift.status) {
      case 'moving-up':
        return <ArrowUp className="w-4 h-4 animate-bounce" />;
      case 'moving-down':
        return <ArrowDown className="w-4 h-4 animate-bounce" />;
      case 'fault':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-gradient-card rounded-xl p-4 shadow-card border border-border hover:border-primary/50 transition-all duration-300 animate-slide-up">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${lift.status === 'fault' ? 'bg-destructive animate-pulse' : 'bg-primary animate-pulse-glow'}`} />
          <h3 className="text-lg font-semibold text-foreground">Lift {lift.id}</h3>
        </div>
        <Button
          size="sm"
          variant={lift.status === 'fault' ? 'destructive' : 'outline'}
          onClick={onToggleFault}
          className="text-xs transition-all hover:scale-105"
        >
          {lift.status === 'fault' ? '🔧 Repair' : '⚠️ Fault'}
        </Button>
      </div>

      {/* Lift shaft visualization */}
      <div className="relative w-24 bg-muted/50 backdrop-blur rounded-lg overflow-hidden border border-border/50 shadow-inner" style={{ height: `${numFloors * 40}px` }}>
        {/* Floor markers with grid lines */}
        {Array.from({ length: numFloors }, (_, i) => numFloors - 1 - i).map((floor) => (
          <div
            key={floor}
            className="absolute w-full h-10 border-b border-border/30 flex items-center justify-center text-xs text-muted-foreground font-mono"
            style={{ top: `${(numFloors - 1 - floor) * 40}px` }}
          >
            <span className="bg-background/80 px-2 rounded">{floor}</span>
          </div>
        ))}

        {/* Movement trail effect */}
        {lift.status !== 'idle' && lift.status !== 'fault' && (
          <div
            className="absolute w-full h-20 bg-primary/10 blur-sm transition-all duration-500"
            style={{ bottom: `${lift.currentFloor * 40}px` }}
          />
        )}

        {/* Lift car */}
        <div
          className={`absolute w-full h-10 ${getStatusColor()} rounded transition-all duration-500 ease-linear flex items-center justify-center text-foreground font-bold border-2 border-primary/70 shadow-lg backdrop-blur`}
          style={{ bottom: `${lift.currentFloor * 40}px` }}
        >
          {getStatusIcon()}
        </div>
      </div>

      {/* Status display */}
      <div className="w-full space-y-2 text-sm bg-muted/30 rounded-lg p-3 border border-border/30">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Floor:</span>
          <span className="text-primary font-mono font-bold text-lg">{lift.currentFloor}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status:</span>
          <span className="text-foreground capitalize font-medium">{lift.status.replace('-', ' ')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Queue:</span>
          <span className="text-foreground font-mono font-semibold">
            {lift.targetFloors.length > 0 ? lift.targetFloors.join(' → ') : '—'}
          </span>
        </div>
      </div>

      {/* Internal controls */}
      <div className="w-full">
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Internal Controls</p>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: numFloors }, (_, i) => i).map((floor) => (
            <Button
              key={floor}
              size="sm"
              variant={lift.targetFloors.includes(floor) ? 'default' : 'outline'}
              onClick={() => onInternalRequest(floor)}
              disabled={lift.status === 'fault' || lift.currentFloor === floor}
              className={`h-8 text-xs font-bold transition-all hover:scale-110 ${
                lift.targetFloors.includes(floor) ? 'shadow-glow' : ''
              }`}
            >
              {floor}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiftVisual;
