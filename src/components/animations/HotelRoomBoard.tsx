import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, MoreHorizontal, Plus } from 'lucide-react';

type RoomStatus = 'occupied' | 'available' | 'maintenance' | 'dirty';
type HousekeepingStatus = 'Clean' | 'Inspected' | 'Dirty' | 'Out of Order';

interface Room {
  id: string;
  code: string;
  type: string;
  floor: string;
  hotel: string;
  status: RoomStatus;
  guest?: string;
  stayDate?: string;
  housekeeping: HousekeepingStatus;
  booking?: string;
}

const ROOMS: Room[] = [
  { id: 'r101', code: 'HAM-101', type: 'Demo Deluxe King', floor: 'Floor 1', hotel: 'Hotel Alpha Mumbai', status: 'occupied',  guest: 'Demo Guest 001', stayDate: '2026-03-07 to 03-09', housekeeping: 'Clean',     booking: 'BKG-2028-00001' },
  { id: 'r102', code: 'HAM-102', type: 'SIM HAM Deluxe King', floor: 'Floor 1', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Inspected', booking: 'None' },
  { id: 'r103', code: 'HAM-103', type: 'SIM HAM Deluxe King', floor: 'Floor 1', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Clean',     booking: 'None' },
  { id: 'r104', code: 'HAM-104', type: 'SIM HAM Deluxe King', floor: 'Floor 1', hotel: 'Hotel Alpha Mumbai', status: 'occupied',  guest: 'Arjun Menon',  stayDate: '2026-03-05 to 03-09', housekeeping: 'Clean',     booking: 'BKG-2026-00013' },
  { id: 'r201', code: 'HAM-201', type: 'SIM HAM Premium Twin', floor: 'Floor 2', hotel: 'Hotel Alpha Mumbai', status: 'occupied',  guest: 'Diya Verma',   stayDate: '2026-03-06 to 03-10', housekeeping: 'Clean',     booking: 'BKG-2026-00014' },
  { id: 'r202', code: 'HAM-202', type: 'SIM HAM Premium Twin', floor: 'Floor 2', hotel: 'Hotel Alpha Mumbai', status: 'occupied',  guest: 'Aditya Patel', stayDate: '2026-03-07 to 03-09', housekeeping: 'Clean',     booking: 'BKG-2026-00006' },
  { id: 'r203', code: 'HAM-203', type: 'SIM HAM Premium Twin', floor: 'Floor 2', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Clean',     booking: 'None' },
  { id: 'r204', code: 'HAM-204', type: 'SIM HAM Premium Twin', floor: 'Floor 2', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Inspected', booking: 'None' },
  { id: 'r301', code: 'HAM-301', type: 'SIM HAM Executive Suite', floor: 'Floor 3', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Clean',     booking: 'None' },
  { id: 'r302', code: 'HAM-302', type: 'SIM HAM Executive Suite', floor: 'Floor 3', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Inspected', booking: 'None' },
  { id: 'r401', code: 'HAM-401', type: 'SIM HAM Family Studio', floor: 'Floor 4', hotel: 'Hotel Alpha Mumbai', status: 'maintenance', housekeeping: 'Out of Order', booking: 'None' },
  { id: 'r402', code: 'HAM-402', type: 'SIM HAM Family Studio', floor: 'Floor 4', hotel: 'Hotel Alpha Mumbai', status: 'available',  housekeeping: 'Dirty',     booking: 'None' },
];

const STATUS_STYLE: Record<RoomStatus, string> = {
  occupied:    'bg-red-500/20 text-red-400 border border-red-500/30',
  available:   'bg-green-500/20 text-green-400 border border-green-500/30',
  maintenance: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  dirty:       'bg-neutral-500/20 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30',
};

const HK_STYLE: Record<HousekeepingStatus, string> = {
  'Clean':        'text-green-400',
  'Inspected':    'text-blue-400',
  'Dirty':        'text-red-400',
  'Out of Order': 'text-orange-400',
};

const NAV_ITEMS = ['Operations Center', 'Guest Profile', 'Hotel Booking', 'Room Folio'];

export default function HotelRoomBoard() {
  const [activeNav, setActiveNav] = useState('Room Board');
  const stats = {
    rooms: ROOMS.length,
    occupied: ROOMS.filter(r => r.status === 'occupied').length,
    reserved: 0,
    available: ROOMS.filter(r => r.status === 'available').length,
    maintenance: ROOMS.filter(r => r.status === 'maintenance').length,
    dirty: ROOMS.filter(r => r.housekeeping === 'Dirty').length,
  };

  return (
    <div className="w-full h-[600px] bg-neutral-100 dark:bg-[#0d1117] border border-black/10 dark:border-white/10 overflow-hidden flex font-sans shadow-2xl select-none rounded-none">

      {/* Sidebar */}
      <div className="w-[180px] bg-white dark:bg-[#161b22] border-r border-black/5 dark:border-white/5 flex flex-col shrink-0">
        <div className="p-3 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center font-bold text-neutral-900 dark:text-white text-xs">H</div>
            <div>
              <p className="text-neutral-900 dark:text-white text-[12px] font-bold leading-tight">Hospitality</p>
              <p className="text-neutral-600 dark:text-neutral-500 text-[10px]">Hospitality</p>
            </div>
          </div>
        </div>

        <div className="px-2 py-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-2 px-2 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:bg-white/5 cursor-pointer">
            <Search className="w-3 h-3" />
            <span className="text-[12px]">Search</span>
            <span className="ml-auto text-[9px] text-neutral-600">Ctrl+K</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:bg-white/5 cursor-pointer">
            <Bell className="w-3 h-3" />
            <span className="text-[12px]">Notification</span>
          </div>
        </div>

        <div className="flex-1 px-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`w-full text-left flex items-center px-2 py-1.5 text-[12px] transition-colors ${activeNav === item ? 'bg-black/10 dark:bg-white/10 text-white font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:bg-white/5 hover:text-neutral-200'}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="p-2 border-t border-black/5 dark:border-white/5">
          <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 px-2">Reports</div>
          <button
            onClick={() => setActiveNav('Room Board')}
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 text-[12px] transition-colors ${activeNav === 'Room Board' ? 'bg-black/10 dark:bg-white/10 text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:bg-white/5'}`}
          >
            <span className="w-3 h-3 text-neutral-600 dark:text-neutral-500">⊞</span>
            Room Board
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-12 bg-white dark:bg-[#161b22]/50 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 text-xs">□</span>
            <span className="text-neutral-200 text-sm font-medium">/ Room Board</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-neutral-600 dark:text-neutral-400 hover:text-white p-1"><MoreHorizontal className="w-4 h-4" /></button>
            <button className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 px-2.5 py-1.5 hover:bg-black/5 dark:bg-white/5 transition-colors">
              ☰ Room List
            </button>
            <button className="flex items-center gap-1.5 text-xs text-white bg-black/10 dark:bg-white/10 hover:bg-white/20 px-2.5 py-1.5 transition-colors border border-black/10 dark:border-white/10">
              <Plus className="w-3 h-3" /> New Booking
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex border-b border-black/5 dark:border-white/5 shrink-0">
          {[
            { label: 'Rooms', val: stats.rooms },
            { label: 'Occupied', val: stats.occupied },
            { label: 'Reserved', val: stats.reserved },
            { label: 'Available', val: stats.available },
            { label: 'Maintenance', val: stats.maintenance },
            { label: 'Dirty HK', val: stats.dirty },
          ].map((s) => (
            <div key={s.label} className="flex-1 px-3 py-2.5 border-r border-black/5 dark:border-white/5 last:border-r-0">
              <p className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">{s.val}</p>
              <p className="text-[10px] text-neutral-600 dark:text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Room Grid */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ROOMS.map((room) => (
              <motion.div
                key={room.id}
                layout
                className="bg-white dark:bg-[#161b22] border border-black/5 dark:border-white/5 p-2.5 flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">{room.code}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 shrink-0 ${STATUS_STYLE[room.status]}`}>
                    {room.status}
                  </span>
                </div>
                <p className="text-[9px] text-neutral-600 dark:text-neutral-500 leading-snug">{room.type} · {room.floor} · {room.hotel}</p>
                <p className="text-[10px] text-neutral-700 dark:text-neutral-300 font-medium">
                  {room.guest || <span className="text-neutral-600">No active stay</span>}
                </p>
                {room.stayDate && <p className="text-[9px] text-neutral-600">{room.stayDate}</p>}
                {!room.stayDate && <p className="text-[9px] text-neutral-600">Ready to sell</p>}
                <div className="flex justify-between text-[9px] mt-0.5">
                  <span className="text-neutral-600 dark:text-neutral-500">Housekeeping</span>
                  <span className={HK_STYLE[room.housekeeping]}>{room.housekeeping}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-neutral-600 dark:text-neutral-500">Booking</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{room.booking}</span>
                </div>
                <div className="flex flex-col gap-1 mt-1 pt-1.5 border-t border-black/5 dark:border-white/5">
                  {room.status === 'occupied' ? (
                    <>
                      <button className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium py-1 transition-colors">Open Booking</button>
                      <button className="text-neutral-600 dark:text-neutral-400 hover:text-white text-[10px] py-0.5 transition-colors">Check Out</button>
                    </>
                  ) : (
                    <>
                      <button className="bg-black/10 dark:bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium py-1 transition-colors">Check In</button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="h-8 bg-white dark:bg-[#161b22] border-t border-black/5 dark:border-white/5 flex items-center justify-end px-4 shrink-0">
          <span className="text-[10px] text-neutral-600 dark:text-neutral-500 flex items-center gap-1.5">
            <span className="text-neutral-900 dark:text-white/40">⊞</span>
            HOTEL FRONT DESK 3/3
          </span>
        </div>
      </div>
    </div>
  );
}
