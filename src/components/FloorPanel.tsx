import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FloorPanelProps {
  numFloors: number;
  onRequest: (floor: number, direction: 'up' | 'down') => void;
  activeRequests: Set<string>;
}

const FloorPanel = ({ numFloors, onRequest, activeRequests }: FloorPanelProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">Floor Request Panel</h2>
      <p className="text-sm text-muted-foreground mb-4">
        External controls - Call a lift to any floor
      </p>
      
      <div className="space-y-2">
        {Array.from({ length: numFloors }, (_, i) => numFloors - 1 - i).map((floor) => (
          <div key={floor} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
            <span className="text-foreground font-mono font-bold w-12">
              Floor {floor}
            </span>
            <div className="flex gap-2 ml-auto">
              {floor < numFloors - 1 && (
                <Button
                  size="sm"
                  variant={activeRequests.has(`${floor}-up`) ? 'default' : 'outline'}
                  onClick={() => onRequest(floor, 'up')}
                  className="gap-1"
                >
                  <ArrowUp className="w-4 h-4" />
                  Up
                </Button>
              )}
              {floor > 0 && (
                <Button
                  size="sm"
                  variant={activeRequests.has(`${floor}-down`) ? 'default' : 'outline'}
                  onClick={() => onRequest(floor, 'down')}
                  className="gap-1"
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
