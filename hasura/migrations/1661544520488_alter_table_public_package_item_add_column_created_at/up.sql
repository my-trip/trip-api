alter table "public"."package_item" add column "created_at" timestamptz
 null default now();
