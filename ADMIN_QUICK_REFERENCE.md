# Admin Panel Quick Reference

## URLs

| Page        | URL                | Purpose              |
| ----------- | ------------------ | -------------------- |
| Admin Login | `/admin/login`     | Login to admin panel |
| Dashboard   | `/admin/dashboard` | Admin control center |
| Projects    | `/admin/projects`  | Manage projects      |
| Skills      | `/admin/skills`    | Manage skills        |
| Education   | `/admin/education` | Manage education     |
| Settings    | `/admin/settings`  | Site configuration   |

## Database Tables

### projects

- Stores portfolio projects
- Fields: title, slug, short_desc, tech[], image_url, demo_url, repo_url, featured
- Access: `/admin/projects`

### skills

- Stores technical skills
- Fields: name, level (1-100), category
- Categories: languages, frameworks, tools, ai-ml
- Access: `/admin/skills`

### education

- Stores education history
- Fields: year, institution, degree, summary
- Access: `/admin/education`

### site_settings

- Stores global site configuration
- Keys: site_title, site_description, email, phone, location, github_url, linkedin_url, twitter_url
- Access: `/admin/settings`

### user_roles

- Manages user permissions
- Roles: admin, user
- Required for accessing admin panel

## Setting Up Admin User

### Quick Setup (Recommended)

1. Create user in Supabase → Auth → Users
2. Run this SQL in Supabase → SQL Editor:

```sql
-- Grant admin role to your user
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Environment Variables

Make sure your `.env.local` has:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Using Data Hooks

```tsx
// Import hooks
import {
  useProjects,
  useSkills,
  useEducation,
  useSiteSettings,
} from "@/hooks/use-portfolio-data";

// Use in component
const { projects, loading, error } = useProjects();
const { skills, loading, error } = useSkills();
const { education, loading, error } = useEducation();
const { settings, loading, error } = useSiteSettings();
```

## Common Tasks

### Add a Project

1. Go to `/admin/projects`
2. Click "Add Project"
3. Fill in all fields
4. Click "Save Project"

### Update Your Name/Title

1. Go to `/admin/settings`
2. Edit "Site Title" and "Site Description"
3. Click "Save Settings"

### Add a New Skill

1. Go to `/admin/skills`
2. Click "Add Skill"
3. Enter name, level, and category
4. Click "Save Skill"

### Add Education Entry

1. Go to `/admin/education`
2. Click "Add Education"
3. Fill in year, institution, degree
4. Click "Save Education"

### Update Social Links

1. Go to `/admin/settings`
2. Scroll to "Social Links"
3. Enter your GitHub, LinkedIn, Twitter URLs
4. Click "Save Settings"

## Troubleshooting

### Login fails

- Check Supabase user exists
- Verify user has admin role in user_roles table
- Check .env variables are correct

### Data not saving

- Check browser console for errors
- Verify Supabase credentials
- Check database has write permissions

### Components not showing data

- Confirm you're using the data hooks
- Check if data exists in Supabase
- Look for error messages in console

### Images not displaying

- Verify image URLs start with http/https
- Check URLs are public/accessible
- Ensure correct image format

## Keyboard Shortcuts

These can be added in the future:

- `Ctrl+S` - Quick save
- `Esc` - Cancel/Close form
- `Ctrl+Z` - Undo (future feature)

## Files Created

### Admin Components

- `src/components/AdminLogin.tsx` - Login page
- `src/components/AdminDashboard.tsx` - Main dashboard
- `src/components/AdminProjects.tsx` - Project management
- `src/components/AdminSkills.tsx` - Skills management
- `src/components/AdminEducation.tsx` - Education management
- `src/components/AdminSettings.tsx` - Site settings

### Hooks

- `src/hooks/use-admin.tsx` - Admin auth check
- `src/hooks/use-portfolio-data.tsx` - Data fetching hooks

### Routes

- `/admin/login` - Authentication
- `/admin/dashboard` - Control panel
- `/admin/projects` - Project CRUD
- `/admin/skills` - Skill CRUD
- `/admin/education` - Education CRUD
- `/admin/settings` - Settings management

## Data Flow

```
Admin Panel
    ↓
Supabase Database
    ↓
usePortfolioData Hooks
    ↓
Components Display Data
```

## Next Steps

1. ✅ Set up admin user
2. ✅ Add your data via admin panel
3. ✅ Update components to use data hooks
4. ✅ Deploy to production

## Support

- Supabase Docs: https://supabase.com/docs
- Component Guide: See COMPONENT_MIGRATION_GUIDE.md
- Setup Guide: See ADMIN_SETUP_GUIDE.md
