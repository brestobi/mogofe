# FamilyRoots Deployment Checklist

## Pre-Deployment Steps

### 1. Supabase Setup (CRITICAL - Do This First)
- [ ] Create new Supabase project at https://supabase.com
- [ ] Go to SQL Editor in your project dashboard
- [ ] Copy the contents of `supabase_schema.sql` from this project
- [ ] Paste and run the entire SQL script
- [ ] Verify all 7 tables were created (members, relationships, memories, memory_members, wishes, gallery, activities)
- [ ] Verify indexes were created
- [ ] Verify RLS policies are active

### 2. Environment Variables
Create `.env.local` file with these exact variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
```

**Where to find these values:**
- Go to Supabase Dashboard > Project Settings > API
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` public key (NOT the service_role key)

### 3. Install & Build Locally (Verify Before Deploying)
```bash
npm install
npm run build
```

If build succeeds locally, it will succeed on Vercel.

### 4. Vercel Deployment
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel dashboard (Project Settings > Environment Variables)
- [ ] Deploy

### 5. Post-Deployment
- [ ] Visit your deployed site
- [ ] Go to `/admin` and log in with your password
- [ ] Add your first family member
- [ ] Verify data appears on Home, Tree, Members, and Statistics pages

## Important Notes

### Database Types
The database types in `src/types/database.ts` are **explicitly defined** (not inferred). This avoids TypeScript compilation issues. Do NOT generate types from Supabase - the provided types are production-ready.

### RLS Policies
The SQL schema sets up Row Level Security:
- Public users can READ all data (for the family website)
- Only service_role can WRITE data (admin operations use the anon key with proper auth)

### Admin Password
The admin password is stored in an environment variable. Choose a strong password. The default fallback is `admin123` if no env var is set.

### Photo URLs
For photos, you can:
1. Upload to Supabase Storage and use the public URL
2. Use external image URLs (Imgur, Cloudinary, etc.)
3. Leave blank for default avatar

### Adding Relationships
When adding a new member through the admin panel:
1. First add the parents (if not already in the system)
2. Then add the child and select parents from dropdowns
3. The relationship is stored in the `relationships` table

## Troubleshooting

**Build fails with TypeScript errors?**
- Check that `tsconfig.json` has `"strict": true`
- Verify all imports use `@/` paths
- Ensure no missing type annotations

**Database connection errors?**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that tables exist in Supabase SQL Editor
- Verify RLS policies aren't blocking reads

**Admin login not working?**
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` is set
- Clear browser localStorage and try again
- Check browser console for errors

## File Structure Overview

```
familyroots/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── tree/page.tsx       # Family Tree
│   │   ├── members/page.tsx    # Members directory
│   │   ├── timeline/page.tsx   # Timeline
│   │   ├── memories/page.tsx   # Memories
│   │   ├── statistics/page.tsx # Statistics
│   │   ├── admin/page.tsx      # Admin login
│   │   └── admin/dashboard/    # Admin dashboard + management
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Supabase client
│   ├── types/                  # Database TypeScript types
│   └── utils/                  # Data fetching utilities
├── supabase_schema.sql         # Database schema
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── .env.local.example
```

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **React Flow**: https://reactflow.dev/docs
