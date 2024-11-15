import { type SchemaTypeDefinition } from "sanity";
import { service } from "@/sanity/schemaTypes/service";
import { author } from "@/sanity/schemaTypes/author";
import { playlist } from "@/sanity/schemaTypes/playlist";
import { role } from "@/sanity/schemaTypes/role";

export const schema = {
  types: [service, author, playlist, role] as SchemaTypeDefinition[],
};
