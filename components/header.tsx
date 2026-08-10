'use client';

import { Home, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { DarkModeToggle } from './darkmode';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full md:h-40 px-2 md:px-8 py-3 flex items-center justify-between ">
      {/* Brand Badge with Home Navigation */}
      <div className="pointer-events-auto bg-[#18181B]/90 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-zinc-800 flex items-center gap-3">
        <Link
          href="/"
          className="w-8 h-8 rounded-xl  text-zinc-950 flex items-center justify-center font-black transition-transform active:scale-95 p-1"
          title="Return to Home Landing Page"
        >
          <Image src="/vercel.ico" width={80} height={80} alt="" />
        </Link>

        <div>
          <h1 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 text-white">
            Leeto Pele Transport
          </h1>
        </div>
      </div>

      <div className="p-2 flex flex-row gap-2">
        {theme == 'dark' ? (
          <button
            className={
              'cursor-pointer flex flex-row items-center justify-center gap-2'
            }
            onClick={() => setTheme('light')}
          >
            <Sun /> light
          </button>
        ) : (
          <button
            className={
              'cursor-pointer flex flex-row items-center justify-center gap-2'
            }
            onClick={() => {
              if (theme == 'dark') {
                console.log('Already dark mode');
              }
              setTheme('dark');
            }}
          >
            <Moon /> dark
          </button>
        )}
      </div>
    </header>
  );
}
