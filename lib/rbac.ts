// ─── Role definitions ────────────────────────────────────────────────────────

export type Role =
  | "admin"
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "accountant"
  | "hr"
  | "reception";

// ─── Role display metadata ────────────────────────────────────────────────

export const ROLE_META: Record<Role, { label: string; color: string }> = {
  admin: { label: "Quan tri vien", color: "text-red-500 bg-red-500/10" },
  doctor: { label: "Bac si", color: "text-blue-500 bg-blue-500/10" },
  nurse: { label: "Dieu duong", color: "text-green-500 bg-green-500/10" },
  pharmacist: { label: "Duoc si", color: "text-purple-500 bg-purple-500/10" },
  accountant: { label: "Ke toan", color: "text-yellow-500 bg-yellow-500/10" },
  hr: { label: "Nhan su", color: "text-orange-500 bg-orange-500/10" },
  reception: { label: "Le tan", color: "text-cyan-500 bg-cyan-500/10" },
};

// ─── Role → Permissions mapping ─────────────────────────────────────────

export const PERMISSIONS: Record<Role, readonly string[]> = {
  admin: ["*"],
  hr: [
    "dashboard:view",
    "nhan-su:lich-kcb:view",
    "nhan-su:lich-kcb:upload",
    "nhan-su:danh-ba:view",
    "nhan-su:cham-cong:view",
    "nhan-su:cham-cong:edit",
    "nghiep-vu:quy-trinh:view",
    "nghiep-vu:tai-lieu:view",
  ],
  doctor: [
    "dashboard:view",
    "nghiep-vu:phac-do:view",
    "nghiep-vu:phac-do:create",
    "nghiep-vu:phac-do:edit",
    "nghiep-vu:ai:ask",
    "nghiep-vu:icd-10:view",
    "nghiep-vu:bhyt:view",
    "nghiep-vu:quy-trinh:view",
    "nghiep-vu:tai-lieu:view",
    "tra-cuu:thuoc:view",
    "tra-cuu:gia-dich-vu:view",
    "tra-cuu:ket-qua:view",
    "nhan-su:lich-kcb:view",
    "nhan-su:danh-ba:view",
  ],
  pharmacist: [
    "dashboard:view",
    "nghiep-vu:icd-10:view",
    "nghiep-vu:bhyt:view",
    "nghiep-vu:quy-trinh:view",
    "nghiep-vu:tai-lieu:view",
    "tra-cuu:thuoc:view",
    "tra-cuu:gia-dich-vu:view",
    "nhan-su:danh-ba:view",
  ],
  accountant: [
    "dashboard:view",
    "nghiep-vu:bhyt:view",
    "nghiep-vu:quy-trinh:view",
    "nghiep-vu:tai-lieu:view",
    "tra-cuu:gia-dich-vu:view",
    "nhan-su:danh-ba:view",
  ],
  nurse: [
    "dashboard:view",
    "nghiep-vu:phac-do:view",
    "nghiep-vu:icd-10:view",
    "nghiep-vu:bhyt:view",
    "nghiep-vu:quy-trinh:view",
    "nghiep-vu:tai-lieu:view",
    "tra-cuu:thuoc:view",
    "tra-cuu:gia-dich-vu:view",
    "tra-cuu:ket-qua:view",
    "nhan-su:lich-kcb:view",
    "nhan-su:danh-ba:view",
  ],
  reception: [
    "dashboard:view",
    "nghiep-vu:bhyt:view",
    "tra-cuu:gia-dich-vu:view",
    "tra-cuu:ket-qua:view",
    "nhan-su:lich-kcb:view",
    "nhan-su:danh-ba:view",
  ],
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────

// RBAC disabled — all authenticated users have admin-level access.
// These helpers always return true; useRole() in useAuth.tsx forces role to "admin".
export function hasPermission(_role: Role, _action: string): boolean {
  return true;
}

export function hasAnyPermission(_role: Role, _actions: string[]): boolean {
  return true;
}

export function hasAllPermissions(_role: Role, _actions: string[]): boolean {
  return true;
}
