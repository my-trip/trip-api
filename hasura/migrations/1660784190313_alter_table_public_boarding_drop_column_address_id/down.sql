alter table "public"."boarding" alter column "address_id" drop not null;
alter table "public"."boarding" add column "address_id" int4;
