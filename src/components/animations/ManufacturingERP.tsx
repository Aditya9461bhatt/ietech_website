import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Home, LayoutDashboard, Box, Factory, ClipboardList, 
  PackageSearch, CalendarClock, FileBarChart, Settings, 
  ChevronRight, ArrowUpRight, Search, Activity, MoreHorizontal,
  Workflow
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { icon: <Home className="w-4 h-4" />, name: 'Home' },
  { icon: <LayoutDashboard className="w-4 h-4" />, name: 'Dashboard', active: true },
  { icon: <Box className="w-4 h-4" />, name: 'BOM' },
  { icon: <Factory className="w-4 h-4" />, name: 'Work Order' },
  { icon: <ClipboardList className="w-4 h-4" />, name: 'Job Card' },
  { icon: <PackageSearch className="w-4 h-4" />, name: 'Stock Entry' },
  { icon: <CalendarClock className="w-4 h-4" />, name: 'Material Planning' },
  { icon: <Workflow className="w-4 h-4" />, name: 'Production Plan' },
  { icon: <FileBarChart className="w-4 h-4" />, name: 'Reports' },
  { icon: <Settings className="w-4 h-4" />, name: 'Settings' },
];

const JOB_CARDS = [
  { id: 'JC-00142', item: 'CNC-Milled Aluminium Casing', status: 'In Progress', progress: 65, machine: 'Milling-02', time: '4h 15m' },
  { id: 'JC-00143', item: 'Titanium Rotor Assembly', status: 'Queued', progress: 0, machine: 'Assembly-A', time: '--' },
  { id: 'JC-00140', item: 'Carbon Fiber Base Plate', status: 'Completed', progress: 100, machine: 'Press-01', time: '1h 30m' },
  { id: 'JC-00144', item: 'Thermal Heat Sink', status: 'In Progress', progress: 32, machine: 'Milling-01', time: '2h 10m' },
];

export default function ManufacturingERP() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className="w-full h-[600px] bg-neutral-100 dark:bg-[#0d1117] rounded-sm border border-black/10 dark:border-white/10 overflow-hidden flex font-sans shadow-2xl relative select-none">
      
      {/* Sidebar */}
      <div className="w-[220px] bg-white dark:bg-[#161b22] border-r border-black/5 dark:border-white/5 flex flex-col shrink-0">
        {/* Header */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-black/5 dark:border-white/5">
          <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Factory className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
          </div>
          <span className="text-neutral-900 dark:text-white font-bold text-sm tracking-wide">Manufacturing</span>
        </div>

        {/* Global Search */}
        <div className="px-3 py-3">
          <div className="bg-neutral-100 dark:bg-[#0d1117] border border-black/10 dark:border-white/10 rounded-sm px-3 py-1.5 flex items-center gap-2 text-neutral-600 dark:text-neutral-500 hover:border-white/20 transition-colors cursor-text">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Search...</span>
            <span className="ml-auto bg-black/5 dark:bg-white/5 text-[9px] px-1.5 py-0.5 rounded-sm border border-black/10 dark:border-white/10">⌘K</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-0.5 custom-scrollbar">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] transition-all duration-200 ${
                activeItem === item.name 
                  ? 'bg-blue-500/10 text-blue-400 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <div className={activeItem === item.name ? 'text-blue-500' : 'text-neutral-600 dark:text-neutral-500'}>
                {item.icon}
              </div>
              {item.name}
            </button>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-black/5 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-neutral-900 dark:text-white text-xs font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-900 dark:text-white text-[12px] font-semibold leading-tight">Administrator</span>
            <span className="text-neutral-600 dark:text-neutral-500 text-[10px]">admin@factory.local</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-[#0d1117] overflow-hidden">
        {/* Topbar */}
        <div className="h-14 bg-white dark:bg-[#161b22]/50 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Manufacturing</span>
            <ChevronRight className="w-4 h-4 text-neutral-600" />
            <span className="text-neutral-900 dark:text-white font-medium">{activeItem}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group">
              <Bell className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-neutral-200 dark:border-[#161b22]" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 rounded-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="text-xs font-medium uppercase tracking-wider">Active Work Orders</span>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-neutral-900 dark:text-white font-bold">24</span>
                <span className="text-[10px] text-green-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> +3 today</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 rounded-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="text-xs font-medium uppercase tracking-wider">Overall Equipment Effectiveness</span>
                <Factory className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-neutral-900 dark:text-white font-bold">78.4%</span>
                <span className="text-[10px] text-green-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> +1.2%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 rounded-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="text-xs font-medium uppercase tracking-wider">Pending Material Requests</span>
                <Box className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-neutral-900 dark:text-white font-bold">12</span>
                <span className="text-[10px] text-neutral-600 dark:text-neutral-500">Critical: 2</span>
              </div>
            </div>
          </div>

          {/* Active Job Cards */}
          <div className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 rounded-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-neutral-900 dark:text-white font-semibold text-sm">Live Job Cards</h3>
              <button className="text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors">View All</button>
            </div>
            
            <div className="flex flex-col">
              {JOB_CARDS.map((job, idx) => (
                <div key={job.id} className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors ${idx !== JOB_CARDS.length -1 ? 'border-b border-black/5 dark:border-white/5' : ''}`}>
                  <div className="flex items-center gap-4 w-[40%]">
                    <div className="w-8 h-8 rounded-sm bg-neutral-100 dark:bg-[#0d1117] border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-900 dark:text-white text-sm font-medium">{job.item}</span>
                      <span className="text-neutral-600 dark:text-neutral-500 text-xs">{job.id}</span>
                    </div>
                  </div>
                  
                  <div className="w-[15%] flex flex-col gap-1">
                    <span className="text-neutral-600 dark:text-neutral-500 text-[10px] uppercase tracking-wider">Machine</span>
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs">{job.machine}</span>
                  </div>

                  <div className="w-[15%] flex flex-col gap-1">
                    <span className="text-neutral-600 dark:text-neutral-500 text-[10px] uppercase tracking-wider">Runtime</span>
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs font-mono">{job.time}</span>
                  </div>

                  <div className="w-[20%] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        job.status === 'Completed' ? 'text-green-400' :
                        job.status === 'In Progress' ? 'text-blue-400' : 'text-amber-400'
                      }`}>{job.status}</span>
                      <span className="text-neutral-600 dark:text-neutral-400 text-[10px]">{job.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#0d1117] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full ${
                          job.status === 'Completed' ? 'bg-green-500' :
                          job.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="w-[5%] flex justify-end">
                    <button className="text-neutral-600 dark:text-neutral-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
