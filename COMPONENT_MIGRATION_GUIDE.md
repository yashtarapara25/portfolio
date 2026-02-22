# Component Migration Guide - From Static to Dynamic Data

This guide shows you how to convert each component from using static data to fetching from Supabase.

## 1. ProjectsGrid.tsx

**File:** `src/components/ProjectsGrid.tsx`

**Old Code:**

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

**New Code:**

```tsx
import { useProjects } from "@/hooks/use-portfolio-data";

export default function ProjectsGrid() {
  const { projects, loading } = useProjects();

  if (loading) return <p>Loading projects...</p>;

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDesc: project.short_desc,
            tech: project.tech || [],
            image: project.image_url || "",
            demoUrl: project.demo_url,
            repoUrl: project.repo_url,
            featured: project.featured,
          }}
        />
      ))}
    </div>
  );
}
```

**Field Mapping:**

- `title` → `title`
- `slug` → `slug`
- `shortDesc` → `short_desc`
- `tech` → `tech` (array)
- `image` → `image_url`
- `demoUrl` → `demo_url`
- `repoUrl` → `repo_url`
- `featured` → `featured`

---

## 2. SkillsViz.tsx

**File:** `src/components/SkillsViz.tsx`

**Old Code:**

```tsx
import { skills } from "@/lib/data";

export default function SkillsViz() {
  const languageSkills = skills.filter((s) => s.category === "languages");
  // ... more filtering

  return (
    <div>
      {languageSkills.map((skill) => (
        <SkillBar key={skill.name} skill={skill} />
      ))}
    </div>
  );
}
```

**New Code:**

```tsx
import { useSkills } from "@/hooks/use-portfolio-data";

export default function SkillsViz() {
  const { skills, loading } = useSkills();

  if (loading) return <p>Loading skills...</p>;

  const languageSkills = skills.filter((s) => s.category === "languages");
  // ... more filtering

  return (
    <div>
      {languageSkills.map((skill) => (
        <SkillBar
          key={skill.name}
          skill={{
            name: skill.name,
            level: skill.level || 50,
            category: skill.category,
          }}
        />
      ))}
    </div>
  );
}
```

**Field Mapping:**

- `name` → `name`
- `level` → `level` (1-100)
- `category` → `category` (languages, frameworks, tools, ai-ml)

---

## 3. Timeline.tsx (Education)

**File:** `src/components/Timeline.tsx`

**Old Code:**

```tsx
import { Education } from "@/lib/data";

export default function Timeline() {
  // Manually create education array
  return (
    <div>
      {educationData.map((edu) => (
        <TimelineItem key={edu.year} education={edu} />
      ))}
    </div>
  );
}
```

**New Code:**

```tsx
import { useEducation } from "@/hooks/use-portfolio-data";

export default function Timeline() {
  const { education, loading } = useEducation();

  if (loading) return <p>Loading education...</p>;

  return (
    <div>
      {education.map((edu) => (
        <TimelineItem
          key={edu.id}
          education={{
            year: edu.year,
            institution: edu.institution,
            degree: edu.degree || "",
            summary: edu.summary,
          }}
        />
      ))}
    </div>
  );
}
```

**Field Mapping:**

- `year` → `year`
- `institution` → `institution`
- `degree` → `degree`
- `summary` → `summary`

---

## 4. Header.tsx

**File:** `src/components/Header.tsx`

**Old Code:**

```tsx
export default function Header() {
  return (
    <header>
      <h1>Your Name</h1>
      <p>Your Title</p>
    </header>
  );
}
```

**New Code:**

```tsx
import { useSiteSettings } from "@/hooks/use-portfolio-data";

export default function Header() {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  return (
    <header>
      <h1>{settings.site_title || "Your Name"}</h1>
      <p>{settings.site_description || "Your Title"}</p>
    </header>
  );
}
```

**Available Settings Keys:**

- `site_title`
- `site_description`
- `email`
- `phone`
- `location`

