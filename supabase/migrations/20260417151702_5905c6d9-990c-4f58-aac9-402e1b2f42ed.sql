-- Strip emoji prefixes from notification titles (multibyte UTF-8 chars at start)
UPDATE notifications
SET title = trim(regexp_replace(title, '[^\x00-\x7Fก-๛a-zA-Z0-9\s\.\-:_/(),#%]+', '', 'g'))
WHERE octet_length(title) <> char_length(title);