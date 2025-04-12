import { describe, it, expect } from 'vitest';
import { buildSQLFromPattern } from '../buildSQLFromPattern.js';

describe('buildSQLFromPattern', () => {
  it('строит SQL с точными совпадениями', () => {
    const pattern = [
      { letter: 'а', status: 'correct' },
      { letter: 'б', status: 'absent' },
      { letter: 'в', status: 'absent' },
      { letter: 'г', status: 'absent' },
      { letter: 'д', status: 'correct' },
    ];

    const { sql, params } = buildSQLFromPattern(pattern);

    expect(sql).toContain('word LIKE ?');
    expect(params[0]).toBe('а___д');
    expect(sql).toContain('NOT LIKE');
    expect(params).toContain('%б%');
    expect(params).toContain('%в%');
    expect(params).toContain('%г%');
  });

  it('учитывает \"present\" с исключением позиции', () => {
    const pattern = [
      { letter: 'е', status: 'absent' },
      { letter: 'ж', status: 'present' },
      { letter: 'з', status: 'absent' },
      { letter: 'и', status: 'present' },
      { letter: 'й', status: 'absent' },
    ];

    const { sql, params } = buildSQLFromPattern(pattern);

    expect(sql).toContain('word LIKE ?');
    expect(params[0]).toBe('_____');
    expect(params).toContain('%ж%');
    expect(params).toContain('%и%');
    expect(sql).toContain('NOT LIKE _ж___');
    expect(sql).toContain('NOT LIKE ___и_');
  });
});
