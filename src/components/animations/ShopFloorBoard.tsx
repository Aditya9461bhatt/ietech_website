import { motion } from 'framer-motion';
import { Settings, ChevronRight, FileText, ChevronDown } from 'lucide-react';

export default function ShopFloorBoard() {
  return (
    <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-[8px] border border-neutral-200 dark:border-[#30363d] bg-neutral-100 dark:bg-[#0d1117] text-[13px] shadow-2xl flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center h-[52px] border-b border-neutral-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <FileText className="h-4 w-4 text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]" />
            <span className="text-[14px] font-medium text-neutral-900 dark:text-[#c9d1d9]">Manufacturing</span>
            <ChevronRight className="h-3 w-3 text-neutral-600 dark:text-neutral-500 dark:text-[#8d99a6] mx-0.5" />
            <span className="text-[14px] font-medium text-neutral-900 dark:text-[#c9d1d9]">Work Order</span>
            <ChevronRight className="h-3 w-3 text-neutral-600 dark:text-neutral-500 dark:text-[#8d99a6] mx-0.5" />
            <span className="text-[14px] font-bold text-neutral-900 dark:text-white">MFG-WO-2026-00041</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-2 py-0.5 rounded-sm text-[11px] font-bold bg-[#7c2d12] text-[#fb923c] uppercase tracking-wide">
            In Process
          </span>
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-sm bg-[#123859] text-[12px] font-bold text-[#58a6ff] shadow-sm">
            M
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-[#0d1117] py-6 px-4 sm:px-8">
        <div className="max-w-[850px] mx-auto bg-white dark:bg-[#161b22] rounded-sm shadow-sm border border-neutral-200 dark:border-[#30363d]">
          {/* Action Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-[#30363d]">
            <div className="flex gap-2">
              <Settings className="h-4 w-4 text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-neutral-900 dark:text-white transition-colors" />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 text-[13px] font-medium bg-neutral-50 dark:bg-[#21262d] text-neutral-900 dark:text-[#c9d1d9] border border-neutral-200 dark:border-[#30363d] rounded-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 dark:bg-[#30363d] transition-colors">
                Actions <ChevronDown className="h-3 w-3" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1 text-[13px] font-medium bg-neutral-50 dark:bg-[#21262d] text-neutral-900 dark:text-[#c9d1d9] border border-neutral-200 dark:border-[#30363d] rounded-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 dark:bg-[#30363d] transition-colors">
                Create <ChevronDown className="h-3 w-3" />
              </button>
              <button className="px-3 py-1 text-[13px] font-medium bg-[#2490ef] text-white rounded-sm hover:bg-[#58a6ff] transition-colors">
                Start / Finish
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Progress Bar Section */}
            <div className="mb-8 flex items-center justify-between bg-neutral-100 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] p-4 rounded-sm">
              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Produced Qty / Qty to Manufacture</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full rounded-full overflow-hidden bg-neutral-200 dark:bg-[#30363d]">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '50%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#4ade80]" 
                      />
                    </div>
                    <span className="text-[12px] font-mono font-medium text-neutral-900 dark:text-[#c9d1d9]">50%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-1/4">
                  <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Material Transferred</span>
                  <span className="text-[13px] font-medium text-[#4ade80]">100%</span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
              <div className="relative">
                <label className="block text-[12px] mb-1 font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Item to Manufacture</label>
                <input disabled value="ITEM-GEARBOX-001" className="w-full bg-transparent border-b border-neutral-200 dark:border-[#30363d] py-1 text-[13px] font-medium cursor-pointer disabled:opacity-100 text-[#58a6ff]" />
                <span className="text-[11px] text-neutral-600 dark:text-neutral-500 mt-1 block">Precision Gearbox Assembly</span>
              </div>
              <div className="relative">
                <label className="block text-[12px] mb-1 font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">BOM No</label>
                <input disabled value="BOM-GEARBOX-001" className="w-full bg-transparent border-b border-neutral-200 dark:border-[#30363d] py-1 text-[13px] font-medium cursor-pointer disabled:opacity-100 text-[#58a6ff]" />
              </div>
              <div className="relative">
                <label className="block text-[12px] mb-1 font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Sales Order</label>
                <input disabled value="SO-2026-0089" className="w-full bg-transparent border-b border-neutral-200 dark:border-[#30363d] py-1 text-[13px] font-medium cursor-pointer disabled:opacity-100 text-[#58a6ff]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[12px] mb-1 font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Qty</label>
                  <input disabled value="50.00" className="w-full bg-transparent border-b border-neutral-200 dark:border-[#30363d] py-1 text-[13px] text-right font-mono disabled:opacity-100 text-neutral-900 dark:text-[#c9d1d9]" />
                </div>
                <div className="relative">
                  <label className="block text-[12px] mb-1 font-medium text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">Produced</label>
                  <input disabled value="25.00" className="w-full bg-transparent border-b border-neutral-200 dark:border-[#30363d] py-1 text-[13px] text-right font-mono disabled:opacity-100 text-neutral-900 dark:text-[#c9d1d9]" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b gap-6 mb-6 border-neutral-200 dark:border-[#30363d]">
              <h3 className="text-[13px] font-bold pb-2 text-neutral-900 dark:text-white border-b-[3px] border-[#58a6ff]">Operations</h3>
              <h3 className="text-[13px] font-medium pb-2 cursor-pointer text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:text-[#c9d1d9] transition-colors">Required Items</h3>
              <h3 className="text-[13px] font-medium pb-2 cursor-pointer text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:text-[#c9d1d9] transition-colors">Time Logs</h3>
            </div>

            {/* Table */}
            <div className="rounded-sm border overflow-hidden border-neutral-200 dark:border-[#30363d]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[12px] font-medium bg-white dark:bg-[#161b22] text-neutral-600 dark:text-neutral-500 dark:text-[#8b949e]">
                    <th className="px-3 py-2 border-b border-r w-8 font-normal text-center border-neutral-200 dark:border-[#30363d]">
                      <input type="checkbox" className="rounded-sm bg-neutral-100 dark:bg-[#0d1117] border-neutral-200 dark:border-[#30363d]" disabled />
                    </th>
                    <th className="px-3 py-2 border-b border-r border-neutral-200 dark:border-[#30363d]">Operation</th>
                    <th className="px-3 py-2 border-b border-r border-neutral-200 dark:border-[#30363d]">Workstation</th>
                    <th className="px-3 py-2 border-b border-r border-neutral-200 dark:border-[#30363d]">Status</th>
                    <th className="px-3 py-2 border-b text-right border-neutral-200 dark:border-[#30363d]">Completed Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { op: "Milling", station: "CNC-Milling-01", status: "Completed", qty: "50.00", statusColor: "bg-[#166534] text-neutral-900 dark:text-white" },
                    { op: "Turning", station: "CNC-Lathe-02", status: "Completed", qty: "50.00", statusColor: "bg-[#166534] text-neutral-900 dark:text-white" },
                    { op: "Assembly", station: "Assembly-Line-A", status: "In Process", qty: "25.00", statusColor: "bg-[#9a3412] text-neutral-900 dark:text-white" },
                    { op: "Quality Inspection", station: "QC-Station-01", status: "Pending", qty: "0.00", statusColor: "bg-neutral-200 dark:bg-[#30363d] text-neutral-900 dark:text-[#c9d1d9]" }
                  ].map((row, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="border-b last:border-0 border-neutral-200 dark:border-[#30363d] hover:bg-neutral-50 dark:bg-[#21262d] transition-colors"
                    >
                      <td className="px-3 py-2 border-r text-center text-neutral-600 dark:text-neutral-500 border-neutral-200 dark:border-[#30363d]">{i + 1}</td>
                      <td className="px-3 py-2 border-r text-[#58a6ff] border-neutral-200 dark:border-[#30363d] font-medium">{row.op}</td>
                      <td className="px-3 py-2 border-r text-neutral-900 dark:text-[#c9d1d9] border-neutral-200 dark:border-[#30363d]">{row.station}</td>
                      <td className="px-3 py-2 border-r border-neutral-200 dark:border-[#30363d]">
                        <span className={`px-2 py-0.5 rounded-sm text-[11px] font-bold ${row.statusColor}`}>{row.status}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-neutral-900 dark:text-[#c9d1d9]">{row.qty}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
