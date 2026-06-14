@echo off
cd /d "%~dp0"

echo === Kantaka Sodhana - Git Push Script ===
echo.

REM Remove broken .git if it exists with incomplete objects
if exist ".git" (
    if not exist ".git\objects" (
        echo Removing broken .git directory...
        rmdir /s /q .git
    )
)

REM Initialize if no valid repo
if not exist ".git\objects" (
    echo Initializing git repository...
    git init
    git branch -M main
    git remote add origin https://github.com/Sumanth-tks/kanta-sodhana-web-app.git
)

REM Configure user
git config user.email "mathireddysumanth@gmail.com"
git config user.name "Sumanth"

REM Stage all files
echo.
echo Staging all files...
git add -A

REM Show status
echo.
echo === Files to be committed: ===
git status --short

REM Commit
echo.
echo Committing...
git commit -m "feat: full Supabase integration, contact form, auth service, admin dashboard

- Created Supabase project (kjadudctpnweailiaeor) with 4 tables:
  users, contact_submissions, documents, audit_log (all with RLS)
- Added src/lib/supabase.ts client library
- Added /api/contact Next.js API route (saves to Supabase)
- Wired contact page with loading state and error handling
- Updated admin dashboard to match new DB schema (is_approved)
- Updated auth service .env with correct DB connection
- Added phone/purpose columns to users table for auth compatibility
- Updated init-db.sql to match Supabase schema
- Updated all env files with new Supabase credentials"

REM Push
echo.
echo Pushing to GitHub...
git push -u origin main --force

echo.
echo === Done! ===
pause
