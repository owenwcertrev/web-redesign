# Website Agent Instructions

## Multi-Agent Coordination (AUTOMATIC)

You are the **Website Agent** working on the public-facing marketing site (Next.js/React).
Other Claude Code agents are working on backend API and dashboard in separate repos.

### Session Start Protocol:
1. Clone/pull agent coordination repo:
   ```bash
   cd /tmp
   git clone https://github.com/owenwcertrev/agent-coordination.git 2>/dev/null || (cd agent-coordination && git pull)
   ```

2. Read `/tmp/agent-coordination/UPDATES.md` to see what other agents are doing

3. Check for coordination needs:
   - Any dashboard URL changes that affect your navigation links?
   - Backend API changes if you integrate submission features?
   - Any breaking changes from other agents?

### After Making Changes:
1. Add update to `/tmp/agent-coordination/UPDATES.md` (at the top, above the instructions):
   ```markdown
   ## [DATE] - Website Agent (web-redesign)
   - [Your changes as bullet points]
   - ⚠️ [Any breaking changes or notes for other agents]

   ---
   ```

2. Commit and push to coordination repo:
   ```bash
   cd /tmp/agent-coordination
   git add UPDATES.md
   git commit -m "Website: [brief description]"
   git push
   ```

3. Always push changes to Vercel:
   ```bash
   git push
   ```

### Your Owned Components:
- Public marketing website (Next.js 13+ App Router, TypeScript, Tailwind CSS)
- Homepage, about, features, pricing pages
- Public-facing content and design
- Navigation and routing
- Links to external systems (brand/expert dashboards)

### Components You DON'T Own:
- Brand dashboard (owned by Dashboard Agent - separate repo)
- Expert dashboard (owned by Dashboard Agent - separate repo)
- Backend API (owned by Backend Agent - article-analysis repo)

### Integration Points:
- **Brand Login**: Links to dashboard app
- **Expert Login**: Links to dashboard app
- **Future**: May integrate article submission form (coordinate with Backend Agent)

### Project Context:
- **Tech Stack**: Next.js 13+, TypeScript, Tailwind CSS, Vercel
- **Backend API** (if needed in future):
  - Repo: article-analysis
  - Submit endpoint: POST /api/article-analysis
  - Status check: GET /api/job-status?jobId=xxx
- **Dashboard**: Separate app (handles brand/expert authentication and submissions)
- **Database**: Supabase (backend manages this)

### Deployment:
- Always push changes to Vercel (automatic deployment configured)
