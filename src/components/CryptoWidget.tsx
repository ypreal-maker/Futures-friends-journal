"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";

export default function CryptoWidget() {
  const [prices, setPrices] = useState({ btc: 0, usdtKrw: 0 });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // 💡 usd와 krw를 동시에 가져오도록 API 주소 변경
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd,krw"
        );
        const data = await res.json();
        setPrices({
          btc: data.bitcoin.usd,
          usdtKrw: data.tether.krw, // 테더는 원화(krw) 저장
        });
      } catch (error) {
        console.error("코인 가격을 불러오지 못했습니다.", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!prices.btc) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-40 bg-white/40 dark:bg-white/[0.03] backdrop-blur-[20px] px-4 py-2.5 rounded-full flex items-center gap-4 border border-black/5 dark:border-white/[0.06] shadow-lg"
    >
      {/* 비트코인 (USD) */}
      <div className="flex items-center gap-1.5">
        <Bitcoin className="w-3.5 h-3.5 text-gold" strokeWidth={2} />
        <span className="text-[10px] font-mono text-black/70 dark:text-white/80 tracking-widest">
          ${prices.btc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      {/* 구분선 */}
      <div className="w-px h-3 bg-black/10 dark:bg-white/20" />
      
      {/* 테더 (KRW) */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-mono text-[#26A17B] font-bold">₮</span>
        <span className="text-[10px] font-mono text-black/70 dark:text-white/80 tracking-widest">
          ₩{prices.usdtKrw.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
    </motion.div>
  );
}
