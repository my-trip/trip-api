CREATE or replace FUNCTION tour_boarding_date(tour_row tour)
RETURNS TIMESTAMPTZ AS $$ 
    select date from boarding b where b.tour_id = tour_row.id order by date desc limit 1
$$  LANGUAGE sql STABLE;
