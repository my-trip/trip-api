alter table "public"."tour"
  add constraint "tour_destiny_fkey"
  foreign key ("destiny")
  references "public"."address"
  ("id") on update restrict on delete restrict;
