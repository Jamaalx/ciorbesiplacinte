// src/app/api/tickete/route.ts
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

    const { title, description, priority } = await request.json();

    // Validează datele
    if (!title || !description) {
      return NextResponse.json(
        { message: "Titlul și descrierea sunt obligatorii" },
        { status: 400 }
      );
    }

    // Creează ticket-ul
    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        creatorId: session.user.id as string,
      },
    });

    return NextResponse.json(
      {
        message: "Ticket creat cu succes",
        ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Eroare la crearea ticket-ului:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la crearea ticket-ului" },
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
    const userId = searchParams.get("userId");
    
    // Configurează condițiile de căutare în funcție de rol
    let whereCondition = {};
    
    if (session.user.role === "WORKER") {
      // Angajații pot vedea doar ticket-urile lor
      whereCondition = {
        creatorId: session.user.id,
      };
    } else if (session.user.role === "MANAGER") {
      // Managerii pot vedea ticket-urile asignate lor și cele neasignate
      whereCondition = {
        OR: [
          { assigneeId: session.user.id },
          { assigneeId: null },
        ],
      };
    }
    
    // Dacă există un userId specificat și utilizatorul e admin sau manager
    if (userId && (session.user.role === "ADMIN" || session.user.role === "MANAGER")) {
      whereCondition = {
        creatorId: userId,
      };
    }

    const tickets = await db.ticket.findMany({
      where: whereCondition,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
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

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Eroare la obținerea ticket-urilor:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la obținerea ticket-urilor" },
      { status: 500 }
    );
  }
}