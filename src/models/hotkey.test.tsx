import { is_match_hotkey, Hotkey } from './hotkey';

describe('is_match_hotkey', () => {
    it('returns true when all properties match', () => {
        const e = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: true, shift: false, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(true);
    });

    it('returns false when meta key does not match', () => {
        const e = new KeyboardEvent('keydown', { key: 'a', metaKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: true, shift: false, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(false);
    });

    it('returns false when key does not match', () => {
        const e = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: true, shift: false, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(false);
    });

    it('returns true when modifier keys are not required', () => {
        const e = new KeyboardEvent('keydown', { key: 'a', altKey: true, metaKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: true, shift: false, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(false);
    });

    it('returns true when shift key matches', () => {
        const e = new KeyboardEvent('keydown', { key: 'A', shiftKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: false, shift: true, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(true);
    });

    it('returns false when shift key does not match', () => {
        const e = new KeyboardEvent('keydown', { key: 'a', shiftKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: false, shift: true, key: 'A' };
        expect(is_match_hotkey(e, hotkey)).toBe(true);
    });
    it('修飾キーだけ押した時', () => {
        const e = new KeyboardEvent('keydown', { key: '', shiftKey: true });
        const hotkey: Hotkey = { alt: false, meta: false, ctrl: false, shift: true, key: 'a' };
        expect(is_match_hotkey(e, hotkey)).toBe(false);
    });

});
