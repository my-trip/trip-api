alter table "public"."item"
  add constraint "item_tour_id_fkey"
  foreign key ("tour_id")
  references "public"."tour"
  ("id") on update restrict on delete restrict;
