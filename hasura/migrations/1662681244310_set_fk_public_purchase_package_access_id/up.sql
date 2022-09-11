alter table "public"."purchase"
  add constraint "purchase_package_access_id_fkey"
  foreign key ("package_access_id")
  references "public"."package_access"
  ("id") on update restrict on delete restrict;
