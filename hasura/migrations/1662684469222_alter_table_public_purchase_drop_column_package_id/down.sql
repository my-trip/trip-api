alter table "public"."purchase" alter column "package_id" drop not null;
alter table "public"."purchase" add column "package_id" uuid;
