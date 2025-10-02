import { useState, useEffect, useCallback } from 'react';
import { LiftController } from '@/utils/liftController';
import { Request, Direction, SystemStats as Stats } from '@/types/lift';
import LiftVisual from '@/components/LiftVisual';
import FloorPanel from '@/components/FloorPanel';
import RequestQueue from '@/components/RequestQueue';
import SystemStats from '@/components/SystemStats';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NUM_LIFTS = 4;
const NUM_FLOORS = 10;
const SIMULATION_SPEED = 1000; // ms per floor

const Index = () => {
  const { toast } = useToast();
  const [controller] = useState(() => new LiftController(NUM_LIFTS, NUM_FLOORS));
  const [lifts, setLifts] = useState(controller.getLifts());
  const [requests, setRequests] = useState<Request[]>(controller.getRequests());
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    completedRequests: 0,
    activeLifts: NUM_LIFTS,
    faultedLifts: 0,
    averageWaitTime: 0,
  });

  const updateStats = useCallback(() => {
    const allRequests = controller.getRequests();
    const completed = allRequests.filter(r => r.status === 'completed');
    const currentLifts = controller.getLifts();
    const active = currentLifts.filter(l => l.status !== 'fault').length;
    const faulted = currentLifts.filter(l => l.status === 'fault').length;
    
    // Calculate average wait time
    let totalWaitTime = 0;
    completed.forEach(req => {
      const waitTime = (Date.now() - req.timestamp) / 1000;
      totalWaitTime += waitTime;
    });
    const avgWait = completed.length > 0 ? totalWaitTime / completed.length : 0;

    setStats({
      totalRequests: allRequests.length,
      completedRequests: completed.length,
      activeLifts: active,
      faultedLifts: faulted,
      averageWaitTime: avgWait,
    });
  }, [controller]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      controller.updateLiftPositions();
      setLifts([...controller.getLifts()]);
      setRequests([...controller.getRequests()]);
      updateStats();
    }, SIMULATION_SPEED);

    return () => clearInterval(interval);
  }, [isRunning, controller, updateStats]);

  const handleExternalRequest = (floor: number, direction: Direction) => {
    const request: Request = {
      id: `external-${Date.now()}-${Math.random()}`,
      floor,
      direction,
      timestamp: Date.now(),
      isInternal: false,
      status: 'pending',
    };

    controller.addRequest(request);
    setRequests([...controller.getRequests()]);
    
    toast({
      title: 'Request Added',
      description: `Floor ${floor} - Going ${direction}`,
    });
  };

  const handleInternalRequest = (liftId: number, floor: number) => {
    controller.addInternalRequest(liftId, floor);
    setLifts([...controller.getLifts()]);
    setRequests([...controller.getRequests()]);
    
    toast({
      title: 'Internal Request',
      description: `Lift ${liftId} → Floor ${floor}`,
    });
  };

  const handleToggleFault = (liftId: number) => {
    controller.toggleLiftFault(liftId);
    setLifts([...controller.getLifts()]);
    setRequests([...controller.getRequests()]);
    updateStats();
    
    const lift = controller.getLifts().find(l => l.id === liftId);
    toast({
      title: lift?.status === 'fault' ? 'Lift Fault' : 'Lift Repaired',
      description: `Lift ${liftId} is now ${lift?.status}`,
      variant: lift?.status === 'fault' ? 'destructive' : 'default',
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  const getActiveRequestKeys = () => {
    return new Set(
      requests
        .filter(r => r.status !== 'completed' && !r.isInternal)
        .map(r => `${r.floor}-${r.direction}`)
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      
      <div className="max-w-[1800px] mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Distributed Lift System
            </h1>
            <div className="h-1 bg-gradient-primary rounded-full animate-shimmer" style={{
              backgroundSize: '200% 100%',
              backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)'
            }} />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time simulation demonstrating <span className="text-primary font-semibold">concurrency</span>, 
            <span className="text-accent font-semibold"> fault tolerance</span>, and 
            <span className="text-success font-semibold"> distributed coordination</span>
          </p>
          
          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className={`gap-2 transition-all hover:scale-110 ${isRunning ? 'shadow-glow' : ''}`}
            >
              {isRunning ? (
                <>
                  <PauseCircle className="w-5 h-5" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Start Simulation
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="gap-2 transition-all hover:scale-110"
            >
              <RotateCcw className="w-5 h-5" />
              Reset System
            </Button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left/Center - Lifts and Floor Panel */}
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Lifts */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {lifts.map((lift) => (
                <LiftVisual
                  key={lift.id}
                  lift={lift}
                  numFloors={NUM_FLOORS}
                  onInternalRequest={(floor) => handleInternalRequest(lift.id, floor)}
                  onToggleFault={() => handleToggleFault(lift.id)}
                />
              ))}
            </div>
            
            {/* Floor Panel beside lifts */}
            <div className="lg:col-span-1">
              <FloorPanel
                numFloors={NUM_FLOORS}
                onRequest={handleExternalRequest}
                activeRequests={getActiveRequestKeys()}
              />
            </div>
          </div>

          {/* Right column - Stats and Queue */}
          <div className="space-y-6">
            <SystemStats stats={stats} />
            <RequestQueue requests={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
