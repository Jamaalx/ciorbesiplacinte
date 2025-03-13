// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Configurează clientul S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

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
        { message: "Nu ai permisiunea de a încărca fișiere" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Niciun fișier furnizat" },
        { status: 400 }
      );
    }

    // Obțineți tipul de conținut al fișierului
    const fileType = file.type;
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Generează un nume unic pentru fișier
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;

    // Parametrii pentru încărcarea în S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: fileName,
      Body: buffer,
      ContentType: fileType,
    };

    // Încarcă fișierul în S3
    await s3Client.send(new PutObjectCommand(params));

    // Construiește URL-ul pentru fișierul încărcat
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({
      message: "Fișier încărcat cu succes",
      fileUrl,
      fileType,
    });
  } catch (error) {
    console.error("Eroare la încărcarea fișierului:", error);
    return NextResponse.json(
      { message: "A apărut o eroare la încărcarea fișierului" },
      { status: 500 }
    );
  }
}