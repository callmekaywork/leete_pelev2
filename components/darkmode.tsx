'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger className={''}>
    //     {theme == 'dark' ? (
    //       <Moon className=" h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    //     ) : theme == 'system' ? (
    //       <Moon className=" h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    //     ) : (
    //       <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    //     )}
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="start">
    //     <DropdownMenuItem onClick={() => setTheme('light')}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('dark')}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('system')}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div>
      <Button
        className={'cursor-pointer'}
        onClick={() => {
          if (theme == 'dark') {
            console.log('Already dark mode');
          }
          setTheme('dark');
        }}
      >
        dark
      </Button>
      <Button onClick={() => setTheme('light')}>light</Button>
    </div>
  );
}
