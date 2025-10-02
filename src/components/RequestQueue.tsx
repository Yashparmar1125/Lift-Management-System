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
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">Request Queue</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Real-time request tracking ({requests.length} active)
      </p>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active requests
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className={`flex items-center gap-3 bg-muted/50 rounded-lg p-3 border-l-4 ${getStatusColor(request.status)}`}
            >
              {getStatusIcon(request.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-mono">
                    Floor {request.floor}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{request.isInternal ? 'Internal' : 'External'}</span>
                  {request.liftId && (
                    <>
                      <span>•</span>
                      <span>Lift {request.liftId}</span>
                    </>
                  )}
                  {request.direction && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{request.direction}</span>
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
