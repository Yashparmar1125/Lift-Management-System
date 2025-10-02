import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FloorPanelProps {
  numFloors: number;
  onRequest: (floor: number, direction: 'up' | 'down') => void;
  activeRequests: Set<string>;
}

const FloorPanel = ({ numFloors, onRequest, activeRequests }: FloorPanelProps) => {
  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border hover:border-primary/30 transition-all duration-300 h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-2xl">🏢</span>
          Floor Panel
        </h2>
        <p className="text-sm text-muted-foreground">
          External controls - Call lifts
        </p>
      </div>
      
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {Array.from({ length: numFloors }, (_, i) => numFloors - 1 - i).map((floor) => (
          <div key={floor} className="flex items-center gap-3 bg-muted/40 hover:bg-muted/60 rounded-lg p-3 border border-border/30 transition-all">
            <span className="text-foreground font-mono font-bold w-12 text-primary">
              {floor}
            </span>
            <div className="flex gap-2 ml-auto">
              {floor < numFloors - 1 && (
                <Button
                  size="sm"
                  variant={activeRequests.has(`${floor}-up`) ? 'default' : 'outline'}
                  onClick={() => {
                    console.log('Floor request clicked:', floor, 'up');
                    onRequest(floor, 'up');
                  }}
                  className={`gap-1 transition-all hover:scale-105 ${
                    activeRequests.has(`${floor}-up`) ? 'shadow-glow' : ''
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  Up
                </Button>
              )}
              {floor > 0 && (
                <Button
                  size="sm"
                  variant={activeRequests.has(`${floor}-down`) ? 'default' : 'outline'}
                  onClick={() => {
                    console.log('Floor request clicked:', floor, 'down');
                    onRequest(floor, 'down');
                  }}
                  className={`gap-1 transition-all hover:scale-105 ${
                    activeRequests.has(`${floor}-down`) ? 'shadow-glow' : ''
                  }`}
                >
                  <ArrowDown className="w-4 h-4" />
                  Down
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPanel;
