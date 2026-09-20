import { describe, expect, it } from 'vitest';
import {
  FIELD_TYPE_GUIDE,
  NEVER_INVENT_HEAD,
  NEVER_INVENT_TAIL,
  RULES_IN_BOTH,
  USE_CAPACITY_NOT_DUPLICATE_ROWS,
  USE_DATE_AND_TIME_FIELDS,
  neverInventRule,
} from './signup-rules';

describe('shared signup rules', () => {
  it('has no empty rule', () => {
    expect(RULES_IN_BOTH.length).toBeGreaterThan(0);
    for (const rule of [FIELD_TYPE_GUIDE, ...RULES_IN_BOTH]) {
      expect(rule.trim()).not.toBe('');
    }
  });

  it('keeps the date placeholder out of shared text', () => {
    // The prompt renderer replaces only the first {{TODAY}} it finds.
    for (const rule of [FIELD_TYPE_GUIDE, ...RULES_IN_BOTH]) {
      expect(rule).not.toContain('{{TODAY}}');
    }
  });
});

describe('rules written for assistants', () => {
  it('are not yet shared with the Magic Compose prompt', () => {
    // Adding one there changes the prompt's bytes, which needs an eval run.
    for (const rule of [USE_DATE_AND_TIME_FIELDS, USE_CAPACITY_NOT_DUPLICATE_ROWS]) {
      expect(rule.trim()).not.toBe('');
      expect(RULES_IN_BOTH).not.toContain(rule);
    }
  });
});

describe('neverInventRule', () => {
  it.each(['drafter', 'assistant'] as const)('opens and closes the same way for the %s', (who) => {
    const rule = neverInventRule(who);
    expect(rule.startsWith(NEVER_INVENT_HEAD)).toBe(true);
    expect(rule.endsWith(NEVER_INVENT_TAIL)).toBe(true);
  });

  it('tells the drafter to fall back to placeholder slots', () => {
    expect(neverInventRule('drafter')).toContain('placeholder');
  });

  it('tells the assistant to ask instead, since it can', () => {
    const rule = neverInventRule('assistant');
    expect(rule).toContain('ask');
    expect(rule).not.toContain('placeholder');
  });
});
