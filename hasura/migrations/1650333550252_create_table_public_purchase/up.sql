CREATE TABLE "public"."purchase" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "status" varchar NOT NULL, "reservation_id" uuid, "price" integer NOT NULL, "person_id" uuid NOT NULL, "package_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("package_id") REFERENCES "public"."package"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_purchase_updated_at"
BEFORE UPDATE ON "public"."purchase"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_purchase_updated_at" ON "public"."purchase" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
