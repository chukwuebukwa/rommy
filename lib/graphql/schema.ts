// lib/graphql/schema.ts
import { builder } from './builder';

// Import all types and queries to register them
import './types';
import './queries';

// Build and export the final schema
export const schema = builder.toSchema();

