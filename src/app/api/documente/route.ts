// src/app/api/documente/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Trebuie să fii autentificat" },
        { status: 401 }
      );
    }

    // Verifică dacă utilizatorul este admin sau manager
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json(
        { message: "Nu ai permisiunea de a încărca documente" },
        { status: 403 }
      );
    }

    const { title, description, fileUrl, fileType, category, userIds } = await request.json();

    // Validează datele
    if (!title || !fileUrl || !fileType || !category) {
      return NextResponse.json(
        { message: "Titlul, URL-ul fișierului, tipul fișierului și categoria sunt obligatorii" },
        { status: 400 }
      );
    }

    // Creează documentul
    const document = await db.document.create({
      data: {
        title,
        description: description || "",
        fileUrl,
        fileType,
        category,
        uploaderId: session.user.id as string,
      },
    });

    // Dacă există userIds specificați, acordă acces acestor utilizatori
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      const userDocumentPromises = userIds.map((userId) =>
        db.userDocument.create({
          data: {
            userId,
            documentId: document.id,
          },
        })
      );

      await Promise.all(userDocumentPromises);
    }

    return NextResponse.json(
      {
        message: "Document încărcat cu succes",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Eroare la încărcarea documentului:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la încărcarea documentului" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Trebuie să fii autentificat" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    // Configurează condițiile de căutare
    let whereCondition: any = {};
    
    if (category) {
      whereCondition.category = category;
    }
    
    // Configurează condițiile de acces în funcție de rol
    if (session.user.role === "WORKER") {
      // Angajații pot vedea doar documentele pentru care au acces sau cele fără restricții
      whereCondition.OR = [
        {
          access: {
            some: {
              userId: session.user.id as string,
            },
          },
        },
        {
          access: {
            none: {}, // Documente fără restricții de acces
          },
        },
      ];
    }

    const documents = await db.document.findMany({
      where: whereCondition,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Eroare la obținerea documentelor:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la obținerea documentelor" },
      { status: 500 }
    );
  }
}