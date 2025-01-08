import { DatabaseTestUtils } from "./src/utils/database";

beforeAll(async () => {
  await DatabaseTestUtils.initDatabase();
});

afterAll(async () => {
  await DatabaseTestUtils.closeDatabase();
});

beforeEach(async () => {
  await DatabaseTestUtils.cleanupDatabase();
});
