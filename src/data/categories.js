/**
 * DEPRECATED — This static categories array has been superseded by the
 * Supabase `categories` table which is the single source of truth.
 *
 * The `categories` service (`src/services/categories.js`) now handles
 * all category reads and writes via the database.
 *
 * This file is kept as an empty stub to avoid breaking any import
 * that may reference it (e.g. scripts/generate-catalogue.js).
 *
 * DO NOT add hardcoded categories here.
 */
export const categories = []

export default categories
