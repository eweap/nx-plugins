import { createRequire } from 'node:module';
import { join } from 'node:path';
import { expect } from 'vitest';

const { createToMatchDirSnapshot } = createRequire(
  join(process.cwd(), 'package.json'),
)('vitest-directory-snapshot');

expect.extend({
  toMatchDirSnapshot: createToMatchDirSnapshot({
    snapshotDirectoryName: '__snapshots__',
  }),
});