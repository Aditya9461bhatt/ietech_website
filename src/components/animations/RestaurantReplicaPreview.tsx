import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer2, Search, Bell, Home, LayoutDashboard, 
  ShoppingCart, UtensilsCrossed, Package, Settings, Users,
  CheckCircle2, Clock
} from 'lucide-react';

const RESTAURANT_AUTOPLAY_MS = 6200;

type RestaurantSceneId = 'pos' | 'kitchen' | 'inventory';

interface RestaurantScene {
  id: RestaurantSceneId;
  label: string;
}

const RESTAURANT_SCENES: RestaurantScene[] = [
  { id: 'pos', label: 'POS Terminal' },
  { id: 'kitchen', label: 'Kitchen Display' },
  { id: 'inventory', label: 'Stock Manager' },
];

const RESTAURANT_RAIL_ICONS = [Search, Bell, Home, LayoutDashboard, UtensilsCrossed, ShoppingCart, Package, Settings];

const RESTAURANT_CURSOR_PATHS: Record<RestaurantSceneId, Array<{ x: number; y: number; click?: boolean }>> = {
  pos: [
    { x: 15, y: 35, click: true },
    { x: 45, y: 35, click: true },
    { x: 80, y: 70, click: true },
    { x: 80, y: 90, click: true },
  ],
  kitchen: [
    { x: 25, y: 35, click: true },
    { x: 25, y: 70, click: true },
    { x: 65, y: 35, click: true },
    { x: 65, y: 70, click: true },
  ],
  inventory: [
    { x: 20, y: 32, click: true },
    { x: 81, y: 43, click: true },
    { x: 57, y: 52, click: true },
    { x: 20, y: 63, click: true },
  ],
};

