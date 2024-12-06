"use client";

import { useState } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleSidebar };
}
