CREATE TABLE "public"."state" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "uf" varchar, "ibge" varchar, "country_id" integer NULL, "ddd" jsonb, "name" varchar NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_state_updated_at"
BEFORE UPDATE ON "public"."state"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_state_updated_at" ON "public"."state" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
