import { SystemStats as Stats } from '@/types/lift';
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface SystemStatsProps {
  stats: Stats;
}

const SystemStats = ({ stats }: SystemStatsProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">System Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Requests</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalRequests}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.completedRequests}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Lifts</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.activeLifts}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Faulted</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.faultedLifts}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm text-muted-foreground">Avg Wait Time</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.averageWaitTime.toFixed(1)}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
