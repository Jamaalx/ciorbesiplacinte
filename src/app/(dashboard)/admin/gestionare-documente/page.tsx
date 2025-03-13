// src/app/(dashboard)/admin/gestionare-documente/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, getDocumentCategoryLabel } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DocumentManagementPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/autentificare/login");
  }

  const role = session.user?.role as string;
  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  const documents = await db.document.findMany({
    include: {
      uploader: {
        select: {
          name: true,
        },
      },
      access: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestionare Documente</h1>
        <Link href="/dashboard/manager/incarcare-documente">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Document nou
          </Button>
        </Link>
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
            Aici poți gestiona toate documentele din platformă. Poți vedea, edita sau șterge documente.
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-gray-500">Nu există documente încărcate.</p>
            <Link href="/dashboard/manager/incarcare-documente">
              <Button className="mt-4" variant="outline">
                Încarcă primul document
              </Button>
            </Link>
          </div>
        ) : (
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
                    Categorie
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Încărcat de
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Acces
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Data încărcării
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acțiuni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">{document.title}</div>
                      <div className="text-xs text-gray-500">
                        {document.description || "Fără descriere"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <CategoryBadge category={document.category} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.uploader.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.access.length > 0
                        ? `Limitat (${document.access.length} utilizatori)`
                        : "Nelimitat"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(document.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={document.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Vizualizează
                        </a>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/dashboard/admin/gestionare-documente/${document.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Editează
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const categoryStyles: Record<string, string> = {
    HR: "bg-blue-100 text-blue-800",
    ADMINISTRATIVE: "bg-green-100 text-green-800",
    FORM: "bg-purple-100 text-purple-800",
    OTHER: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
        categoryStyles[category] || "bg-gray-100 text-gray-800"
      }`}
    >
      {getDocumentCategoryLabel(category)}
    </span>
  );
}