"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";

export default function CryptoWidget() {
  const [prices, setPrices] = useState({ btc: 0, usdt: 0 });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices({
          btc: data.bitcoin.usd,
          usdt: data.tether.usd,
        });
      } catch (error) {
        console.error("코인 가격을 불러오지 못했습니다.", error);
      }
    };

    fetchPrices();
    // 60초(60000ms)마다 가격을 새로고침
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // 가격을 불러오기 전에는 렌더링하지 않음 (깔끔한 UI 유지)
  if (!prices.btc) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-40 glass-gold px-4 py-2.5 rounded-full flex items-center gap-4 border border-gold/20 shadow-lg"
    >
      {/* 비트코인 */}
      <div className="flex items-center gap-1.5">
        <Bitcoin className="w-3.5 h-3.5 text-gold" strokeWidth={2} />
        <span className="text-[10px] font-mono text-white/80 tracking-widest">
          ${prices.btc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      {/* 구분선 */}
      <div className="w-px h-3 bg-white/20" />
      
      {/* 테더 */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-mono text-[#26A17B] font-bold">₮</span>
        <span className="text-[10px] font-mono text-white/80 tracking-widest">
          ${prices.usdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </motion.div>
  );
}
