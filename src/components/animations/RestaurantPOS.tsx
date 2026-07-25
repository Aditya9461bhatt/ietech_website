import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Bell, Menu, Plus, Minus, Trash2 } from 'lucide-react';

const MENU_ITEMS = [
  { abbr: "VM", name: "Virgin Mojito", price: 220, cat: 'drink', color: 'bg-green-500/20 text-green-400' },
  { abbr: "C", name: "Cappuccino", price: 180, cat: 'drink', color: 'bg-orange-500/20 text-orange-400' },
  { abbr: "MC", name: "Masala Chai", price: 70, cat: 'drink', color: 'bg-amber-500/20 text-amber-400' },
  { abbr: "CS", name: "Caesar Salad", price: 295, cat: 'food', color: 'bg-green-400/20 text-green-300' },
  { abbr: "CT", name: "Chicken Tikka Platter", price: 425, cat: 'food', color: 'bg-red-500/20 text-red-400' },
  { abbr: "BB", name: "Breakfast Buffet", price: 899, cat: 'food', color: 'bg-yellow-500/20 text-yellow-400' },
  { abbr: "BC", name: "Baked Cheesecake", price: 245, cat: 'dessert', color: 'bg-pink-500/20 text-pink-400' },
  { abbr: "CM", name: "Chocolate Mousse", price: 240, cat: 'dessert', color: 'bg-amber-700/20 text-amber-500' },
  { abbr: "HB", name: "Hyderabadi Biryani", price: 545, cat: 'food', color: 'bg-orange-600/20 text-orange-500' },
];

export default function RestaurantPOS() {
  const [cart, setCart] = useState<{item: typeof MENU_ITEMS[0], qty: number}[]>([
    { item: MENU_ITEMS[0], qty: 2 },
    { item: MENU_ITEMS[4], qty: 1 }
  ]);
  const [search, setSearch] = useState('');

  const filteredItems = MENU_ITEMS.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  const tax = total * 0.05; // 5% GST

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.abbr === item.abbr);
      if (existing) {
        return prev.map(p => p.item.abbr === item.abbr ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (abbr: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.item.abbr === abbr) {
        const newQty = Math.max(0, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }).filter(p => p.qty > 0));
  };

  return (
    <div className="w-full h-[600px] bg-neutral-100 dark:bg-[#0d1117] rounded-none border border-black/10 dark:border-white/10 overflow-hidden flex flex-col font-sans shadow-2xl relative select-none">
      {/* POS Top Bar */}
      <div className="h-14 bg-white dark:bg-[#161b22] border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-neutral-900 dark:text-white text-sm">
            CB
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-900 dark:text-white text-sm font-semibold tracking-wide">SIM HBD Cedar Bar POS</span>
            <span className="text-neutral-600 dark:text-neutral-500 text-[10px]">pos.cb.hbd@simgrandeur.example.com</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <Bell className="w-4 h-4 hover:text-neutral-900 dark:text-white cursor-pointer transition-colors" />
          <User className="w-4 h-4 hover:text-neutral-900 dark:text-white cursor-pointer transition-colors" />
          <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
          <Menu className="w-4 h-4 hover:text-neutral-900 dark:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Menu Grid */}
        <div className="flex-1 flex flex-col bg-neutral-100 dark:bg-[#0d1117]">
          {/* Search Bar */}
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search by item code, serial number or barcode..." 
                className="w-full bg-white dark:bg-[#161b22] border border-black/10 dark:border-white/10 rounded-sm py-2 pl-9 pr-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 rounded-sm bg-black/10 dark:bg-white/10 text-white text-xs font-medium">All Items</button>
              <button className="px-3 py-1 rounded-sm bg-transparent hover:bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 text-xs font-medium transition-colors">Food</button>
              <button className="px-3 py-1 rounded-sm bg-transparent hover:bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 text-xs font-medium transition-colors">Drinks</button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4 pt-2 custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.abbr}
                    onClick={() => addToCart(item)}
                    className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 hover:border-orange-500/30 rounded-sm p-3 cursor-pointer transition-colors group flex flex-col justify-between aspect-square max-h-[140px]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm ${item.color}`}>
                        {item.abbr}
                      </div>
                      <span className="text-neutral-900 dark:text-white/40 text-[10px] uppercase font-bold tracking-wider">{item.cat}</span>
                    </div>
                    <div>
                      <h4 className="text-neutral-200 text-sm font-medium leading-tight group-hover:text-neutral-900 dark:text-white transition-colors">{item.name}</h4>
                      <p className="text-orange-400 font-semibold text-sm mt-1">₹{item.price}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side - Cart/Invoice */}
        <div className="w-[320px] bg-white dark:bg-[#161b22] border-l border-black/5 dark:border-white/5 flex flex-col shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
            <h3 className="text-neutral-900 dark:text-white font-semibold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              Current Order
            </h3>
            <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Dine In</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
            <AnimatePresence>
              {cart.map(c => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={c.item.abbr}
                  className="bg-neutral-100 dark:bg-[#0d1117] border border-black/5 dark:border-white/5 rounded-sm p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-neutral-200 font-medium truncate pr-2">{c.item.name}</span>
                    <span className="text-sm text-neutral-900 dark:text-white font-semibold">₹{c.item.price * c.qty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-500">₹{c.item.price} / ea</span>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#161b22] rounded-sm border border-black/5 dark:border-white/5 px-2 py-1">
                      <button onClick={() => updateQty(c.item.abbr, -1)} className="text-neutral-600 dark:text-neutral-400 hover:text-white">
                        {c.qty === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{c.qty}</span>
                      <button onClick={() => updateQty(c.item.abbr, 1)} className="text-neutral-600 dark:text-neutral-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-500 gap-2 h-40">
                <ShoppingCart className="w-8 h-8 opacity-20" />
                <span className="text-sm">Cart is empty</span>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="bg-neutral-100 dark:bg-[#0d1117] p-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-2 shrink-0">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>Tax (5% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-black/5 dark:bg-white/5 my-1" />
            <div className="flex justify-between items-end mb-4">
              <span className="text-neutral-200 font-medium">Total</span>
              <span className="text-xl text-neutral-900 dark:text-white font-bold">₹{(total + tax).toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 text-white font-medium py-2 rounded-sm transition-colors text-sm border border-black/10 dark:border-white/10">Save Order</button>
              <button className="flex-[2] bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold py-2 rounded-sm transition-colors text-sm shadow-[0_0_15px_rgba(249,115,22,0.3)]">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
