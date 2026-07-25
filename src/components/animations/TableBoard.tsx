import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

interface Table {
  id: string;
  code: string;
  location: string;
  status: TableStatus;
  total?: number;
  elapsed?: string;
  seats?: number;
}

const INITIAL_TABLES: Table[] = [
  { id: 't1', code: 'HBD-BC-T04', location: 'Beta Courtyard · Bar · Hotel Beta Delhi · Seat…', status: 'available' },
  { id: 't2', code: 'HBD-BC-T01', location: 'Beta Courtyard · Indoor · Hotel Beta Delhi ·…', status: 'reserved', total: 1803, elapsed: '0h 2m' },
  { id: 't3', code: 'HBD-BC-T03', location: 'Beta Courtyard · Indoor · Hotel Beta Delhi ·…', status: 'available' },
  { id: 't4', code: 'HBD-BC-T05', location: 'Beta Courtyard · Indoor · Hotel Beta Delhi ·…', status: 'available', total: 2158, elapsed: '10h 5m' },
  { id: 't5', code: 'HBD-CB-T02', location: 'Capital Bar · Bar · Hotel Beta Delhi · Seats: 4', status: 'available' },
  { id: 't6', code: 'HBD-CB-T04', location: 'Capital Bar · Bar · Hotel Beta Delhi · Seats: 6', status: 'available' },
  { id: 't7', code: 'HBD-CB-T01', location: 'Capital Bar · Indoor · Hotel Beta Delhi · Seat…', status: 'reserved' },
  { id: 't8', code: 'HBD-BC-T06', location: 'Beta Courtyard · Indoor · Hotel Beta Delhi ·…', status: 'cleaning' },
  { id: 't9', code: 'HBD-CB-T03', location: 'Capital Bar · Bar · Hotel Beta Delhi · Seats: 3', status: 'available' },
];

const STATUS_BADGE: Record<TableStatus, string> = {
  available: 'bg-green-500/20 text-green-400 border border-green-500/30',
  occupied:  'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  reserved:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  cleaning:  'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

export default function TableBoard() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [refreshing, setRefreshing] = useState(false);

  const stats = {
    total: tables.length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    available: tables.filter(t => t.status === 'available').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  const setStatus = (id: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status, total: undefined, elapsed: undefined } : t));
  };

  const handleNewOrder = (id: string) => setStatus(id, 'occupied');
  const handleMarkCleaning = (id: string) => setStatus(id, 'cleaning');
  const handleCancel = (id: string) => setStatus(id, 'available');
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="w-full h-[600px] bg-neutral-100 dark:bg-[#0d1117] border border-black/10 dark:border-white/10 overflow-hidden flex flex-col font-sans shadow-2xl select-none rounded-none">
      {/* Topbar */}
      <div className="h-12 bg-white dark:bg-[#161b22] border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-neutral-900 dark:text-white text-xs">H</div>
          <span className="text-neutral-900 dark:text-white/40 text-xs">□</span>
          <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">/ Table Board</span>
        </div>
        <button onClick={handleRefresh} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-white border border-black/10 dark:border-white/10 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex border-b border-black/5 dark:border-white/5 shrink-0">
        {[
          { label: 'Total', val: stats.total },
          { label: 'Occupied', val: stats.occupied },
          { label: 'Available', val: stats.available },
          { label: 'Reserved', val: stats.reserved },
          { label: 'Cleaning', val: stats.cleaning },
        ].map((s) => (
          <div key={s.label} className="flex-1 px-4 py-3 border-r border-black/5 dark:border-white/5 last:border-r-0">
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{s.val}</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tables.map((table) => (
            <motion.div
              key={table.id}
              layout
              className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 p-3 flex flex-col gap-2"
            >
              {/* Status chip + code */}
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">{table.code}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 shrink-0 ${STATUS_BADGE[table.status]}`}>
                  {table.status}
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 dark:text-neutral-500 leading-tight">{table.location}</p>

              {/* If occupied/reserved show totals */}
              {table.total && (
                <div className="text-[10px] text-neutral-600 dark:text-neutral-400 border-t border-black/5 dark:border-white/5 pt-2">
                  <div className="flex justify-between"><span>Total</span><span className="text-neutral-900 dark:text-white">₹ {table.total.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Elapsed</span><span>{table.elapsed}</span></div>
                </div>
              )}

              {!table.total && <p className="text-[10px] text-neutral-600">No active order</p>}

              {/* Actions */}
              <div className="flex flex-col gap-1 pt-1">
                {table.status === 'available' && (
                  <>
                    <button onClick={() => handleNewOrder(table.id)} className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium py-1.5 transition-colors">New Order</button>
                    <button onClick={() => setStatus(table.id, 'reserved')} className="text-neutral-600 dark:text-neutral-400 hover:text-white text-[11px] py-1 transition-colors">Reserve</button>
                  </>
                )}
                {table.status === 'occupied' && (
                  <>
                    <button className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium py-1.5 transition-colors">Open POS</button>
                    <button onClick={() => handleMarkCleaning(table.id)} className="text-orange-400 hover:text-orange-300 text-[11px] py-1 transition-colors">Mark Cleaning</button>
                  </>
                )}
                {table.status === 'reserved' && (
                  <>
                    <button onClick={() => handleNewOrder(table.id)} className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium py-1.5 transition-colors">Seat & Order</button>
                    <button onClick={() => handleCancel(table.id)} className="text-neutral-600 dark:text-neutral-400 hover:text-white text-[11px] py-1 transition-colors">Cancel</button>
                  </>
                )}
                {table.status === 'cleaning' && (
                  <>
                    <button onClick={() => handleCancel(table.id)} className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium py-1.5 transition-colors">Mark Clean</button>
                    <button onClick={() => handleCancel(table.id)} className="text-neutral-600 dark:text-neutral-400 hover:text-white text-[11px] py-1 transition-colors">Cancel</button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
