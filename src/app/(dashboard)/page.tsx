// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRoleLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/autentificare/login");
  }

  const role = session.user?.role as string;
  const welcomeMessage = getWelcomeMessage(role);
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-800">Bine ai venit, {session.user?.name}!</h2>
        <p className="mt-2 text-gray-600">{welcomeMessage}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Documente noi" 
          count={4} 
          linkText="Vezi toate documentele"
          href={role === "WORKER" ? "/dashboard/worker/documente-hr" : "/dashboard/manager/incarcare-documente"}
          color="blue"
        />
        
        <DashboardCard 
          title="Formulare de completat" 
          count={2} 
          linkText="Vezi formularele"
          href="/dashboard/worker/formulare"
          color="green"
        />
        
        <DashboardCard 
          title="Tickete active" 
          count={role === "WORKER" ? 1 : 5} 
          linkText="Vezi toate ticketele"
          href={role === "WORKER" ? "/dashboard/worker/tickete" : "/dashboard/manager/gestionare-tickete"}
          color="purple"
        />
      </div>
      
      {role === "ADMIN" && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-800">Statistici generale</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard title="Total utilizatori" value="32" />
            <StatCard title="Documente active" value="47" />
            <StatCard title="Tickete deschise" value="8" />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ 
  title, 
  count, 
  linkText, 
  href, 
  color 
}: { 
  title: string; 
  count: number; 
  linkText: string; 
  href: string; 
  color: "blue" | "green" | "purple" | "red"; 
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      link: "text-blue-600 hover:text-blue-800",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      link: "text-green-600 hover:text-green-800",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      link: "text-purple-600 hover:text-purple-800",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      link: "text-red-600 hover:text-red-800",
    },
  };
  
  const styles = colorMap[color];
  
  return (
    <div className={`rounded-lg p-6 shadow ${styles.bg}`}>
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${styles.text}`}>{count}</p>
      <a href={href} className={`mt-4 block text-sm font-medium ${styles.link}`}>
        {linkText} →
      </a>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function getWelcomeMessage(role: string) {
  const roleLabel = getRoleLabel(role);
  
  switch (role) {
    case "ADMIN":
      return `Ai acces complet la platforma Ciorbe și Plăcinte în rolul de ${roleLabel}. Poți gestiona utilizatori, documente și vizualiza statisticile generale.`;
    case "MANAGER":
      return `Bine ai revenit în platforma Ciorbe și Plăcinte. Ca ${roleLabel}, poți gestiona ticketele angajaților și încărca documente noi.`;
    case "WORKER":
    default:
      return `Bine ai revenit în platforma Ciorbe și Plăcinte. Ai acces la formularele, documentele și ticketele tale.`;
  }
}