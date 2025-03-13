// src/app/(dashboard)/manager/gestionare-tickete/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, getTicketStatusLabel, getTicketPriorityLabel } from "@/lib/utils";
import Link from "next/link";

export default async function ManagerTicketsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/autentificare/login");
  }

  const role = session.user?.role as string;
  if (role !== "ADMIN" && role !== "MANAGER") {
    redirect("/dashboard");
  }

  // Get all tickets for managers to handle
  const tickets = await db.ticket.findMany({
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        status: "asc", // Open tickets first
      },
      {
        priority: "desc", // Higher priority first
      },
      {
        createdAt: "desc", // Newer tickets first
      },
    ],
  });

  // Group tickets by status
  const ticketsByStatus = {
    OPEN: tickets.filter(ticket => ticket.status === "OPEN"),
    IN_PROGRESS: tickets.filter(ticket => ticket.status === "IN_PROGRESS"),
    RESOLVED: tickets.filter(ticket => ticket.status === "RESOLVED"),
    CLOSED: tickets.filter(ticket => ticket.status === "CLOSED"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestionare Tickete</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="ml-2 text-sm text-gray-600">
            Aici poți gestiona toate ticketele create de angajați. Asigură-te că răspunzi la ticketele deschise în 24 de ore.
          </span>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button className="border-b-2 border-primary-500 px-4 py-2 text-sm font-medium text-primary-700">
              Toate ticketele ({tickets.length})
            </button>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-gray-500">Nu există tickete în acest moment.</p>
          </div>
        ) : (
          <>
            {Object.entries(ticketsByStatus).map(([status, ticketsInStatus]) => {
              if (ticketsInStatus.length === 0) return null;
              
              return (
                <div key={status} className="mb-8">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">
                    {getTicketStatusLabel(status)} ({ticketsInStatus.length})
                  </h3>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Titlu
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Prioritate
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Creat de
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Asignat
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Data creării
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Acțiuni</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {ticketsInStatus.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="font-medium text-gray-900">{ticket.title}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <PriorityBadge priority={ticket.priority} />
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {ticket.creator.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {ticket.assignee ? ticket.assignee.name : "Neasignat"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {formatDate(ticket.createdAt)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              <Link
                                href={`/dashboard/manager/gestionare-tickete/${ticket.id}`}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                Gestionează
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const priorityStyles: Record<string, string> = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-yellow-100 text-yellow-800",
    URGENT: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
        priorityStyles[priority] || "bg-gray-100 text-gray-800"
      }`}
    >
      {getTicketPriorityLabel(priority)}
    </span>
  );
}