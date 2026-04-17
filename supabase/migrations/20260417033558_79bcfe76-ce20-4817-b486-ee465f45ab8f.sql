CREATE OR REPLACE FUNCTION public.notify_new_chat_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_quote RECORD;
  v_customer_user_id uuid;
BEGIN
  IF NEW.message_type IN ('status_change','system') THEN RETURN NEW; END IF;

  SELECT * INTO v_quote FROM quote_requests WHERE id = NEW.quote_id;
  IF NOT FOUND THEN RETURN NEW; END IF;

  IF NEW.sender_role = 'customer' THEN
    IF v_quote.assigned_to IS NOT NULL AND v_quote.assigned_to != NEW.sender_id THEN
      INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
      VALUES (
        v_quote.assigned_to, NEW.quote_id,
        '💬 ข้อความใหม่: ' || COALESCE(v_quote.quote_number, '#'),
        COALESCE(v_quote.customer_name, 'ลูกค้า') || ': ' || LEFT(NEW.content, 80),
        'new_message', 'normal',
        '/admin/quotes/' || NEW.quote_id, 'ตอบกลับ'
      );
    END IF;

  ELSIF NEW.sender_role IN ('admin','sales') THEN
    -- หา user_id ของลูกค้าจาก customer_email
    SELECT id INTO v_customer_user_id FROM auth.users WHERE email = v_quote.customer_email LIMIT 1;

    IF v_customer_user_id IS NOT NULL AND v_customer_user_id != NEW.sender_id THEN
      INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
      VALUES (
        v_customer_user_id, NEW.quote_id,
        '💬 ทีมขายตอบกลับ: ' || COALESCE(v_quote.quote_number, '#'),
        NEW.sender_name || ': ' || LEFT(NEW.content, 80),
        'new_message', 'normal',
        '/dashboard?id=' || NEW.quote_id, 'ดูข้อความ'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;