"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserClient = exports.supabaseAnon = exports.supabaseAdmin = exports.prisma = void 0;
const client_1 = require("./client");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
const supabase_1 = require("./supabase");
Object.defineProperty(exports, "supabaseAdmin", { enumerable: true, get: function () { return supabase_1.supabaseAdmin; } });
Object.defineProperty(exports, "supabaseAnon", { enumerable: true, get: function () { return supabase_1.supabaseAnon; } });
Object.defineProperty(exports, "createUserClient", { enumerable: true, get: function () { return supabase_1.createUserClient; } });
console.log('[DEBUG] database/src/index.ts: EXECUTING');
exports.default = {
    prisma: client_1.prisma,
    supabaseAdmin: supabase_1.supabaseAdmin,
    supabaseAnon: supabase_1.supabaseAnon,
    createUserClient: supabase_1.createUserClient
};
//# sourceMappingURL=index.js.map