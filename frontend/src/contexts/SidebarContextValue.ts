import { createContext } from 'react';

export interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
