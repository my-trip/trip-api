alter table "public"."tour"
  add constraint "tour_agency_id_fkey"
  foreign key ("agency_id")
  references "public"."agency"
  ("id") on update restrict on delete restrict;