function PosScene() {
  const [activeRail, setActiveRail] = useState(4);
  const items = [
    { name: 'Caesar Salad', price: '₹295' },
    { name: 'Truffle Fries', price: '₹185' },
    { name: 'Margherita', price: '₹345' },
    { name: 'Pasta Al Forno', price: '₹425' },
  ];
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCartCount(c => (c + 1) % 4), 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid h-full grid-cols-[34px_minmax(0,1fr)] bg-[#f7f8fa] dark:bg-neutral-100 dark:bg-[#0d1117]">
      <aside className="flex flex-col border-r border-[#e0e4ea] bg-[#f4f5f8] px-1 py-2 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22]">
        <div className="grid place-items-center">
          <div className="grid h-5 w-5 place-items-center rounded-sm bg-[#ea580c] text-neutral-900 dark:text-white">
            <UtensilsCrossed className="h-3 w-3" />
          </div>
        </div>

        <div className="mt-2 space-y-1">
          {RESTAURANT_RAIL_ICONS.map((Icon, index) => (
            <button
              key={`rail-${index}`}
              className={`grid w-full place-items-center rounded-sm p-1 ${activeRail === index
                ? 'bg-[#e6ebf3] text-[#3f4f66] dark:bg-neutral-100 dark:bg-[#1c2333] dark:text-neutral-900 dark:text-[#c9d1d9]'
                : 'text-[#7a8597] transition-colors dark:text-neutral-500 dark:text-[#8b949e]'
                }`}
            >
              <Icon className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>
      </aside>

      <div className="flex h-full min-w-0">
        <div className="flex-1 p-2.5 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-[#667487] dark:text-neutral-500 dark:text-[#8b949e] font-semibold">/ Point of Sale / Main Menu</p>
            <div className="flex gap-1">
              <button className="bg-[#e7edf7] text-[#30435e] dark:bg-neutral-100 dark:bg-[#1c2333] dark:text-neutral-900 dark:text-[#c9d1d9] px-1.5 py-0.5 rounded-sm text-[8px]">Food</button>
              <button className="text-[#7787a0] dark:text-neutral-500 dark:text-[#8b949e] px-1.5 py-0.5 rounded-sm text-[8px]">Drinks</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {items.map((item, i) => (
              <div key={i} className="rounded-sm border border-[#dce2ec] bg-white p-2 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22] flex flex-col justify-between">
                <p className="text-[10px] font-medium text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">{item.name}</p>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-[9px] text-[#ea580c] font-semibold">{item.price}</p>
                  <div className="h-4 w-4 bg-[#f0f2f6] dark:bg-neutral-50 dark:bg-[#21262d] rounded-sm flex items-center justify-center">
                    <span className="text-[10px]">+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[120px] bg-white dark:bg-white dark:bg-[#161b22] border-l border-[#e0e4ea] dark:border-neutral-200 dark:border-[#21262d] flex flex-col shrink-0">
          <div className="p-2 border-b border-[#e0e4ea] dark:border-neutral-200 dark:border-[#21262d]">
            <p className="text-[9px] font-semibold text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">Current Order</p>
            <p className="text-[7px] text-[#7a8597] dark:text-neutral-500 dark:text-[#8b949e]">Table 12 · Dine In</p>
          </div>
          
          <div className="flex-1 p-2 space-y-2">
            {[...Array(cartCount || 1)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="text-[8px] text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3] truncate max-w-[60px]">{items[i % 4].name}</p>
                  <p className="text-[7px] text-[#7a8597] dark:text-neutral-500 dark:text-[#8b949e]">1 x {items[i % 4].price}</p>
                </div>
                <p className="text-[8px] font-semibold text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">{items[i % 4].price}</p>
              </div>
            ))}
          </div>

          <div className="p-2 bg-[#f4f5f8] dark:bg-neutral-100 dark:bg-[#0d1117] mt-auto">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[8px] text-[#7a8597] dark:text-neutral-500 dark:text-[#8b949e]">Total</p>
              <p className="text-[10px] font-bold text-[#ea580c]">₹{((cartCount || 1) * 300)}</p>
            </div>
            <button className="w-full bg-[#ea580c] text-white rounded-sm text-[8px] py-1 font-semibold">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KitchenScene() {
  const [activeRail] = useState(5);
  
  return (
    <div className="grid h-full grid-cols-[34px_minmax(0,1fr)] bg-[#f7f8fa] dark:bg-neutral-100 dark:bg-[#0d1117]">
      <aside className="flex flex-col border-r border-[#e0e4ea] bg-[#f4f5f8] px-1 py-2 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22]">
        <div className="grid place-items-center">
          <div className="grid h-5 w-5 place-items-center rounded-sm bg-[#ea580c] text-neutral-900 dark:text-white">
            <UtensilsCrossed className="h-3 w-3" />
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {RESTAURANT_RAIL_ICONS.map((Icon, index) => (
            <button
              key={`rail-${index}`}
              className={`grid w-full place-items-center rounded-sm p-1 ${activeRail === index
                ? 'bg-[#e6ebf3] text-[#3f4f66] dark:bg-neutral-100 dark:bg-[#1c2333] dark:text-neutral-900 dark:text-[#c9d1d9]'
                : 'text-[#7a8597] transition-colors dark:text-neutral-500 dark:text-[#8b949e]'
                }`}
            >
              <Icon className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>
      </aside>

      <div className="p-2.5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] text-[#667487] dark:text-neutral-500 dark:text-[#8b949e] font-semibold">/ Kitchen Display / Orders</p>
          <div className="flex gap-2 text-[8px]">
            <span className="flex items-center gap-1 text-[#ea580c]"><Clock className="w-2.5 h-2.5"/> 2 Pending</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-sm border border-[#eab308]/50 bg-white dark:bg-white dark:bg-[#161b22] dark:border-[#eab308]/30 overflow-hidden">
            <div className="bg-[#fef08a] dark:bg-[#ca8a04]/20 p-1.5 flex justify-between items-center border-b border-[#eab308]/20">
              <span className="text-[9px] font-bold text-[#854d0e] dark:text-[#fde047]">T-12 · Dine In</span>
              <span className="text-[8px] text-[#854d0e] dark:text-[#fde047]">04:20</span>
            </div>
            <div className="p-2 space-y-1.5">
              <div className="flex items-start gap-1">
                <span className="text-[9px] font-bold text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">1x</span>
                <span className="text-[9px] text-[#4b5563] dark:text-[#9ca3af]">Caesar Salad (No Croutons)</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[9px] font-bold text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">2x</span>
                <span className="text-[9px] text-[#4b5563] dark:text-[#9ca3af]">Pasta Al Forno</span>
              </div>
            </div>
            <div className="p-1.5 flex justify-end">
              <button className="bg-[#10b981] text-white px-2 py-0.5 rounded-sm text-[8px] flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Done
              </button>
            </div>
          </div>
          
          <div className="rounded-sm border border-[#dce2ec] bg-white dark:bg-white dark:bg-[#161b22] dark:border-neutral-200 dark:border-[#21262d] overflow-hidden">
            <div className="bg-[#f3f4f6] dark:bg-[#1f2937] p-1.5 flex justify-between items-center border-b border-[#e5e7eb] dark:border-neutral-300 dark:border-[#374151]">
              <span className="text-[9px] font-bold text-[#374151] dark:text-[#d1d5db]">W-05 · Takeaway</span>
              <span className="text-[8px] text-[#6b7280] dark:text-[#9ca3af]">00:45</span>
            </div>
            <div className="p-2 space-y-1.5">
              <div className="flex items-start gap-1">
                <span className="text-[9px] font-bold text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]">1x</span>
                <span className="text-[9px] text-[#4b5563] dark:text-[#9ca3af]">Margherita</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryScene() {
  const [activeRail] = useState(6);
  
  return (
    <div className="grid h-full grid-cols-[34px_minmax(0,1fr)] bg-[#f7f8fa] dark:bg-neutral-100 dark:bg-[#0d1117]">
      <aside className="flex flex-col border-r border-[#e0e4ea] bg-[#f4f5f8] px-1 py-2 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22]">
        <div className="grid place-items-center">
          <div className="grid h-5 w-5 place-items-center rounded-sm bg-[#ea580c] text-neutral-900 dark:text-white">
            <UtensilsCrossed className="h-3 w-3" />
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {RESTAURANT_RAIL_ICONS.map((Icon, index) => (
            <button
              key={`rail-${index}`}
              className={`grid w-full place-items-center rounded-sm p-1 ${activeRail === index
                ? 'bg-[#e6ebf3] text-[#3f4f66] dark:bg-neutral-100 dark:bg-[#1c2333] dark:text-neutral-900 dark:text-[#c9d1d9]'
                : 'text-[#7a8597] transition-colors dark:text-neutral-500 dark:text-[#8b949e]'
                }`}
            >
              <Icon className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>
      </aside>

      <div className="p-2.5 flex flex-col">
        <p className="text-[10px] text-[#667487] dark:text-neutral-500 dark:text-[#8b949e] font-semibold mb-2">/ Inventory / Low Stock</p>
        
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {['Tomatoes (kg)', 'Mozzarella (kg)', 'Flour (kg)'].map((label, i) => (
             <div key={label} className="rounded-sm border border-[#dce2ec] bg-white px-2 py-1.5 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22]">
               <p className="text-[8px] text-[#77849a] dark:text-neutral-500 dark:text-[#8b949e]">{label}</p>
               <p className={`mt-0.5 text-[11px] font-semibold ${i === 0 ? 'text-[#ef4444]' : 'text-[#2e3645] dark:text-neutral-900 dark:text-[#e6edf3]'}`}>
                 {i === 0 ? '2.5 / 10' : '15.0 / 20'}
               </p>
             </div>
          ))}
        </div>

        <div className="flex-1 rounded-sm border border-[#dce2ec] bg-white p-2 dark:border-neutral-200 dark:border-[#21262d] dark:bg-white dark:bg-[#161b22]">
           <div className="flex justify-between items-center border-b border-[#e5e7eb] dark:border-neutral-300 dark:border-[#374151] pb-1 mb-1">
             <span className="text-[9px] font-semibold text-[#374151] dark:text-[#d1d5db]">Pending Purchase Orders</span>
             <span className="text-[8px] bg-[#3b82f6] text-neutral-900 dark:text-white px-1.5 py-0.5 rounded-sm">New PO</span>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between text-[8px] py-1 text-[#4b5563] dark:text-[#9ca3af]">
               <span>PO-0294</span>
               <span>Fresh Produce Supplier</span>
               <span className="text-[#f59e0b]">Sent</span>
             </div>
             <div className="flex justify-between text-[8px] py-1 text-[#4b5563] dark:text-[#9ca3af]">
               <span>PO-0293</span>
               <span>Dairy Dist.</span>
               <span className="text-[#10b981]">Received</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantReplicaPreview() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSceneIndex((current) => (current + 1) % RESTAURANT_SCENES.length);
    }, RESTAURANT_AUTOPLAY_MS);
    return () => window.clearInterval(interval);
  }, []);

  const activeScene = RESTAURANT_SCENES[activeSceneIndex];
  const cursorPath = RESTAURANT_CURSOR_PATHS[activeScene.id];
  const cursorPoint = cursorPath[cursorIndex % cursorPath.length];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCursorIndex((current) => (current + 1) % cursorPath.length);
    }, 1600);
    return () => window.clearInterval(interval);
  }, [activeScene.id, cursorPath.length]);

  return (
    <div
      className="relative mx-auto h-full w-full overflow-hidden bg-[#f6f7f9] dark:bg-neutral-100 dark:bg-[#0d1117]"
      style={{ fontFamily: 'Inter, "Segoe UI", "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0 z-20">
        <motion.div
          animate={{ left: `${cursorPoint.x}%`, top: `${cursorPoint.y}%` }}
          transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.5 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <MousePointer2 className="h-4 w-4 text-[#161d29] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] dark:text-neutral-900 dark:text-white" />
            {cursorPoint.click && (
              <motion.span
                key={`${activeScene.id}-${cursorIndex}`}
                initial={{ opacity: 0.7, scale: 0.35 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 0.42, ease: 'easeOut' }}
                className="absolute left-2 top-1.5 h-2.5 w-2.5 rounded-full border border-[#ea580c]"
              />
            )}
          </div>
        </motion.div>
      </div>

      <div className="h-full w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.15 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeScene.id === 'pos' && <PosScene />}
            {activeScene.id === 'kitchen' && <KitchenScene />}
            {activeScene.id === 'inventory' && <InventoryScene />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
