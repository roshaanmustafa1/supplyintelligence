'use client'

import { Anchor, Navigation, Compass, Train, AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'

interface CorridorData {
  id: string
  name: string
  mode: string
  status: 'Rerouted' | 'Fluid' | 'Normalized' | 'High Velocity'
  transitVariance: string
  dwellTime: string
  chassisAvailability: string
  keyObservation: string
  riskLevel: 'Low' | 'Medium' | 'Elevated'
}

const corridors: CorridorData[] = [
  {
    id: 'asia-europe',
    name: 'Asia–Europe via Cape of Good Hope',
    mode: 'Ocean Freight',
    status: 'Rerouted',
    transitVariance: '+10 to 14 Days',
    dwellTime: '3.4 Days',
    chassisAvailability: '94% Vessel Cap',
    keyObservation: 'Bypassing Bab el-Mandeb; bunker fuel surcharges stable as carriers maintain slow-steaming rotations.',
    riskLevel: 'Elevated',
  },
  {
    id: 'transpacific',
    name: 'Transpacific (Shanghai → LA/Long Beach)',
    mode: 'Ocean & Drayage',
    status: 'Fluid',
    transitVariance: '+0.5 Days',
    dwellTime: '1.4 Days',
    chassisAvailability: '96% Chassis Supply',
    keyObservation: 'Berth waiting times under 24 hours. Rail car supply from SP/BNSF yards maintaining steady outbound flow.',
    riskLevel: 'Low',
  },
  {
    id: 'panama',
    name: 'Panama Canal Neo-Panamax Lane',
    mode: 'Canal Transit',
    status: 'Normalized',
    transitVariance: 'On Schedule',
    dwellTime: '1.8 Days',
    chassisAvailability: '36 Daily Slots',
    keyObservation: 'Gatun Lake reservoir levels restored. Max vessel draft maintained at 50.0 feet without booking surcharges.',
    riskLevel: 'Low',
  },
  {
    id: 'intermodal-na',
    name: 'North American Corridor (Chicago–Dallas–Laredo)',
    mode: 'Intermodal Rail',
    status: 'High Velocity',
    transitVariance: '-0.8 Days',
    dwellTime: '0.9 Days',
    chassisAvailability: '92% Availability',
    keyObservation: 'Nearshoring cross-border customs volumes up 14% YoY; smart EDI pre-clearance preventing border dwell.',
    riskLevel: 'Medium',
  },
]

export function GlobalCorridorsRadar() {
  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs" aria-label="Global Corridors Radar">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Field Telemetry Radar
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Critical Logistics Corridors</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Global Trade Corridors & Congestion Radar
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          <span>Live Corridor Feed Verified</span>
        </div>
      </div>

      {/* 4-Card Wide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {corridors.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50/60 hover:bg-sky-50/40 border border-slate-200/70 hover:border-sky-300 transition-all duration-200 group"
          >
            <div>
              {/* Top row: Mode + Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {c.mode}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Fluid' || c.status === 'Normalized'
                      ? 'bg-sky-100 text-sky-800'
                      : c.status === 'Rerouted'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Corridor Name */}
              <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 leading-snug group-hover:text-[#0284c7] transition-colors mb-4">
                {c.name}
              </h3>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Transit Var.</span>
                  <span className="font-bold text-slate-800">{c.transitVariance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Port Dwell</span>
                  <span className="font-bold text-slate-800">{c.dwellTime}</span>
                </div>
              </div>

              {/* Key Observation */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {c.keyObservation}
              </p>
            </div>

            {/* Bottom Risk Rating */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Bottleneck Exposure</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  c.riskLevel === 'Low'
                    ? 'text-sky-700'
                    : c.riskLevel === 'Medium'
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {c.riskLevel === 'Low' && <CheckCircle2 className="size-3.5" />}
                {c.riskLevel === 'Medium' && <Clock className="size-3.5" />}
                {c.riskLevel === 'Elevated' && <ShieldAlert className="size-3.5" />}
                {c.riskLevel} Risk
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
