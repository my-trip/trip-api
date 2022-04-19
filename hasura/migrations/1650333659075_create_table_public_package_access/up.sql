CREATE TABLE "public"."package_access" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "purchase_id" uuid NOT NULL, "package_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("package_id") REFERENCES "public"."package"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("purchase_id") REFERENCES "public"."purchase"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_package_access_updated_at"
BEFORE UPDATE ON "public"."package_access"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_package_access_updated_at" ON "public"."package_access" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
