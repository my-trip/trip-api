alter table "public"."package_item" alter column "name" drop not null;
alter table "public"."package_item" add column "name" varchar;
