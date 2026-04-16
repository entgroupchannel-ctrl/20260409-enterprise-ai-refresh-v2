-- อัปเดต role ของ entgroupchannel@gmail.com เป็น sales
UPDATE public.users SET role = 'sales' WHERE email = 'entgroupchannel@gmail.com';

-- สร้าง staff_details ถ้ายังไม่มี
INSERT INTO public.staff_details (user_id)
SELECT id FROM public.users WHERE email = 'entgroupchannel@gmail.com'
ON CONFLICT (user_id) DO NOTHING;