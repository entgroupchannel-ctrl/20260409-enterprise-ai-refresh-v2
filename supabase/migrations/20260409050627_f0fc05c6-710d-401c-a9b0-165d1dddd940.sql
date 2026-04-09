INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES ('ae687bb0-183e-410b-819c-6ba28741506d', 'therdpoom@entgroup.co.th', 'Therdpoom', 'admin', true)
ON CONFLICT (id) DO UPDATE SET role = 'admin';