import { SystemStats as Stats } from '@/types/lift';
import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface SystemStatsProps {
  stats: Stats;
}

const SystemStats = ({ stats }: SystemStatsProps) => {
  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border hover:border-primary/30 transition-all duration-300">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        System Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/40 rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary animate-pulse-glow" />
            <span className="text-sm text-muted-foreground font-medium">Total</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalRequests}</p>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 border border-success/20 hover:border-success/40 transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground font-medium">Done</span>
          </div>
          <p className="text-3xl font-bold text-success">{stats.completedRequests}</p>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Active</span>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.activeLifts}</p>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 border border-destructive/20 hover:border-destructive/40 transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">Faulted</span>
          </div>
          <p className="text-3xl font-bold text-destructive">{stats.faultedLifts}</p>
        </div>

        <div className="bg-gradient-primary rounded-lg p-4 col-span-2 hover:scale-105 transition-all cursor-pointer shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm text-primary-foreground/90 font-medium">Avg Wait Time</span>
          </div>
          <p className="text-4xl font-bold text-primary-foreground">
            {stats.averageWaitTime.toFixed(1)}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
