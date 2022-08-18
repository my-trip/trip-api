alter table "public"."address" alter column "country" drop not null;
alter table "public"."address" add column "country" varchar;
