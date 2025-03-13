# Dashboard "Ciorbe și Plăcinte"

Un dashboard intern pentru compania "Ciorbe și Plăcinte" care permite gestionarea documentelor, formularelor și ticketelor pentru angajați, manageri și administratori.

## Caracteristici principale

- Sistem de autentificare securizat
- Roluri și permisiuni diferențiate (Angajați, Manageri, Administratori)
- Gestionare documente HR și administrative
- Sistem de ticketing intern
- Formulare pentru angajați
- Interfață intuitivă și responsive

## Tehnologii folosite

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Bază de date**: PostgreSQL cu Prisma ORM
- **Stocare documente**: AWS S3
- **Hosting**: Vercel (recomandat)

## Cerințe de sistem

- Node.js 16.x sau mai nou
- PostgreSQL 12.x sau mai nou
- Cont AWS pentru stocare S3 (sau alternativă)

## Instalare

1. **Clonează repository-ul**

   ```bash
   git clone https://github.com/your-username/ciorbe-si-placinte.git
   cd ciorbe-si-placinte
   ```

2. **Instalează dependențele**

   ```bash
   npm install
   ```

3. **Configurează variabilele de mediu**

   Copiază fișierul `.env.example` în `.env.local` și completează valorile necesare:

   ```bash
   cp .env.example .env.local
   ```

   Apoi editează `.env.local` cu datele tale:

   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ciorbe_si_placinte?schema=public"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # AWS S3 (pentru stocare documente)
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="eu-central-1"
   AWS_BUCKET_NAME="ciorbe-si-placinte-documents"
   ```

4. **Inițializează baza de date**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Adaugă un utilizator admin**

   Rulează script-ul de seed pentru a crea primul utilizator admin:

   ```bash
   npx prisma db seed
   ```

   Credențiale implicite:
   - Email: admin@ciorbe-si-placinte.ro
   - Parolă: admin123

6. **Pornește serverul de dezvoltare**

   ```bash
   npm run dev
   ```

   Aplicația va fi disponibilă la adresa [http://localhost:3000](http://localhost:3000)

## Structura proiectului

```
ciorbe-si-placinte/
├── src/
│   ├── app/
│   │   ├── (autentificare)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   └── dashboard/
│   └── lib/
│       └── baza-date/
├── prisma/
├── public/
├── .env.local
├── package.json
└── README.md
```

## Deployment

Pentru deployment în producție, recomandăm folosirea Vercel:

1. Creează un cont pe [Vercel](https://vercel.com)
2. Conectează repository-ul GitHub
3. Configurează variabilele de mediu în interfața Vercel
4. Deployează aplicația

Alternativ, poți folosi orice platformă care suportă aplicații Next.js.

## Contribuții

Contribuțiile sunt binevenite! Te rugăm să deschizi un issue înainte de a trimite un pull request.

## Licență

Acest proiect este licențiat sub [MIT License](LICENSE).