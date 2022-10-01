CREATE or replace FUNCTION package_quantity_available(package_row package)
RETURNS BIGINT AS $$ 
    select  ( ( select quantity from package p where p.id = package_row.id) - ( select count(*)  from package_access pa where package_id = package_row.id) )
$$  LANGUAGE sql STABLE;
