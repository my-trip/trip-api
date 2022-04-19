CREATE TABLE "public"."traveler" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "package_access_id" uuid NOT NULL, "person_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("package_access_id") REFERENCES "public"."package_access"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_traveler_updated_at"
BEFORE UPDATE ON "public"."traveler"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_traveler_updated_at" ON "public"."traveler" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
