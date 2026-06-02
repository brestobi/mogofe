# FamilyRoots

A complete modern family tree web application built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

### Public Pages
- **Home** - Beautiful landing page with animated counters, family highlights, upcoming birthdays, and recent activity
- **Family Tree** - Interactive tree visualization with zoom, pan, search, and member cards
- **Members** - Searchable, filterable directory with living/deceased filters, branch filters, and sorting
- **Timeline** - Chronological family history with birth, death, marriage, and memory events
- **Memories** - Family stories and photo galleries organized by categories
- **Statistics** - Animated charts showing gender distribution, generation breakdown, and family insights

### Admin Dashboard
- **Secure Login** - Password-protected admin access
- **Member Management** - Add, edit, and delete family members with relationship mapping
- **Activity Feed** - Automatic logging of all changes
- **Memory Management** - Create and attach memories to members
- **Wish Management** - Add personal messages and wishes
- **Gallery Management** - Upload photos, videos, and documents

### Advanced Features
- Automatic generation calculation
- Birthday engine with upcoming alerts
- Relationship highlighting on hover
- Glassmorphism UI design
- Fully responsive (mobile & desktop)
- Framer Motion animations throughout

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Visualization**: React Flow
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to the SQL Editor
3. Open `supabase_schema.sql` from this project
4. Run the entire SQL script to create all tables, indexes, triggers, and RLS policies

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
```

Get your Supabase URL and Anon Key from:
- Project Settings > API > Project URL
- Project Settings > API > Project API keys > anon public

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Deploy to Vercel

```bash
npm run build
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `members` | Family member profiles |
| `relationships` | Parent/spouse connections |
| `memories` | Family stories and events |
| `memory_members` | Junction table for memory-member links |
| `wishes` | Personal messages |
| `gallery` | Photos, videos, documents |
| `activities` | Audit log of all changes |

### Key Features
- UUID primary keys with auto-generation
- Foreign key constraints with CASCADE deletes
- Row Level Security (RLS) policies
- Automatic `updated_at` triggers
- Performance indexes on frequently queried columns

## Type Safety

The project uses explicitly defined TypeScript types for the Supabase database:

- All tables have `Row`, `Insert`, and `Update` types
- Nullable fields properly typed with `| null`
- Enum constraints for gender, file_type, and activity types
- Relationship foreign keys properly referenced

This eliminates TypeScript inference issues with Supabase.

## Admin Access

Navigate to `/admin` and enter the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`.

Default password if not set: `admin123`

## Adding Your First Members

1. Log in to the admin dashboard at `/admin`
2. Click "Manage Members" then "Add Member"
3. Fill in the member details
4. Set relationships (father, mother, spouse) if applicable
5. Save - the member will appear across all pages

## License

MIT
