import { describe, it, expect } from 'vitest';
import { generateNextId } from './idGenerator.js';
describe('ID Generator Logic', () => {
    it('returns the first ID if the list is empty', () => {
        const result = generateNextId([], '#BK-', 101);
        expect(result).toBe('#BK-101');
    });
    it('finds the highest ID and adds 1', () => {
        const mockItems = [{ id: '#BK-101' }, { id: '#BK-105' }, { id: '#BK-102' }];
        const result = generateNextId(mockItems, '#BK-', 101);
        expect(result).toBe('#BK-106');
    });
    it('works with IDs as numbers or strings', () => {
        const mockItems = [{ id: 101 }, { id: '#BK-102' }];
        const result = generateNextId(mockItems, '#BK-', 101);
        expect(result).toBe('#BK-103');
    });
});
//# sourceMappingURL=idGenerator.test.js.map