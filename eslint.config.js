import globals from "globals";
import pluginJs from "@eslint/js";

export default {
  env: {
    node: true, 
    es2021: true 
  },
  extends: [
    pluginJs.configs.recommended 
  ],
  globals: {
    ...globals.node 
  },
  parserOptions: {
    ecmaVersion: 12 
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn' 
  }
};