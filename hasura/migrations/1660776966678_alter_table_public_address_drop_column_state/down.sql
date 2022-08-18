alter table "public"."address" alter column "state" drop not null;
alter table "public"."address" add column "state" varchar;
