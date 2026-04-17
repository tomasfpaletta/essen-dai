// Entry point para Hostinger Node.js
// Hostinger asigna el puerto via process.env.PORT automaticamente
process.env.PORT = process.env.PORT || 3000;
require("./.next/standalone/server.js");
