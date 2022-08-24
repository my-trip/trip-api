CREATE TABLE "public"."package_item" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "package_id" uuid NOT NULL, "item_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("package_id") REFERENCES "public"."package"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON UPDATE restrict ON DELETE restrict);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
