#!/usr/bin/env node

import('../dist/index.js').catch((err) => {
  console.error('\x1b[31mFatal: mechbuild failed to initialize.\x1b[0m');
  console.error(err?.message ?? err);
  process.exit(1);
});
