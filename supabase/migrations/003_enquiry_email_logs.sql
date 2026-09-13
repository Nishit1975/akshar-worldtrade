-- ==============================================================================
-- AKSHAR WORLDTRADE — ENQUIRY EMAIL STATUS TRACKING (OPTIONAL)
-- Migration: 003_enquiry_email_logs.sql
-- Description: Adds tracking columns for server-side email notifications and buyer auto-acknowledgement.
-- ==============================================================================

ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS email_notification_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS buyer_ack_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_error TEXT;
