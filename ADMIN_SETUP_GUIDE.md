# Admin Panel Setup Guide

Welcome to your new dynamic portfolio admin panel! This guide will walk you through setting up and using your admin interface to manage your portfolio content.

## Quick Start

### 1. Access the Admin Login

Navigate to: `http://localhost:8080/admin/login`

### 2. Admin Credentials Setup

You'll need to set up your Supabase authentication first. Here's how:

#### Option A: Using Supabase Console (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Create new user**
4. Enter your email and password
5. Create the user

#### Option B: Using Supabase CLI

```bash
# Initialize Supabase locally
supabase init

# Create a user with admin role
supabase db seed
```

### 3. Grant Admin Access

After creating your user account, you need to give them admin role:

**Option A: Using Supabase Console**

1. Go to your project's SQL Editor
2. Run this query to grant admin access:

```sql
-- First, find your user ID from the auth.users table
-- Then insert into user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('<your_user_id>', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

**Option B: Using SQL directly in your database**

```sql
-- Replace with your actual email
UPDATE auth.users SET email_confirmed_at = NOW()
WHERE email = 'your.email@example.com';

-- Then insert the role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email = 'your.email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Using the Admin Panel

### Dashboard

Once logged in, you'll see the admin dashboard with four main sections:

1. **Projects** - Manage your portfolio projects
2. **Skills** - Manage your technical skills
3. **Education** - Manage your education history
4. **Settings** - Configure site-wide settings

### Managing Projects

1. Click **Projects** on the dashboard
2. Click **Add Project** to create a new project
3. Fill in the project details:
   - **Title**: Project name
   - **Slug**: URL-friendly version (e.g., "neural-vision")
   - **Short Description**: Brief project description
   - **Technologies**: Comma-separated list (React, TypeScript, etc.)
   - **Image URL**: Link to project image
   - **Demo URL**: Link to live demo (optional)
   - **Repo URL**: Link to GitHub repository (optional)
   - **Featured**: Toggle to feature on homepage

### Managing Skills

1. Click **Skills** on the dashboard
2. Click **Add Skill** to create a new skill
3. Fill in:
   - **Name**: Skill name (e.g., "Python")
   - **Level**: 1-100 (skill proficiency)
   - **Category**: Languages / Frameworks / Tools / AI-ML
4. Skills are automatically organized by category

### Managing Education

1. Click **Education** on the dashboard
2. Click **Add Education** to add education entry
3. Fill in:
   - **Year**: Graduation year
   - **Institution**: School/University name
   - **Degree**: Degree name (e.g., B.S. Computer Science)
   - **Summary**: Brief description of your studies

### Site Settings

1. Click **Settings** on the dashboard
2. Update your site information:
   - **Site Title**: Your name or portfolio title
   - **Site Description**: Your professional tagline
   - **Contact Info**: Email, phone, location
   - **Social Links**: GitHub, LinkedIn, Twitter URLs

## Updating Your Frontend

To use dynamic data from Supabase, update your components:

### Example: ProjectsGrid Component

**Before (Static Data):**

```tsx
import { projects } from "@/lib/data";

export default function ProjectsGrid() {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**After (Dynamic Data):**

```tsx
import { useProjects } from "@/hooks/use-portfolio-data";

export default function ProjectsGrid() {
  const { projects, loading, error } = useProjects();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Available Hooks

```tsx
import {
  useProjects,
  useSkills,
  useEducation,
  useSiteSettings,
} from "@/hooks/use-portfolio-data";

// Get all projects
const { projects, loading, error } = useProjects();

// Get all skills
const { skills, loading, error } = useSkills();

// Get all education entries
const { education, loading, error } = useEducation();

// Get site settings
const { settings, loading, error } = useSiteSettings();
```

## Making Your Portfolio Dynamic

Update these components to use the new hooks:

1. **ProjectsGrid.tsx** - Use `useProjects()`
2. **SkillsViz.tsx** - Use `useSkills()`
3. **Timeline.tsx** - Use `useEducation()`
4. **Header.tsx** - Use `useSiteSettings()`
5. **Contact.tsx** - Use `useSiteSettings()` for contact info
6. **Footer.tsx** - Use `useSiteSettings()` for social links

## Important Notes

### Data Structure

The database tables have this structure:

**projects**

- `id`: Unique identifier
- `title`: Project title
- `slug`: URL-friendly identifier
- `short_desc`: Brief description
- `tech`: Array of technologies
- `image_url`: Project image
- `demo_url`: Demo link
- `repo_url`: Repository link
- `featured`: Boolean for homepage
- `sort_order`: Display order
- `created_at`: Creation timestamp

**skills**

- `id`: Unique identifier
- `name`: Skill name
- `level`: 1-100 proficiency
- `category`: Language/Framework/Tool/AI-ML
- `sort_order`: Display order

**education**

- `id`: Unique identifier
- `year`: Year of completion
- `institution`: School/University name
- `degree`: Degree name
- `summary`: Description
- `sort_order`: Display order

**site_settings**

- `key`: Setting key
- `value`: Setting value
- `updated_at`: Last update

## Security Best Practices

1. **Never commit credentials** - Keep your Supabase keys in `.env`
2. **Use Row Level Security (RLS)** - Only admin users can modify data
3. **Backup regularly** - Export your Supabase data periodically
4. **Monitor access** - Check Supabase logs for suspicious activity

## Troubleshooting

### Can't login to admin panel

- Confirm user exists in Supabase auth
- Check if user has admin role in `user_roles` table
- Clear browser cache and try again

### Changes not reflecting on site

- Check network tab for API errors
- Ensure you're modifying the correct row
- Try refreshing the page

### Images not loading

- Verify image URLs are publicly accessible
- Check if using correct image format
- Ensure URL is complete (http/https)

## Future Enhancements

Consider adding:

- Image upload to Supabase Storage
- Draft/Published status for projects
- Project categories/tags
- Multiple portfolio themes
- Blog/Article management
- Analytics dashboard
- Email notification system

## Support

For issues or questions:

1. Check Supabase documentation: https://supabase.com/docs
2. Review browser console for error messages
3. Check Supabase logs in your dashboard

---

**Happy managing!** 🚀
