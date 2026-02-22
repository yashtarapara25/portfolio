# 🚀 Admin Panel Quick Start (5 Minutes)

## Step 1: Create Admin User (2 minutes)

Go to **Supabase Dashboard** → **Authentication** → **Users** and create a new user with your email.

Then in **SQL Editor**, run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'),
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Step 2: Login to Admin (1 minute)

Visit: `http://localhost:8080/admin/login`

Use your Supabase email and password.

## Step 3: Add Your First Project (2 minutes)

1. Click **Projects** on the dashboard
2. Click **Add Project**
3. Fill in:
   - Title: "My Awesome Project"
   - Slug: "my-awesome-project"
   - Short Desc: "Brief description"
   - Tech: "React, TypeScript, Node.js"
   - Image URL: Paste an image link
4. Click **Save Project**

## Done! 🎉

Your portfolio is now dynamic!

---

## Next: Update Components (5-10 minutes each)

Want to display your admin-managed data on the site?

**Example - ProjectsGrid.tsx:**

```tsx
// OLD
import { projects } from "@/lib/data";

// NEW
import { useProjects } from "@/hooks/use-portfolio-data";

export default function ProjectsGrid() {
  const { projects, loading } = useProjects(); // ← Add this
  if (loading) return <p>Loading...</p>; // ← Add this

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDesc: project.short_desc, // ← Field name change
            tech: project.tech || [],
            image: project.image_url || "", // ← Field name change
            demoUrl: project.demo_url, // ← Field name change
            repoUrl: project.repo_url, // ← Field name change
            featured: project.featured,
          }}
        />
      ))}
    </div>
  );
}
```

## Available Hooks

```tsx
import {
  useProjects, // Get all projects
  useSkills, // Get all skills
  useEducation, // Get education entries
  useSiteSettings, // Get site config
} from "@/hooks/use-portfolio-data";
```

## Components to Update

| Component        | Data Source | Hook            |
| ---------------- | ----------- | --------------- |
| ProjectsGrid.tsx | Projects    | useProjects     |
| SkillsViz.tsx    | Skills      | useSkills       |
| Timeline.tsx     | Education   | useEducation    |
| Header.tsx       | Settings    | useSiteSettings |
| Contact.tsx      | Settings    | useSiteSettings |
| Footer.tsx       | Settings    | useSiteSettings |

## Admin Panel URLs

```
/admin/login       ← Start here!
/admin/dashboard   ← Main dashboard
/admin/projects    ← Manage projects
/admin/skills      ← Manage skills
/admin/education   ← Manage education
/admin/settings    ← Manage site info
```

## Field Name Reference

### Projects

- `title` → `title`
- `short_desc` (DB) → `shortDesc` (Component)
- `image_url` (DB) → `image` (Component)
- `demo_url` (DB) → `demoUrl` (Component)
- `repo_url` (DB) → `repoUrl` (Component)

### Skills

- `name` → `name`
- `level` (1-100) → `level`
- `category` → `category`

### Education

- `year` → `year`
- `institution` → `institution`
- `degree` → `degree`
- `summary` → `summary`

### Settings Keys

- `site_title` - Your name
- `site_description` - Your title
- `email` - Email address
- `phone` - Phone number
- `location` - City, Country
- `github_url` - GitHub link
- `linkedin_url` - LinkedIn link
- `twitter_url` - Twitter link

## Troubleshooting (60 seconds)

| Problem            | Solution                            |
| ------------------ | ----------------------------------- |
| Can't login        | Check email exists in Supabase Auth |
| 404 on admin pages | Restart dev server                  |
| Data not showing   | Check Supabase has data             |
| Images broken      | Verify image URL is valid           |

## What's Inside

✅ Admin dashboard
✅ Project management (CRUD)
✅ Skills management (CRUD)
✅ Education management (CRUD)
✅ Site settings
✅ Data fetching hooks
✅ Authentication
✅ Full documentation

## Files Created

```
src/components/
├── AdminLogin.tsx
├── AdminDashboard.tsx
├── AdminProjects.tsx
├── AdminSkills.tsx
├── AdminEducation.tsx
└── AdminSettings.tsx

src/hooks/
├── use-admin.tsx
└── use-portfolio-data.tsx

Documentation/
├── ADMIN_SETUP_GUIDE.md
├── COMPONENT_MIGRATION_GUIDE.md
├── ADMIN_QUICK_REFERENCE.md
├── IMPLEMENTATION_CHECKLIST.md
├── .env.example
└── QUICK_START.md (this file)
```

## Common Commands

```bash
# Start dev server
npm run dev

# Login: http://localhost:8080/admin/login

# Go to: http://localhost:8080/admin/dashboard

# Add projects/skills/education

# Update components in src/components/

# Deploy when ready!
```

## What's Different from Before

**Old Way:**

- Edit `src/lib/data.ts`
- Restart server
- Rebuild site

**New Way:**

- Click "Add Project" in admin
- Changes appear instantly
- No code changes needed

## Security Notes

- Only you can access `/admin/*` if you have admin role
- Password stored securely in Supabase
- Data stored in encrypted Supabase database
- .env keys should never be committed

## Next Steps

1. ✅ Create admin user
2. ✅ Login and add data
3. → Update components
4. → Deploy to production

---

**Need more details?** See:

- Full setup: `ADMIN_SETUP_GUIDE.md`
- Component migration: `COMPONENT_MIGRATION_GUIDE.md`
- Quick reference: `ADMIN_QUICK_REFERENCE.md`

**Happy managing! 🎉**
