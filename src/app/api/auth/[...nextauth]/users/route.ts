// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Trebuie să fii autentificat" },
        { status: 401 }
      );
    }

    // Verifică dacă utilizatorul este admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Nu ai permisiunea de a crea utilizatori" },
        { status: 403 }
      );
    }

    const { name, email, password, role } = await request.json();

    // Validează datele
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Toate câmpurile sunt obligatorii" },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul există deja
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Există deja un utilizator cu acest email" },
        { status: 400 }
      );
    }

    // Hash pentru parolă
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creează utilizatorul
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Eliminăm parola din răspuns
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Utilizator creat cu succes",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Eroare la crearea utilizatorului:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la crearea utilizatorului" },
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

    // Verifică dacă utilizatorul este admin sau manager
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json(
        { message: "Nu ai permisiunea de a vedea utilizatorii" },
        { status: 403 }
      );
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Eroare la obținerea utilizatorilor:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la obținerea utilizatorilor" },
      { status: 500 }
    );
  }
}