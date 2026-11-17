-- Image assets were converted to WebP and the original .png/.jpg files removed.
-- Repoint stored references (rows created before the conversion) to the .webp files.
-- hero-container-ship.jpg and logo.png still exist and are restored after the bulk replace.
CREATE FUNCTION pg_temp.fix_img(t text) RETURNS text AS $$
  SELECT replace(replace(
    regexp_replace(t, '(/images/[A-Za-z0-9_./-]*?)\.(png|jpe?g)', '\1.webp', 'g'),
    '/images/hero-container-ship.webp', '/images/hero-container-ship.jpg'),
    '/images/logo.webp', '/images/logo.png')
$$ LANGUAGE sql IMMUTABLE;

UPDATE "articles" SET
  "featuredImage" = pg_temp.fix_img("featuredImage"),
  "ogImage"       = pg_temp.fix_img("ogImage"),
  "bodyHtml"      = pg_temp.fix_img("bodyHtml"),
  "bodyJson"      = pg_temp.fix_img("bodyJson");
UPDATE "categories" SET "image" = pg_temp.fix_img("image");
UPDATE "users" SET "avatar" = pg_temp.fix_img("avatar");
UPDATE "resources" SET "thumbnail" = pg_temp.fix_img("thumbnail");
