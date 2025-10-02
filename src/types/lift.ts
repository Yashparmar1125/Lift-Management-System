export type LiftStatus = 'idle' | 'moving-up' | 'moving-down' | 'fault';
export type Direction = 'up' | 'down' | 'idle';

export interface Lift {
  id: number;
  currentFloor: number;
  targetFloors: number[];
  status: LiftStatus;
  direction: Direction;
  capacity: number;
  currentLoad: number;
}

export interface Request {
  id: string;
  floor: number;
  direction?: Direction;
  timestamp: number;
  isInternal: boolean;
  liftId?: number;
  status: 'pending' | 'assigned' | 'completed';
}

export interface SystemStats {
  totalRequests: number;
  completedRequests: number;
  activeLifts: number;
  faultedLifts: number;
  averageWaitTime: number;
}
