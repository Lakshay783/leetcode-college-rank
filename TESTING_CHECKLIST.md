# LeetCode College Rank - Testing Checklist

## 1. Purpose
This document provides a comprehensive manual Quality Assurance (QA) checklist and test plan for the LeetCode College Rank MVP. It ensures that all role-based flows, data scoping, integrations, and core features function correctly before pushing to production.

## 2. Scope
Testing covers the end-to-end functionality of the MVP, including:
- Authentication & Session Management (NextAuth, Google OAuth)
- Role-based Access Control (STUDENT, COLLEGE, ADMIN)
- Student Onboarding
- Public/Protected Leaderboard & Compare Pages
- Admin Dashboard & Manual Synchronization
- College Dashboard & Institutional CSV Import
- Global UI/UX (Navbar, Layouts, Feedback States)

*Out of Scope for MVP:* Automated unit/integration testing (e.g., Jest/Playwright), advanced CSV conflict resolution UI, PDF/Excel uploads.

## 3. Assumptions & Preconditions
- The PostgreSQL database is running and accessible via Prisma.
- Google OAuth credentials (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`) are correctly configured in `.env`.
- `AUTH_SECRET` is set.
- LeetCode's public GraphQL API is accessible from the server environment.

## 4. Test Setup & Data Recommendations
To properly execute this test plan, set up the following mock data via Prisma Studio (`npx prisma studio`):
1. **Mock Colleges**: Create at least two `College` records (e.g., "Engineering Institute", "Tech University").
2. **Test Accounts**: 
   - **Admin User**: Log in with a Google account, then manually change the `role` to `ADMIN` in Prisma Studio.
   - **College User A**: Log in, change `role` to `COLLEGE`, and assign `collegeId` to "Engineering Institute".
   - **College User B**: Log in, change `role` to `COLLEGE`, and assign `collegeId` to "Tech University".
   - **Student Users**: Log in with standard accounts, leaving them as the default `STUDENT` role for onboarding tests.
3. **CSV Test Files**: Prepare a valid CSV file matching the required headers (`name, collegeEmail, department, year, leetcodeUsername`) and an invalid CSV file (missing headers, duplicate emails).

---

## 5. Manual QA Checklist by Feature

### Authentication & Authorization
- [ ] Users can sign in via Google OAuth.
- [ ] New users default to the `STUDENT` role.
- [ ] Sessions accurately reflect the user's role and name.
- [ ] Users can successfully sign out, returning to the homepage.
- [ ] Unauthenticated users are redirected to login when accessing protected routes (`/onboarding`, `/leaderboard`, `/admin`, etc.).

### Navigation & Homepage
- [ ] Global Navbar renders correctly for logged-out users (Sign In CTA).
- [ ] Global Navbar renders correctly for logged-in users, displaying role-specific links.
- [ ] Homepage CTAs correctly route the user based on their authentication state and role (e.g., Admin goes to `/admin`, Student to `/leaderboard`).

### Student Flow
- [ ] `STUDENT` can access `/onboarding`.
- [ ] Onboarding form validates required fields (name, collegeEmail, department, year, leetcodeUsername).
- [ ] Onboarding successfully links the student to the selected college.
- [ ] Attempting to onboard with an already-used LeetCode username shows a clear conflict error.
- [ ] `STUDENT` cannot access `/admin`, `/college`, or `/college/import` (should see Forbidden).

### Leaderboard & Compare (Global)
- [ ] `/leaderboard` displays only completely onboarded students.
- [ ] Dashboard correctly sorts students by Solved Count (Desc) and then Rating (Desc).
- [ ] Search by LeetCode username works correctly.
- [ ] Filter by College works correctly.
- [ ] `/compare` accurately loads and compares two distinct students side-by-side.

### Admin Dashboard
- [ ] Accessible **only** by `ADMIN` users.
- [ ] Dashboard accurately counts Total Users, Students, Onboarded Students, Colleges, and Synced Stats.
- [ ] "Manual Stat Sync" securely hits the `/api/leaderboard/sync` endpoint.
- [ ] Sync successfully fetches stats from LeetCode GraphQL and updates `LeetCodeStats` records for onboarded students.

### College Dashboard & CSV Import
- [ ] Accessible **only** by `COLLEGE` users.
- [ ] Metrics and Leaderboard strictly show data **only** for the logged-in user's assigned `collegeId`.
- [ ] A `COLLEGE` user with no assigned `collegeId` sees a clear "Access Denied / Not Assigned" state instead of crashing.
- [ ] PapaParse correctly parses bulk CSV uploads purely in the browser.
- [ ] Missing required CSV headers instantly block the import with a clear error.
- [ ] Valid CSV import successfully creates `STUDENT` records linked to the specific college.
- [ ] Duplicate global emails or duplicate global LeetCode usernames in the CSV are safely skipped and reported in the collision log.

---

## 6. Detailed Test Cases

| ID | Scenario | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-01** | Unauthorized Access | User is logged out | Navigate manually to `/admin` | Redirected to `/login` | High |
| **TC-02** | Role-based Gating | Logged in as `STUDENT` | Navigate manually to `/admin` | Receives 403 Forbidden / Access Denied UI | High |
| **TC-03** | Onboarding Duplicates | Logged in as `STUDENT` | Submit onboarding form using a `leetcodeUsername` already belonging to someone else | API rejects with 409 Conflict; UI shows friendly error | High |
| **TC-04** | Admin Sync Trigger | Logged in as `ADMIN` | Click "Manual Stat Sync" on Admin Dashboard | Button shows loading spinner; API fetches from LeetCode; Success alert appears with count | High |
| **TC-05** | College Data Isolation | Logged in as `COLLEGE` (College A) | View College Dashboard metrics and Student table | Only students belonging to College A are visible | Critical |
| **TC-06** | CSV Import Validation | Logged in as `COLLEGE` | Upload CSV missing the `leetcodeUsername` column | Browser rejects file; alerts "Missing exact required headers" | Medium |
| **TC-07** | CSV Import Duplicates | Logged in as `COLLEGE` | Upload valid CSV where 1 row has an email already in the DB | Valid rows import successfully; 1 row fails; Collision log specifies the duplicate email | High |

---

## 7. Bug Report Template

When logging issues during QA, please use the following format:

**Title:** [Feature Area] Brief description of the issue  
**Environment:** Local / Staging / Production  
**Role Tested:** [Logged out / STUDENT / COLLEGE / ADMIN]  

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Enter '....'
4. See error

**Expected Behavior:**  
What should have happened.

**Actual Behavior:**  
What actually happened (Include error codes or console logs if applicable).

**Screenshots/Video:**  
*(Attach if visual)*

---

## 8. Pre-Deployment Signoff Checklist
- [ ] All environment variables are configured in the production environment (Vercel/Railway/etc.).
- [ ] Database URL points to the production PostgreSQL instance.
- [ ] `npx tsc --noEmit` runs with 0 errors.
- [ ] `npm run build` completes successfully.
- [ ] OAuth consent screen is configured for the production domain in Google Cloud Console.
- [ ] NextAuth `AUTH_URL`/`NEXTAUTH_URL` is set to the live production domain.
- [ ] Verified that Admin and College role assignments can be managed carefully in production DB.
