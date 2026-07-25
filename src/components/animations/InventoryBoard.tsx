import { motion } from 'framer-motion';
import { 
  Home, LayoutDashboard, Box, Factory, ClipboardList, PackageSearch, 
  CalendarClock, Wrench, FileBarChart, Settings, Search, Bell, 
  ChevronRight, BoxSelect, MoreHorizontal, BarChart3, Menu, ChevronDown
} from 'lucide-react';

export default function InventoryBoard() {
  return (
    <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-[8px] border border-neutral-200 dark:border-[#30363d] bg-neutral-100 dark:bg-[#0d1117] text-[13px] shadow-2xl flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[200px] hidden sm:flex flex-col bg-neutral-100 dark:bg-[#0d1117] shrink-0 border-r border-neutral-200 dark:border-[#30363d]">
        <div className="flex items-center gap-2 p-3 pl-4">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#1f7be0] text-neutral-900 dark:text-white">
            <Factory className="h-3 w-3" />
          </div>
          <span className="font-semibold text-neutral-900 dark:text-[#c9d1d9] text-[13.5px]">Manufacturing</span>
          <MoreHorizontal className="h-3 w-3 text-neutral-600 dark:text-neutral-400 ml-auto" />
        </div>
        
        <div className="px-3">
          <div className="flex items-center gap-2 p-1.5 text-neutral-600 dark:text-neutral-400 text-[12px] bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] rounded-sm mb-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <span className="ml-auto text-[10px]">Ctrl+K</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-2 px-2 py-1.5 text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d] rounded-sm cursor-pointer transition-colors">
            <Bell className="h-4 w-4" /> <span className="text-[13px]">Notification</span>
          </div>
          <div className="mt-2 mb-1 border-b mx-2 border-neutral-200 dark:border-[#30363d]" />
          
          {[
            { icon: <Home className="h-4 w-4" />, name: 'Home' },
            { icon: <LayoutDashboard className="h-4 w-4" />, name: 'Dashboard' },
            { icon: <Box className="h-4 w-4 text-[#1f7be0]" />, name: 'BOM', active: true },
            { icon: <Factory className="h-4 w-4" />, name: 'Work Order' },
            { icon: <ClipboardList className="h-4 w-4" />, name: 'Job Card' },
            { icon: <PackageSearch className="h-4 w-4" />, name: 'Stock Entry' },
          ].map(t => (
            <div key={t.name} className={`flex items-center gap-3 px-2 py-1.5 rounded-sm cursor-pointer transition-colors ${t.active ? "bg-white dark:bg-[#161b22] shadow-sm font-medium text-neutral-900 dark:text-[#c9d1d9]" : "text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d]"}`}>
              {t.icon} <span className="text-[13px]">{t.name}</span>
            </div>
          ))}

          <div className="flex items-center gap-3 px-2 py-1.5 rounded-sm text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d] cursor-pointer transition-colors">
            <CalendarClock className="h-4 w-4" /> <span className="text-[13px] flex-1">Material Planning</span> <ChevronRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-sm text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d] cursor-pointer transition-colors">
            <Wrench className="h-4 w-4" /> <span className="text-[13px] flex-1">Tools</span> <ChevronRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-sm text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d] cursor-pointer transition-colors">
            <FileBarChart className="h-4 w-4" /> <span className="text-[13px] flex-1">Reports</span> <ChevronRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-sm text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:bg-neutral-50 dark:bg-[#21262d] cursor-pointer transition-colors">
            <Settings className="h-4 w-4" /> <span className="text-[13px] flex-1">Setup</span> <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        <div className="p-3 border-t border-neutral-200 dark:border-[#30363d] mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-green-900/30 text-[11px] font-bold text-green-500">
              A
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-neutral-900 dark:text-[#c9d1d9] text-[12px]">Administrator</span>
              <span className="text-neutral-600 dark:text-neutral-500 text-[10px]">admin@example.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-[#0d1117] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-[#30363d]">
          <div className="text-[14px] font-medium text-neutral-900 dark:text-[#c9d1d9] flex items-center gap-2">
            Manufacturing
          </div>
          <div className="flex gap-2">
            <Settings className="h-4 w-4 text-neutral-600 dark:text-neutral-500" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-neutral-900 dark:text-[#c9d1d9] mb-4">Your Shortcuts</h3>
            <div className="border border-neutral-200 dark:border-[#30363d] rounded-sm p-5 mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)] bg-white dark:bg-[#161b22]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[15px] font-semibold text-neutral-900 dark:text-[#c9d1d9]">Produced Quantity</div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-500">Last synced: just now</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-sm text-[12px] font-medium bg-neutral-50 dark:bg-[#21262d] text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">
                    <BarChart3 className="h-3 w-3" /> Last Year <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="h-32 w-full border-b-2 border-pink-500/80 mt-12 relative flex items-end">
                <div className="absolute -left-3 bottom-0 h-full flex flex-col justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                  <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
                </div>
                <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  <span>Mar 2025</span><span>May 2025</span><span>Jul 2025</span><span>Sep 2025</span><span>Nov 2025</span><span>Jan 2026</span><span>Mar 2026</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { title: "Open Work Orders", value: "0" },
                { title: "WIP Work Orders", value: "0" },
                { title: "Manufactured Items Value", value: "₹ 0.00" }
              ].map(t => (
                <div key={t.title} className="border border-neutral-200 dark:border-[#30363d] rounded-sm p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)] bg-white dark:bg-[#161b22]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">{t.title}</span>
                    <Menu className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="text-[22px] font-semibold text-neutral-900 dark:text-white">{t.value}</div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-[16px] font-bold text-neutral-900 dark:text-[#c9d1d9] mb-4">Reports & Masters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Production",
                items: ["Work Order", "Production Plan", "Stock Entry", "Job Card", "Item Lead Time", "Master Production Schedule", "Downtime Entry", "Sales Forecast"]
              },
              {
                title: "Bill of Materials",
                items: ["Item", "Bill of Materials", "Workstation Type", "Workstation", "Operation", "Routing"]
              },
              {
                title: "Subcontracting",
                items: ["BOM", "Subcontracting BOM", "Subcontracting Order", "Subcontracting Receipt", "Subcontract Order Summary", "Subcontracted Raw Materials To Be Tr...", "Subcontracted Item To Be Received"]
              },
              {
                title: "Reports",
                items: ["Production Planning Report", "Material Requirements Planning", "Work Order Summary", "Quality Inspection Summary", "Downtime Analysis", "Job Card Summary"]
              },
              {
                title: "Tools",
                items: ["BOM Update Tool", "BOM Comparison Tool"]
              },
              {
                title: "Settings",
                items: ["Manufacturing Settings"]
              }
            ].map(col => (
              <motion.div 
                key={col.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-neutral-200 dark:border-[#30363d] rounded-sm p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)] h-full bg-white dark:bg-[#161b22]"
              >
                <h4 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-3">{col.title}</h4>
                <div className="flex flex-col gap-2.5">
                  {col.items.map(item => (
                    <span key={item} className="text-[13px] text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:text-[#58a6ff] cursor-pointer flex items-center justify-between group transition-colors">
                      <span className="line-clamp-1">{item}</span>
                      <ChevronRight className="h-3 w-3 hidden group-hover:block text-[#58a6ff]" />
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
