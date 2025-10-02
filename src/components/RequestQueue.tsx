import { Request } from '@/types/lift';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface RequestQueueProps {
  requests: Request[];
}

const RequestQueue = ({ requests }: RequestQueueProps) => {
  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-warning" />;
      case 'assigned':
        return <Clock className="w-4 h-4 text-primary" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
    }
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return 'border-warning/50';
      case 'assigned':
        return 'border-primary/50';
      case 'completed':
        return 'border-success/50';
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Request Queue
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-primary font-semibold">{requests.length}</span> active requests
          </p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
            <p className="text-4xl mb-2">✨</p>
            <p>No active requests</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className={`flex items-center gap-3 bg-muted/40 hover:bg-muted/60 rounded-lg p-3 border-l-4 ${getStatusColor(request.status)} transition-all hover:scale-[1.02] animate-slide-up`}
            >
              {getStatusIcon(request.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-mono font-bold text-primary">
                    Floor {request.floor}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize font-semibold px-2 py-1 bg-background/50 rounded">
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="font-medium">{request.isInternal ? '🔘 Internal' : '🏢 External'}</span>
                  {request.liftId && (
                    <>
                      <span>•</span>
                      <span className="text-primary">Lift {request.liftId}</span>
                    </>
                  )}
                  {request.direction && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{request.direction === 'up' ? '⬆️' : '⬇️'} {request.direction}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestQueue;
