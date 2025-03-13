// src/app/(dashboard)/admin/gestionare-documente/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Document, User, UserDocument } from "@prisma/client";

export default async function DocumentManagementPage() {
  // Fetch session and handle authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/autentificare/login");
  }

  // Safely access role with a fallback
  const role = (session.user?.role as string) ?? "GUEST";
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Simple return without complex JSX
  return (
    <div>
      <h1>Gestionare Documente</h1>
      <p>Aici poți gestiona toate documentele din platformă.</p>
    </div>
  );
}