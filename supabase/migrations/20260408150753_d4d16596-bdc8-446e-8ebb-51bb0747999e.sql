INSERT INTO public.user_roles (user_id, role)
VALUES ('dad43044-47fe-496a-b74f-d1fdc688f07c', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;