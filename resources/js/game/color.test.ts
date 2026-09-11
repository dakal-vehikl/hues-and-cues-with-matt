import { describe, expect, it } from 'vite-plus/test';
import {
    fitToSrgbGamut,
    isDisplayable,
    perceptualDistance,
    toHex,
} from './color';

describe('rendering a colour for the screen', () => {
    it('renders a neutral light colour as a light grey', () => {
        expect(toHex({ lightness: 1, chroma: 0, hue: 0 })).toBe('#ffffff');
        expect(toHex({ lightness: 0, chroma: 0, hue: 0 })).toBe('#000000');
    });

    it('renders a mid neutral colour with equal red, green and blue', () => {
        const hex = toHex({ lightness: 0.6, chroma: 0, hue: 210 });

        expect(hex.slice(1, 3)).toBe(hex.slice(3, 5));
        expect(hex.slice(3, 5)).toBe(hex.slice(5, 7));
    });

    it('renders a colourful orange as an orange', () => {
        const hex = toHex({ lightness: 0.7, chroma: 0.15, hue: 50 });
        const red = Number.parseInt(hex.slice(1, 3), 16);
        const green = Number.parseInt(hex.slice(3, 5), 16);
        const blue = Number.parseInt(hex.slice(5, 7), 16);

        expect(red).toBeGreaterThan(green);
        expect(green).toBeGreaterThan(blue);
    });
});

describe('keeping colours inside the screen gamut', () => {
    it('leaves a colour the screen can show alone', () => {
        const displayable = { lightness: 0.6, chroma: 0.05, hue: 120 };

        expect(fitToSrgbGamut(displayable)).toEqual(displayable);
    });

    it('lowers the chroma of a colour the screen cannot show', () => {
        const impossible = { lightness: 0.6, chroma: 0.9, hue: 120 };
        const fitted = fitToSrgbGamut(impossible);

        expect(fitted.chroma).toBeLessThan(impossible.chroma);
        expect(isDisplayable(fitted)).toBe(true);
    });

    it('keeps the lightness and the hue while it lowers the chroma', () => {
        const impossible = { lightness: 0.42, chroma: 0.9, hue: 275 };
        const fitted = fitToSrgbGamut(impossible);

        expect(fitted.lightness).toBe(impossible.lightness);
        expect(fitted.hue).toBe(impossible.hue);
    });
});

describe('measuring how far apart two colours look', () => {
    it('gives no distance between a colour and itself', () => {
        const color = { lightness: 0.5, chroma: 0.1, hue: 30 };

        expect(perceptualDistance(color, color)).toBe(0);
    });

    it('gives a larger distance to the colour that looks less alike', () => {
        const olive = { lightness: 0.5, chroma: 0.1, hue: 100 };
        const nearlyOlive = { lightness: 0.51, chroma: 0.1, hue: 102 };
        const violet = { lightness: 0.5, chroma: 0.1, hue: 300 };

        expect(perceptualDistance(olive, nearlyOlive)).toBeLessThan(
            perceptualDistance(olive, violet),
        );
    });
});
