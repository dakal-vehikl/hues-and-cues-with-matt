/**
 * The Board: 480 Swatches in 16 rows (A-P) and 30 columns (1-30), with A1 at
 * the top left.
 *
 * The Board is a colour wheel stretched to fill the rectangle. Hue is the angle
 * around a near-grey centre, chroma grows towards the border, and lightness
 * falls towards the border with a lift towards yellow so that the yellow-green
 * side stays bright and the orange side turns brown.
 */

import {
    type Oklch,
    fitToSrgbGamut,
    largestDisplayableChroma,
    mostColourfulLightness,
    toHex,
} from './color';

export const ROW_LETTERS = 'ABCDEFGHIJKLMNOP';
export const ROW_COUNT = ROW_LETTERS.length;
export const COLUMN_COUNT = 30;
export const SWATCH_COUNT = ROW_COUNT * COLUMN_COUNT;

/** A Swatch address, written letter then number: `A1` to `P30`. */
export type Coordinate = string;

export interface Swatch {
    readonly coordinate: Coordinate;
    /** 0 for row A, 15 for row P. */
    readonly rowIndex: number;
    /** 0 for column 1, 29 for column 30. */
    readonly columnIndex: number;
    readonly color: Oklch;
    readonly hex: string;
}

export interface Board {
    /** All 480 Swatches, row by row, starting at A1. */
    readonly swatches: readonly Swatch[];
    readonly byCoordinate: ReadonlyMap<Coordinate, Swatch>;
}

/**
 * The knobs that shape the Board. These are tuned by eye against a rendering of
 * all 480 Swatches, not fitted to the retail board.
 */
export interface BoardParameters {
    /** Row index the wheel turns around. Row I is 8. */
    readonly centreRow: number;
    /** Column index the wheel turns around. Column 16 is 15. */
    readonly centreColumn: number;
    /** The hue at the A1 corner. The wheel turns clockwise from there. */
    readonly hueOffset: number;
    readonly centreLightness: number;
    /**
     * How much darker than its most colourful lightness the border is. 1 keeps
     * every border hue at its most colourful.
     */
    readonly borderDarkening: number;
    /** How much of the chroma the screen can show the border uses, 0 to 1. */
    readonly borderChromaFraction: number;
    /** Below 1 pushes chroma up early, so the middle is not washed out. */
    readonly chromaCurve: number;
}

export const DEFAULT_BOARD_PARAMETERS: BoardParameters = {
    centreRow: 8,
    centreColumn: 15,
    hueOffset: 38,
    centreLightness: 0.9,
    borderDarkening: 0.8,
    borderChromaFraction: 0.9,
    chromaCurve: 0.8,
};

export function coordinateOf(
    rowIndex: number,
    columnIndex: number,
): Coordinate {
    return `${ROW_LETTERS[rowIndex]}${columnIndex + 1}`;
}

export function parseCoordinate(coordinate: Coordinate): {
    rowIndex: number;
    columnIndex: number;
} | null {
    const match = /^([A-P])([1-9]|[12][0-9]|30)$/.exec(coordinate);

    if (!match) {
        return null;
    }

    return {
        rowIndex: ROW_LETTERS.indexOf(match[1]),
        columnIndex: Number(match[2]) - 1,
    };
}

/**
 * Where a Swatch sits on the wheel: how far it is from the centre, from 0 at
 * the centre to 1 anywhere on the border, and how far around the border it
 * points, from 0 at the top left corner running clockwise back to 1.
 */
function wheelPositionOf(
    rowIndex: number,
    columnIndex: number,
    parameters: BoardParameters,
): { distanceFromCentre: number; wayAroundBorder: number } {
    const acrossLimit =
        columnIndex < parameters.centreColumn
            ? parameters.centreColumn
            : COLUMN_COUNT - 1 - parameters.centreColumn;
    const downLimit =
        rowIndex < parameters.centreRow
            ? parameters.centreRow
            : ROW_COUNT - 1 - parameters.centreRow;

    const across = (columnIndex - parameters.centreColumn) / acrossLimit;
    const down = (rowIndex - parameters.centreRow) / downLimit;

    const distanceFromCentre = Math.max(Math.abs(across), Math.abs(down));

    if (distanceFromCentre === 0) {
        return { distanceFromCentre: 0, wayAroundBorder: 0 };
    }

    // Push the Swatch out to the border along its own direction, then read off
    // how far around the border it lands. This spaces the hues evenly around
    // the rectangle, which the raw angle does not.
    const onBorderAcross = across / distanceFromCentre;
    const onBorderDown = down / distanceFromCentre;

    let wayAroundBorder: number;

    if (onBorderDown <= -1) {
        wayAroundBorder = (onBorderAcross + 1) / 8;
    } else if (onBorderAcross >= 1) {
        wayAroundBorder = 0.25 + (onBorderDown + 1) / 8;
    } else if (onBorderDown >= 1) {
        wayAroundBorder = 0.5 + (1 - onBorderAcross) / 8;
    } else {
        wayAroundBorder = 0.75 + (1 - onBorderDown) / 8;
    }

    return { distanceFromCentre, wayAroundBorder };
}

function colorAt(
    rowIndex: number,
    columnIndex: number,
    parameters: BoardParameters,
): Oklch {
    const { distanceFromCentre, wayAroundBorder } = wheelPositionOf(
        rowIndex,
        columnIndex,
        parameters,
    );

    const hue =
        (((parameters.hueOffset - 360 * wayAroundBorder) % 360) + 360) % 360;

    const borderLightness =
        mostColourfulLightness(hue) * parameters.borderDarkening;

    const lightness =
        parameters.centreLightness +
        (borderLightness - parameters.centreLightness) * distanceFromCentre;

    return {
        lightness,
        chroma:
            largestDisplayableChroma(lightness, hue) *
            parameters.borderChromaFraction *
            Math.pow(distanceFromCentre, parameters.chromaCurve),
        hue,
    };
}

export function generateBoard(
    parameters: BoardParameters = DEFAULT_BOARD_PARAMETERS,
): Board {
    const swatches: Swatch[] = [];

    for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
        for (
            let columnIndex = 0;
            columnIndex < COLUMN_COUNT;
            columnIndex += 1
        ) {
            const color = fitToSrgbGamut(
                colorAt(rowIndex, columnIndex, parameters),
            );

            swatches.push({
                coordinate: coordinateOf(rowIndex, columnIndex),
                rowIndex,
                columnIndex,
                color,
                hex: toHex(color),
            });
        }
    }

    return {
        swatches,
        byCoordinate: new Map(
            swatches.map((swatch) => [swatch.coordinate, swatch]),
        ),
    };
}

export function swatchAt(board: Board, coordinate: Coordinate): Swatch | null {
    return board.byCoordinate.get(coordinate) ?? null;
}
