import { describe, expect, it } from 'vite-plus/test';
import { isDisplayable, perceptualDistance } from './color';
import {
    COLUMN_COUNT,
    ROW_COUNT,
    SWATCH_COUNT,
    coordinateOf,
    generateBoard,
    parseCoordinate,
    swatchAt,
} from './board';

const board = generateBoard();

describe('the shape of the Board', () => {
    it('has 480 Swatches, in 16 rows of 30 columns', () => {
        expect(SWATCH_COUNT).toBe(480);
        expect(ROW_COUNT).toBe(16);
        expect(COLUMN_COUNT).toBe(30);
        expect(board.swatches).toHaveLength(480);
    });

    it('puts A1 at the top left and P30 at the bottom right', () => {
        expect(board.swatches[0].coordinate).toBe('A1');
        expect(board.swatches[0].rowIndex).toBe(0);
        expect(board.swatches[0].columnIndex).toBe(0);

        expect(board.swatches[479].coordinate).toBe('P30');
        expect(board.swatches[479].rowIndex).toBe(15);
        expect(board.swatches[479].columnIndex).toBe(29);
    });

    it('gives every Swatch its own Coordinate', () => {
        const coordinates = new Set(
            board.swatches.map((swatch) => swatch.coordinate),
        );

        expect(coordinates.size).toBe(480);
    });

    it('finds a Swatch by its Coordinate', () => {
        expect(swatchAt(board, 'C12')?.rowIndex).toBe(2);
        expect(swatchAt(board, 'C12')?.columnIndex).toBe(11);
    });

    it('finds no Swatch outside the Board', () => {
        expect(swatchAt(board, 'Q1')).toBeNull();
        expect(swatchAt(board, 'A31')).toBeNull();
    });
});

describe('reading and writing a Coordinate', () => {
    it('writes the row letter before the column number', () => {
        expect(coordinateOf(0, 0)).toBe('A1');
        expect(coordinateOf(2, 11)).toBe('C12');
        expect(coordinateOf(15, 29)).toBe('P30');
    });

    it('reads a Coordinate back into a row and a column', () => {
        expect(parseCoordinate('C12')).toEqual({
            rowIndex: 2,
            columnIndex: 11,
        });
    });

    it('refuses a Coordinate that is not on the Board', () => {
        expect(parseCoordinate('Q1')).toBeNull();
        expect(parseCoordinate('A31')).toBeNull();
        expect(parseCoordinate('A0')).toBeNull();
        expect(parseCoordinate('12C')).toBeNull();
        expect(parseCoordinate('')).toBeNull();
    });
});

describe('the colours on the Board', () => {
    it('can show every Swatch on a screen', () => {
        const impossible = board.swatches.filter(
            (swatch) => !isDisplayable(swatch.color),
        );

        expect(impossible).toEqual([]);
    });

    it('gives every Swatch a hex colour', () => {
        const malformed = board.swatches.filter(
            (swatch) => !/^#[0-9a-f]{6}$/.test(swatch.hex),
        );

        expect(malformed).toEqual([]);
    });

    it('puts a near grey Swatch at the centre of the Board', () => {
        expect(swatchAt(board, 'I16')?.color.chroma).toBeLessThan(0.01);
    });

    it('makes the colours stronger towards the border', () => {
        const centre = swatchAt(board, 'I16')!;
        const middle = swatchAt(board, 'E16')!;
        const border = swatchAt(board, 'A16')!;

        expect(centre.color.chroma).toBeLessThan(middle.color.chroma);
        expect(middle.color.chroma).toBeLessThan(border.color.chroma);
    });

    it('makes the colours darker towards the border', () => {
        const centre = swatchAt(board, 'I16')!;
        const border = swatchAt(board, 'A16')!;

        expect(border.color.lightness).toBeLessThan(centre.color.lightness);
    });

    it('puts a different hue family in each corner', () => {
        expect(swatchAt(board, 'A1')!.color.hue).toBeGreaterThan(15);
        expect(swatchAt(board, 'A1')!.color.hue).toBeLessThan(60);

        expect(swatchAt(board, 'A30')!.color.hue).toBeGreaterThan(285);
        expect(swatchAt(board, 'A30')!.color.hue).toBeLessThan(330);

        expect(swatchAt(board, 'P1')!.color.hue).toBeGreaterThan(100);
        expect(swatchAt(board, 'P1')!.color.hue).toBeLessThan(150);

        expect(swatchAt(board, 'P30')!.color.hue).toBeGreaterThan(200);
        expect(swatchAt(board, 'P30')!.color.hue).toBeLessThan(245);
    });

    it('keeps the hue smooth from one column to the next', () => {
        const row = board.swatches.filter((swatch) => swatch.rowIndex === 0);

        for (let index = 1; index < row.length; index += 1) {
            expect(
                perceptualDistance(row[index - 1].color, row[index].color),
            ).toBeLessThan(0.08);
        }
    });

    it('gives the same Board every time', () => {
        expect(generateBoard().swatches).toEqual(board.swatches);
    });
});
