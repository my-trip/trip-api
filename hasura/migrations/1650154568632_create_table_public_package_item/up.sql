CREATE TABLE "public"."package_item" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" bpchar NOT NULL, "description" bpchar, "is_event" boolean NOT NULL DEFAULT false, "start_date" timestamptz, "end_date" timestamptz, "package_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("package_id") REFERENCES "public"."package"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_package_item_updated_at"
BEFORE UPDATE ON "public"."package_item"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_package_item_updated_at" ON "public"."package_item" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
