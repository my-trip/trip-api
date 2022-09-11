alter table "public"."package_access"
  add constraint "package_access_purchase_id_fkey"
  foreign key (purchase_id)
  references "public"."purchase"
  (id) on update restrict on delete restrict;
alter table "public"."package_access" alter column "purchase_id" drop not null;
alter table "public"."package_access" add column "purchase_id" uuid;
