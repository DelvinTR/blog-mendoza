# 🗺️ Vinot's Blog — Vintage Travel Journal

A retro-styled, cinematic travel blog built with **Next.js 16**, **Prisma**, and **TipTap**. Features a handwritten notebook article reader, retro TV & phone components, scrapbook stickers, and a premium admin panel with a rich-text editor.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📖 **Notebook Reader** | Articles displayed as an interactive vintage notebook with page-flip animations |
| 📺 **Retro TV Frame** | Article carousel embedded in an old CRT television |
| 📱 **Nokia Phone** | Latest article preview inside a retro Nokia phone with cover image |
| 🎨 **Scrapbook Stickers** | 20 custom PNG stickers placed across sections for a handmade feel |
| 📷 **Photo Gallery** | Polaroid-style photo scrapbook with Vercel Blob storage |
| ✍️ **Rich Text Editor** | TipTap-based editor with fonts, tables, YouTube embeds, callouts, and more |
| 🔐 **Admin Panel** | Password-protected dashboard for managing articles and photos |
| 🔄 **Webhook API** | Evernote → Zapier → Blog article creation pipeline |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Database**: SQLite via [Prisma](https://www.prisma.io/)
- **Editor**: [TipTap](https://tiptap.dev/) (rich text)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (images)
- **Styling**: Vanilla CSS with CSS variables design system
- **Auth**: HTTP Basic Auth via Next.js middleware
- **Fonts**: Google Fonts (Righteous, Inter, Playfair Display, Caveat, Shadows Into Light Two)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vinots-blog.git
cd vinots-blog

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | SQLite connection string (`file:./dev.db`) |
| `ADMIN_USER` | ❌ | Admin login username (default: `admin`) |
| `ADMIN_PASSWORD` | ❌ | Admin login password (default: `vinot2026`) |
| `BLOB_READ_WRITE_TOKEN` | ✅ (production) | Vercel Blob token for image uploads |
| `EVERNOTE_WEBHOOK_SECRET` | ❌ | Bearer token for the webhook API |

---

## 📁 Project Structure

```
vinots-blog/
├── prisma/
│   └── schema.prisma        # Database models (Article, Photo)
├── public/
│   ├── assets/stickers/      # 20 custom PNG stickers
│   ├── camera.png            # Retro camera frame
│   ├── old-tv.png            # CRT television frame
│   └── phone.png             # Nokia phone frame
├── src/
│   ├── lib/
│   │   └── prisma.ts         # Prisma singleton
│   ├── middleware.ts          # Admin Basic Auth
│   └── app/
│       ├── layout.tsx         # Root layout (fonts, metadata)
│       ├── globals.css        # Global design tokens
│       ├── (public)/          # Public-facing pages
│       │   ├── layout.tsx     # Navbar + Footer
│       │   ├── page.tsx       # Homepage (hero, blog, gallery)
│       │   ├── public.css     # All public styles
│       │   ├── blog/          # Blog list + article reader
│       │   └── gallery/       # Photo scrapbook
│       ├── admin/             # Admin panel
│       │   ├── editor/        # TipTap article editor
│       │   └── gallery/       # Photo management
│       └── api/webhooks/      # Evernote webhook endpoint
├── .env.example
├── package.json
└── README.md
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` → `file:./dev.db`
   - `BLOB_READ_WRITE_TOKEN` → Get from Vercel Storage > Blob
   - `ADMIN_USER` / `ADMIN_PASSWORD` → Your admin credentials
4. Deploy. Vercel will automatically run `prisma generate` and `next build`.

> **Note**: SQLite works for small-scale deployments. For production scale, consider migrating to PostgreSQL (Vercel Postgres or Neon).

---

## 📄 License

This project is private. All rights reserved.
