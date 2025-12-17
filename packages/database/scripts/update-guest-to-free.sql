-- Update existing users with GUEST plan to FREE plan
-- This script updates all logged-in users who have GUEST plan to FREE plan

UPDATE "user"
SET plan = 'FREE'
WHERE plan = 'GUEST';
