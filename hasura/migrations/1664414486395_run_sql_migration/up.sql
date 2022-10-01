CREATE OR REPLACE FUNCTION public.package_quantity_available(package_row package)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$ 
   select  ( 
	( select quantity from package p where p.id = package_row.id)
	- 
	( 
		select count(*)  from package_access pa where package_id = package_row.id
		and exists (
			select * from purchase p2 where 
				p2.status in ('confirmated', 'waiting_payment')
				and
				p2.package_access_id = pa.id
		)
	)
)

$function$;
