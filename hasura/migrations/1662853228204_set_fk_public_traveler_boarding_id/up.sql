alter table "public"."traveler"
  add constraint "traveler_boarding_id_fkey"
  foreign key ("boarding_id")
  references "public"."boarding"
  ("id") on update restrict on delete restrict;
