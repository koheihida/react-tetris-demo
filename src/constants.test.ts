import { GRID_WIDTH, GRID_HEIGHT } from './constants';

describe('constants', () => {
  test('GRID_WIDTH should be 10', () => {
    expect(GRID_WIDTH).toBe(10);
  });

  test('GRID_HEIGHT should be 20', () => {
    expect(GRID_HEIGHT).toBe(20);
  });
});