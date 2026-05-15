import type { Role } from "./rbac";

export type { Role };

export interface User {
  id: string;
  username: string;
  fullName: string;
  title: string;
  department: string;
  role: Role;
  avatar?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  description?: string;
}

export interface NavGroup {
  title: string;
  icon: string;
  items: NavItem[];
  collapsible?: boolean;
}

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: "page" | "patient" | "medicine" | "service";
}

export interface ClinicInfo {
  name: string;
  shortName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: string;
}

export interface StatCard {
  title: string;
  value: string;
  change?: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  action: string;
  user: string;
  time: string;
  type: "success" | "info" | "warning";
}

export interface Appointment {
  name: string;
  time: string;
  date: string;
  reason: string;
}
