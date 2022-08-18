alter table "public"."boarding" alter column "date" drop not null;
alter table "public"."boarding" add column "date" time;