---

## 5. Contact.tsx

**File:** `src/components/Contact.tsx`

**Old Code:**

```tsx
export default function Contact() {
  return (
    <div>
      <a href="mailto:email@example.com">email@example.com</a>
      <a href="tel:+15551234567">+1 (555) 123-4567</a>
    </div>
  );
}
```

**New Code:**

```tsx
import { useSiteSettings } from "@/hooks/use-portfolio-data";

export default function Contact() {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  return (
    <div>
      <a href={`mailto:${settings.email}`}>{settings.email}</a>
      <a href={`tel:${settings.phone}`}>{settings.phone}</a>
    </div>
  );
}
```

**Available Settings Keys:**

- `email`
- `phone`
- `location`
- `github_url`
- `linkedin_url`
- `twitter_url`

---

## 6. Footer.tsx

**File:** `src/components/Footer.tsx`

**Old Code:**

```tsx
export default function Footer() {
  return (
    <footer>
      <a href="https://github.com/yourname">GitHub</a>
      <a href="https://linkedin.com/in/yourname">LinkedIn</a>
    </footer>
  );
}
```

**New Code:**

```tsx
import { useSiteSettings } from "@/hooks/use-portfolio-data";

export default function Footer() {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  return (
    <footer>
      {settings.github_url && <a href={settings.github_url}>GitHub</a>}
      {settings.linkedin_url && <a href={settings.linkedin_url}>LinkedIn</a>}
      {settings.twitter_url && <a href={settings.twitter_url}>Twitter</a>}
    </footer>
  );
}
```

---

## Step-by-Step Migration Process

1. **Back up your current data** - Export static data from `lib/data.ts`
2. **Import the hook** - Add import statement for the data hook
3. **Replace static data** - Use hook instead of imported data
4. **Test component** - Verify it works without errors
5. **Handle loading state** - Show loading indicator while fetching
6. **Handle error state** - Display fallback if data fails to load
7. **Update type mappings** - Ensure field names match

## Type Definitions

The database table columns use snake_case, React typically uses camelCase:

**Projects Table:**

```typescript
type Project = {
  id: string;
  title: string;
  slug: string;
  short_desc: string; // → shortDesc
  tech: string[]; // → tech
  image_url: string; // → image
  demo_url?: string; // → demoUrl
  repo_url?: string; // → repoUrl
  featured?: boolean; // → featured
  sort_order?: number;
  created_at: string;
  updated_at: string;
};
```

**Skills Table:**

```typescript
type Skill = {
  id: string;
  name: string;
  level: number; // 1-100
  category: string; // "languages" | "frameworks" | "tools" | "ai-ml"
  sort_order?: number;
  created_at: string;
};
```

**Education Table:**

```typescript
type Education = {
  id: string;
  year: string;
  institution: string;
  degree?: string;
  summary?: string;
  sort_order?: number;
  created_at: string;
};
```

**Site Settings Table:**

```typescript
type SiteSetting = {
  id: string;
  key: string;
  value?: string; // JSON string or plain value
  updated_at: string;
};
```

## Common Patterns

### Loading States

```tsx
const { data, loading, error } = useProjects();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Filtering with Dynamic Data

```tsx
const { projects } = useProjects();
const featuredProjects = projects.filter((p) => p.featured === true);
```

### Empty State

```tsx
const { projects, loading } = useProjects();

if (!loading && projects.length === 0) {
  return <EmptyState message="No projects yet" />;
}
```

## Verification Checklist

- [ ] Import hook at top of component
- [ ] Remove/comment out old static imports
- [ ] Replace data with hook call
- [ ] Add loading state
- [ ] Add error handling
- [ ] Update field names (camelCase ↔ snake_case)
- [ ] Test component renders correctly
- [ ] Check console for errors
- [ ] Verify data displays as expected

---

**Ready to migrate?** Start with one component, test it thoroughly, then move to the next!
