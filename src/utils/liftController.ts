import { Lift, Request, Direction } from '@/types/lift';

export class LiftController {
  private lifts: Lift[] = [];
  private requests: Request[] = [];
  
  constructor(numLifts: number, numFloors: number) {
    this.initializeLifts(numLifts, numFloors);
  }

  private initializeLifts(numLifts: number, numFloors: number) {
    this.lifts = Array.from({ length: numLifts }, (_, i) => ({
      id: i + 1,
      currentFloor: Math.floor(Math.random() * numFloors),
      targetFloors: [],
      status: 'idle' as const,
      direction: 'idle' as Direction,
      capacity: 8,
      currentLoad: 0,
    }));
  }

  getLifts(): Lift[] {
    return this.lifts;
  }

  getRequests(): Request[] {
    return this.requests;
  }

  addRequest(request: Request): void {
    this.requests.push(request);
    this.assignLift(request);
  }

  private assignLift(request: Request): void {
    // Find nearest available lift using basic algorithm
    const availableLifts = this.lifts.filter(
      lift => lift.status !== 'fault' && lift.currentLoad < lift.capacity
    );

    if (availableLifts.length === 0) {
      console.log('No available lifts');
      return;
    }

    // Calculate distance for each lift
    const liftDistances = availableLifts.map(lift => ({
      lift,
      distance: Math.abs(lift.currentFloor - request.floor),
    }));

    // Sort by distance and pick nearest
    liftDistances.sort((a, b) => a.distance - b.distance);
    const nearestLift = liftDistances[0].lift;

    // Assign the request to the lift
    request.liftId = nearestLift.id;
    request.status = 'assigned';
    
    if (!nearestLift.targetFloors.includes(request.floor)) {
      nearestLift.targetFloors.push(request.floor);
      nearestLift.targetFloors.sort((a, b) => a - b);
    }

    console.log(`Assigned request ${request.id} to Lift ${nearestLift.id}`);
  }

  updateLiftPositions(): void {
    this.lifts.forEach(lift => {
      if (lift.status === 'fault') {
        // Do not change state while in fault
        return;
      }

      if (lift.targetFloors.length === 0) {
        lift.status = 'idle';
        lift.direction = 'idle';
        return;
      }

      const nextTarget = lift.targetFloors[0];

      if (lift.currentFloor < nextTarget) {
        lift.currentFloor++;
        lift.status = 'moving-up';
        lift.direction = 'up';
      } else if (lift.currentFloor > nextTarget) {
        lift.currentFloor--;
        lift.status = 'moving-down';
        lift.direction = 'down';
      } else {
        // Reached target floor
        lift.targetFloors.shift();
        
        // Complete requests for this floor
        this.requests.forEach(req => {
          if (req.liftId === lift.id && req.floor === lift.currentFloor && req.status === 'assigned') {
            req.status = 'completed';
          }
        });

        // Clean up old completed requests
        this.requests = this.requests.filter(
          req => req.status !== 'completed' || Date.now() - req.timestamp < 5000
        );

        if (lift.targetFloors.length === 0) {
          lift.status = 'idle';
          lift.direction = 'idle';
        }
      }
    });
  }

  toggleLiftFault(liftId: number): void {
    const lift = this.lifts.find(l => l.id === liftId);
    if (lift) {
      lift.status = lift.status === 'fault' ? 'idle' : 'fault';
      if (lift.status === 'fault') {
        lift.targetFloors = [];
        lift.direction = 'idle';
        
        // Reassign pending requests from this lift
        const affectedRequests = this.requests.filter(
          req => req.liftId === liftId && req.status === 'assigned'
        );
        affectedRequests.forEach(req => {
          req.status = 'pending';
          req.liftId = undefined;
          this.assignLift(req);
        });
      }
    }
  }

  addInternalRequest(liftId: number, targetFloor: number): void {
    const lift = this.lifts.find(l => l.id === liftId);
    if (lift && lift.status !== 'fault' && !lift.targetFloors.includes(targetFloor)) {
      lift.targetFloors.push(targetFloor);
      lift.targetFloors.sort((a, b) => a - b);
      
      const request: Request = {
        id: `internal-${Date.now()}-${Math.random()}`,
        floor: targetFloor,
        timestamp: Date.now(),
        isInternal: true,
        liftId: liftId,
        status: 'assigned',
      };
      
      this.requests.push(request);
    }
  }
}
