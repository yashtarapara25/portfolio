# 🚀 Yash Tarapara — Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tarapara--yash--portfolio.vercel.app-blue?style=for-the-badge&logo=vercel)](https://tarapara-yash-portfolio.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

A **fully dynamic, CMS-powered developer portfolio** with a built-in admin panel — no code changes needed to update your content. Built with React, TypeScript, Vite, Supabase, and Framer Motion.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Stunning UI** | Animated hero, aurora gradients, glassmorphism, blob backgrounds |
| ⚡ **Framer Motion** | Page transitions, scroll animations, hover effects throughout |
| 🗄️ **Supabase Backend** | Real-time database for projects, skills, education, settings |
| 🔐 **Admin Panel** | Secure login — manage all content without touching code |
| 📬 **Messages Inbox** | Contact form submissions saved to DB, view in admin |
| 📄 **Resume Button** | Upload PDF to Google Drive, link it in admin settings |
| 📱 **Fully Responsive** | Mobile-first design, looks great on all screen sizes |
| 🌐 **SEO Ready** | Meta tags, semantic HTML, proper heading hierarchy |

---

## 🖥️ Tech Stack

- **Frontend** — React 18, TypeScript, Vite
- **Styling** — Tailwind CSS, CSS animations
- **Animations** — Framer Motion
- **Backend** — Supabase (PostgreSQL + Auth + Row Level Security)
- **Deployment** — Vercel (auto-deploy on every git push)
- **Icons** — Lucide React
- **Fonts** — Orbitron, Rajdhani, Space Grotesk (Google Fonts)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero.tsx            # Animated hero section with typewriter effect
│   ├── About.tsx           # About section with live stats from Supabase
│   ├── ProjectsGrid.tsx    # Projects grid with skeleton loading
│   ├── ProjectCard.tsx     # Individual project card
│   ├── SkillsViz.tsx       # Skills with animated bars & category filters
│   ├── Timeline.tsx        # Education timeline with animations
│   ├── Contact.tsx         # Contact form (saves to Supabase)
│   ├── Footer.tsx          # Footer with social links
│   ├── Header.tsx          # Sticky nav with scroll blur
│   ├── AdminDashboard.tsx  # Admin panel dashboard
│   ├── AdminMessages.tsx   # View contact form submissions
│   ├── AdminSettings.tsx   # Edit site settings (name, links, resume)
│   ├── AdminProjects.tsx   # Manage projects
│   ├── AdminSkills.tsx     # Manage skills
│   └── AdminEducation.tsx  # Manage education entries
├── hooks/
│   └── use-portfolio-data.tsx  # Supabase data fetching hooks
├── integrations/supabase/      # Supabase client & types
├── lib/
│   ├── data.ts             # Static fallback data
│   └── motions.ts          # Framer Motion variants
└── pages/
    ├── Index.tsx            # Main portfolio page
    └── NotFound.tsx         # 404 page
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)

### 1. Clone the repo

```bash
git clone https://github.com/yashtarapara25/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following:

```sql
-- Projects
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  tech_stack text[],
  github_url text,
  demo_url text,
  image_url text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Skills
create table skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  proficiency integer default 80,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Education
create table education (
  id uuid default gen_random_uuid() primary key,
  degree text not null,
  institution text not null,
  year text not null,
  summary text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Site Settings
create table site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Contact Messages
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- User Roles (for admin access)
create table user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null default 'user'
);

-- RLS Policies
alter table projects enable row level security;
alter table skills enable row level security;
alter table education enable row level security;
alter table site_settings enable row level security;
alter table contact_messages enable row level security;
alter table user_roles enable row level security;

create policy "Public read projects" on projects for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read education" on education for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Anyone can insert messages" on contact_messages for insert with check (true);
create policy "Auth read messages" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on contact_messages for update using (auth.role() = 'authenticated');
create policy "Auth delete messages" on contact_messages for delete using (auth.role() = 'authenticated');
```

3. Go to **Authentication → Settings** → Enable Email/Password sign-in
4. Create your admin account under **Authentication → Users → Invite User**
5. Run this to give yourself admin role (replace with your user ID):
```sql
insert into user_roles (user_id, role) values ('YOUR-USER-UUID', 'admin');
```

### 4. Configure environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Admin Panel

Access the admin panel at `/admin/login` with your Supabase credentials.

| Page | URL | Purpose |
|---|---|---|
| Dashboard | `/admin/dashboard` | Overview of all sections |
| Projects | `/admin/projects` | Add / edit / delete projects |
| Skills | `/admin/skills` | Add / edit / delete skills |
| Education | `/admin/education` | Add / edit / delete education |
| Settings | `/admin/settings` | Update name, contact info, social links, resume URL |
| Messages | `/admin/messages` | View contact form submissions |

### Adding your Resume

1. Upload your PDF to [Google Drive](https://drive.google.com)
2. Right-click → Share → **Anyone with link**
3. Convert the link:
   - Share: `https://drive.google.com/file/d/FILE_ID/view`
   - Direct: `https://drive.google.com/uc?export=download&id=FILE_ID`
4. Paste into **Admin → Settings → Resume URL** → Save

---

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click **Deploy** — done! 🎉

Auto-redeploys on every `git push`.

---

## 📸 Screenshots

> Portfolio live at: [tarapara-yash-portfolio.vercel.app](https://tarapara-yash-portfolio.vercel.app)

---

## 📄 License

MIT — free to use and modify.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/yashtarapara25">Yash Tarapara</a>
</div>
