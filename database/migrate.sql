-- Migration script to transfer data from JSON to Supabase
-- Run this after setting up the schema and configuring your application

-- Sample data insertion (replace with your actual data)
-- This shows the structure for migrating from your JSON file

-- Insert sample user (you'll need to hash passwords properly)
INSERT INTO users (email, password_hash) VALUES 
('admin@snipurl.com', '$2b$10$example_hashed_password_here');

-- Get the user ID for foreign key reference
-- In practice, you'll get this from your migration script

-- Sample links data (replace with data from your db.json)
-- INSERT INTO links (original_url, alias, name, clicks, user_id, created_at) VALUES 
-- ('https://example.com', 'example', 'Example Link', 0, (SELECT id FROM users WHERE email = 'admin@snipurl.com'), NOW());

-- Sample click records (if you have historical data)
-- INSERT INTO click_records (link_id, country, city, user_agent, ip_hash, timestamp) VALUES 
-- ((SELECT id FROM links WHERE alias = 'example'), 'US', 'New York', 'Mozilla/5.0...', 'hashed_ip', NOW());

-- Verify migration
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Links' as table_name, COUNT(*) as count FROM links
UNION ALL
SELECT 'Click Records' as table_name, COUNT(*) as count FROM click_records;
