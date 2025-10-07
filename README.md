# 🚀 Lift Management System

Interactive, visual simulation of a distributed elevator control system built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

<div align="center">
  <p>
    <a href="#overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#distributed-systems-concepts">Distributed Systems Concepts</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## 📊 Overview

This project simulates multiple lifts operating across floors, handling internal car requests and external hall calls. A simple scheduler assigns requests to lifts and advances positions on a tick, demonstrating concepts like coordination, fault handling, and queueing.

Key modules:
- `src/utils/liftController.ts`: simulation core (state, scheduling, movement, faults)
- `src/pages/Index.tsx`: simulation loop, UI composition, user interactions
- `src/components/*`: visual lift shafts, floor panel, queue, and stats
- `src/types/lift.ts`: domain types for lifts, requests, and system stats

## ✨ Features

- Multiple lifts with real-time movement visualization
- External hall calls (up/down) and internal car requests per lift
- Nearest-lift assignment heuristic
- Fault injection and auto-reassignment of pending requests
- Live request queue and system statistics (totals, faults, average wait time)

## 🛠️ Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui, lucide-react
- React Router

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm (or bun/pnpm)

### Installation
```bash
git clone <your-repo-url>
cd Lift-Management-System
npm install
```

### Run
```bash
npm run dev
```
Open `http://localhost:5173` (Vite default) in your browser.

### Build
```bash
npm run build
npm run preview
```

## 📱 Usage

- Start the simulation, then create hall calls from the Floor Panel or select internal destinations on each lift.
- Toggle a lift to Fault to observe reassignment behavior.
- Watch the Request Queue and Stats update each tick.

## 🧩 Distributed Systems Concepts

This UI simulates several distributed system ideas in a single-process app:

- Scheduling and Work Assignment: `LiftController.assignLift` plays the role of a dispatcher, assigning work (requests) to workers (lifts) using a nearest-node heuristic.
- Event Loop and Discrete Ticks: `Index.tsx` drives `controller.updateLiftPositions()` on an interval, akin to time-sliced progression in simulators and heartbeat-driven controllers.
- Fault Tolerance and Rebalancing: `toggleLiftFault` marks a lift as unavailable, clears its queue, and reassigns its in-flight work to other lifts, illustrating failover and rebalancing.
- Backlogs and Queues: External/internal requests form a shared backlog; lifts maintain per-worker queues (`targetFloors`)—a simplified mix of centralized and local queues.
- Consistency Model: The UI observes controller state after each tick, reflecting eventual consistency between render cycles and the simulation state.
- Capacity Constraints: Requests are only assigned to lifts under capacity (placeholder for load-aware scheduling).

Limitations vs real distributed systems:
- Single-process, in-memory state (no network partitions, no true concurrency)
- No consensus/leader election; scheduling is centralized
- Determinism is limited due to random initial floors

## 🗺️ Roadmap

- Direction-aware scheduling (match request direction, maintain up/down-ordered stops)
- Dwell time and passenger load updates to make capacity meaningful
- Deduplicate hall calls per floor+direction; debounce UI
- Speed controls and deterministic seeding for repeatable runs
- Persisted metrics and charts over time

## 📄 License

MIT

## 👤 Author

[Yash Parmar](https://github.com/Yashparmar1125)
