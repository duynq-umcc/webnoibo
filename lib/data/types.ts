export type DocType = "luat" | "nghi-dinh" | "thong-tu" | "cong-van" | "huong-dan-noi-bo";
export type DocStatus = "con-hieu-luc" | "moi" | "het-hieu-luc";

export interface Category {
  id: string;
  label: string;
  count?: number;
}

export interface Document {
  id: string;
  type: DocType;
  typeLabel: string;
  name: string;
  code: string;
  issuedDate: string;
  effectiveDate: string;
  expiryDate?: string;
  issuer: string;
  status: DocStatus;
  topics: string[];
  summary: string;
  content: string;
  citations?: string[];
}

export const DOC_TYPE_CONFIG: Record<DocType, { label: string; color: string; bgColor: string; icon: string }> = {
  "luat": { label: "Luật", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", icon: "scale" },
  "nghi-dinh": { label: "Nghị định", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", icon: "file-text" },
  "thong-tu": { label: "Thông tư", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", icon: "scroll" },
  "cong-van": { label: "Công văn", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-950/30", icon: "mail" },
  "huong-dan-noi-bo": { label: "Hướng dẫn nội bộ", color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-950/30", icon: "book-open" },
};

export const DOC_STATUS_CONFIG: Record<DocStatus, { label: string; className: string; dot: string }> = {
  "con-hieu-luc": { label: "Còn hiệu lực", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30", dot: "bg-emerald-500" },
  "moi": { label: "Mới ban hành", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30", dot: "bg-blue-500" },
  "het-hieu-luc": { label: "Hết hiệu lực", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30", dot: "bg-red-500" },
};
