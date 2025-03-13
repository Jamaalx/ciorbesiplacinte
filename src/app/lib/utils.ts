// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getRoleLabel(role: string) {
  const roleMap: Record<string, string> = {
    ADMIN: "Administrator",
    MANAGER: "Manager",
    WORKER: "Angajat",
  };
  
  return roleMap[role] || role;
}

export function getDocumentCategoryLabel(category: string) {
  const categoryMap: Record<string, string> = {
    HR: "Resurse Umane",
    ADMINISTRATIVE: "Administrativ",
    FORM: "Formular",
    OTHER: "Altele",
  };
  
  return categoryMap[category] || category;
}

export function getTicketStatusLabel(status: string) {
  const statusMap: Record<string, string> = {
    OPEN: "Deschis",
    IN_PROGRESS: "În lucru",
    RESOLVED: "Rezolvat",
    CLOSED: "Închis",
  };
  
  return statusMap[status] || status;
}

export function getTicketPriorityLabel(priority: string) {
  const priorityMap: Record<string, string> = {
    LOW: "Scăzută",
    MEDIUM: "Medie",
    HIGH: "Ridicată",
    URGENT: "Urgentă",
  };
  
  return priorityMap[priority] || priority;
}