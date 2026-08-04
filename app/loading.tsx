"use client";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useTheme } from "next-themes";

export default function Loading() {
  const { theme } = useTheme();
  return (
    <div className="h-dvh w-full fixed top-[50%] left-[50%]">
      <Ring
        size={50}
        speed={1.5}
        bgOpacity={0.25}
        color={theme == "dark" ? "white" : "black"}
      />
    </div>
  );
}
