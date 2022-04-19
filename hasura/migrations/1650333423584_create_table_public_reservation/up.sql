CREATE TABLE "public"."reservation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "status" bpchar NOT NULL, "price" integer NOT NULL, "total_price" integer NOT NULL, "payment_limit_date" timestamptz NOT NULL, "package_id" uuid NOT NULL, "person_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("package_id") REFERENCES "public"."package"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_reservation_updated_at"
BEFORE UPDATE ON "public"."reservation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_reservation_updated_at" ON "public"."reservation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
