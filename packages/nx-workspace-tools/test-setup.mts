import { createRequire } from 'node:module';
import { expect } from 'vitest';

const { createToMatchDirSnapshot } = createRequire(import.meta.url)(
  'vitest-directory-snapshot',
);

expect.extend({
  toMatchDirSnapshot: createToMatchDirSnapshot({
    snapshotDirectoryName: '__snapshots__',
  }),
});
