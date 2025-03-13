// src/app/(dashboard)/worker/tickete/nou/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewTicketPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/tickete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "A apărut o eroare la crearea ticketului.");
      }

      router.push("/dashboard/worker/tickete");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Creare Ticket Nou</h1>
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
            Completează formularul pentru a crea un nou ticket. Un manager va fi asignat în cel mai scurt timp.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Titlu *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descriere scurtă a problemei"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descriere *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Oferă detalii despre problemă"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              rows={5}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Prioritate
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="LOW">Scăzută</option>
              <option value="MEDIUM">Medie</option>
              <option value="HIGH">Ridicată</option>
              <option value="URGENT">Urgentă</option>
            </select>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/worker/tickete")}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Se trimite..." : "Trimite ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}