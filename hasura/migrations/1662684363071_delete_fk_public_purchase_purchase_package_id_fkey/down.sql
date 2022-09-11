alter table "public"."purchase"
  add constraint "purchase_package_id_fkey"
  foreign key ("package_id")
  references "public"."package"
  ("id") on update restrict on delete restrict;
