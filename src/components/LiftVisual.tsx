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
    <div className="flex flex-col items-center gap-4 bg-card rounded-xl p-4 shadow-card border border-border">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold text-foreground">Lift {lift.id}</h3>
        <Button
          size="sm"
          variant={lift.status === 'fault' ? 'destructive' : 'outline'}
          onClick={onToggleFault}
          className="text-xs"
        >
          {lift.status === 'fault' ? 'Repair' : 'Fault'}
        </Button>
      </div>

      {/* Lift shaft visualization */}
      <div className="relative w-20 bg-muted rounded-lg overflow-hidden" style={{ height: `${numFloors * 40}px` }}>
        {/* Floor markers */}
        {Array.from({ length: numFloors }, (_, i) => numFloors - 1 - i).map((floor) => (
          <div
            key={floor}
            className="absolute w-full h-10 border-b border-border/30 flex items-center justify-center text-xs text-muted-foreground"
            style={{ top: `${(numFloors - 1 - floor) * 40}px` }}
          >
            {floor}
          </div>
        ))}

        {/* Lift car */}
        <div
          className={`absolute w-full h-10 ${getStatusColor()} rounded transition-all duration-500 ease-linear flex items-center justify-center text-foreground font-bold border-2 border-primary/50`}
          style={{ bottom: `${lift.currentFloor * 40}px` }}
        >
          {getStatusIcon()}
        </div>
      </div>

      {/* Status display */}
      <div className="w-full space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Floor:</span>
          <span className="text-primary font-mono font-bold">{lift.currentFloor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="text-foreground capitalize">{lift.status.replace('-', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Queue:</span>
          <span className="text-foreground font-mono">
            {lift.targetFloors.length > 0 ? lift.targetFloors.join(', ') : '-'}
          </span>
        </div>
      </div>

      {/* Internal controls */}
      <div className="w-full">
        <p className="text-xs text-muted-foreground mb-2">Internal Controls</p>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: numFloors }, (_, i) => i).map((floor) => (
            <Button
              key={floor}
              size="sm"
              variant={lift.targetFloors.includes(floor) ? 'default' : 'outline'}
              onClick={() => onInternalRequest(floor)}
              disabled={lift.status === 'fault' || lift.currentFloor === floor}
              className="h-8 text-xs"
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
