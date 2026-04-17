UPDATE notifications
SET message = trim(regexp_replace(message, '[^\x00-\x7Fก-๛a-zA-Z0-9\s\.\-:_/(),#%฿"''`\n]+', '', 'g'))
WHERE message IS NOT NULL AND octet_length(message) <> char_length(message);