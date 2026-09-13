# AKSHAR WORLDTRADE — Supabase Backend & Database Setup Guide

This guide explains how to set up the **Supabase PostgreSQL** backend, Row Level Security (RLS) policies, Admin authorization, and Storage for AKSHAR WORLDTRADE.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or sign up.
2. Click **New Project**.
3. Fill in:
   - **Name**: `akshar-worldtrade` (or your preferred name)
   - **Database Password**: Choose a strong, secure password.
   - **Region**: Choose the region closest to your target audience (e.g. `South Asia (Mumbai)`).
   - **Pricing Plan**: Free or Pro.
4. Click **Create new project** and wait 1–2 minutes for provisioning.

---

## 2. Obtain API Credentials

1. In your Supabase Project Dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Copy the following credentials:
   - **Project URL**: `https://<your-project-ref>.supabase.co`
   - **Project API Keys**: Copy the `anon` / `public` key (do **NOT** use `service_role` in the frontend!).

---

## 3. Configure Local Environment Variables

1. In your project root (`E:\akshar-worldtrade`), copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...<your-anon-key>
   ```
3. Ensure `.env` is listed in `.gitignore` (already configured).

---

## 4. Run the SQL Migration

1. In the Supabase dashboard, go to the **SQL Editor** (left navigation).
2. Click **+ New query**.
3. Copy the full content of [`supabase/migrations/001_initial_schema.sql`](./migrations/001_initial_schema.sql) and paste it into the editor.
4. Click **Run** (or `Ctrl+Enter`).
5. Confirm that the following tables and functions were created:
   - `public.categories`
   - `public.products`
   - `public.enquiries`
   - `public.admin_users`
   - `public.is_admin()` function
   - `public.handle_updated_at()` trigger function

---

## 5. Run the Seed Data

1. In the **SQL Editor**, open a new query tab.
2. Copy the content of [`supabase/seed.sql`](./seed.sql) and paste it into the editor.
3. Click **Run**.
4. Confirm that the 4 starter categories are inserted in the `categories` table.

---

## 6. Create Your First Administrator

Admin accounts use standard Supabase Authentication with an authorization link in the `public.admin_users` table.

### Step 6.1: Create an Auth User
1. In the Supabase dashboard, navigate to **Authentication** → **Users**.
2. Click **Add user** → **Create user**.
3. Enter the administrator's email and a secure password.
4. Check **Auto Confirm User?** (or verify via email).
5. Click **Create user**.
6. Copy the **User UID** (UUID format, e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 6.2: Authorize the User as Admin
1. Open the **SQL Editor**.
2. Run the following SQL query, replacing the UUID with your actual user UID:
   ```sql
   INSERT INTO public.admin_users (id)
   VALUES ('<PASTE-YOUR-USER-UID-HERE>')
   ON CONFLICT (id) DO NOTHING;
   ```
3. Now, this user will have full administrative rights (`public.is_admin()` evaluates to `true`).

---

## 7. Storage Bucket Verification

The migration script (`001_initial_schema.sql`) automatically creates and configures the `product-images` bucket.

To verify in the Supabase Dashboard:
1. Go to **Storage** → **Buckets**.
2. Confirm `product-images` exists and is marked as **Public**.
3. Confirm that RLS policies on `storage.objects` allow:
   - **Public**: `SELECT` (view images).
   - **Admins only**: `INSERT`, `UPDATE`, `DELETE`.

---

## 8. Security Architecture & RLS Matrix

| Entity | Role | Read / SELECT | Insert / CREATE | Update / EDIT | Delete / REMOVE |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **categories** | Public / Anon | ✅ All categories | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **categories** | Admin User | ✅ All categories | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **products** | Public / Anon | ✅ `status = 'published'` only | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **products** | Authenticated Non-Admin | ✅ `status = 'published'` only | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **products** | Admin User | ✅ All (published & drafts) | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **enquiries** | Public / Anon | ❌ Forbidden | ✅ Submit Enquiry | ❌ Forbidden | ❌ Forbidden |
| **enquiries** | Admin User | ✅ All enquiries | ✅ Allowed | ✅ Update status | ✅ Allowed |
| **admin_users** | Authenticated User | ✅ Own record only | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **admin_users** | Admin User | ✅ All records | ✅ Add admins | ❌ Forbidden | ✅ Remove admins |
| **Storage (`product-images`)** | Public / Anon | ✅ View images | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **Storage (`product-images`)** | Admin User | ✅ View images | ✅ Upload images | ✅ Replace images | ✅ Delete images |
