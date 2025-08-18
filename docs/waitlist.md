# Waitlist Implementation - 80/20 Approach

This is the simplified waitlist implementation focused on the core functionality needed for launch.

## Current Implementation (MVP)
- Basic form validation with ArkType
- Turnstile bot protection
- Convex database storage
- Fire-and-forget Notion sync
- Simple duplicate email handling

## What Happens Later (If Needed)

### Spam Problem → Add Rate Limiting
- **When**: If we get obvious spam or bot submissions
- **Implementation**: Add rate limiting by IP in Convex action
- **Scope**: ~2 hours to implement session-based rate limiting

### Notion Fails → Add Retry Logic  
- **When**: If Notion API becomes unreliable or we hit rate limits
- **Implementation**: Add retry queue with exponential backoff
- **Scope**: ~4 hours to implement proper retry mechanism with dead letter queue

### Security Concerns → Add Session Management
- **When**: If we detect sophisticated attacks or need user tracking
- **Implementation**: Add proper session management and CSRF protection
- **Scope**: ~6 hours to implement full session security

### Need Analytics → Add Monitoring
- **When**: If we need detailed submission analytics or error tracking
- **Implementation**: Add logging, metrics, and monitoring dashboard
- **Scope**: ~8 hours to implement comprehensive monitoring

## Environment Variables Required

Add these to your `.env` file in the project root:

```bash
# Cloudflare Turnstile (Bot Protection)
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here

# Notion Integration  
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### Getting the Keys:

**Turnstile Keys:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Turnstile
3. Create a new site
4. Copy Site Key → `PUBLIC_TURNSTILE_SITE_KEY`
5. Copy Secret Key → `TURNSTILE_SECRET_KEY`

**Notion Integration:**
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create new integration
3. Copy Internal Integration Token → `NOTION_API_KEY`
4. Create a database in Notion with these properties:
   - Email (type: Email)
   - Experience (type: Select with options: 0-3, 3-5, 6-10, 10+)
   - Tech Stack (type: Multi-select)
   - Job Search Status (type: Select with options: Actively searching, Passively looking, Just exploring, Planning to search soon)
   - Company Stage (type: Multi-select)
   - Submitted At (type: Date)
5. Share the database with your integration
6. Copy database ID from URL → `NOTION_DATABASE_ID`

## Files Modified
- `packages/backend/convex/schema.ts` - Added waitlist table
- `packages/backend/convex/waitlist.ts` - Core submission logic
- `packages/backend/convex/validation.ts` - ArkType schemas
- `apps/web/src/components/WaitlistForm.tsx` - Frontend integration

---

**Remember**: Ship the simple version. Optimize when you have real problems.
