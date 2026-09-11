/**
 * Oklch colour maths.
 *
 * Oklch is a perceptual colour space: equal steps in its numbers look like
 * equal steps to a human eye, which HSL does not manage. The Board is
 * generated in Oklch for exactly that reason.
 */

export interface Oklch {
    /** Perceptual lightness, 0 (black) to 1 (white). */
    readonly lightness: number;
    /** Distance from grey. 0 is neutral. Above ~0.37 always leaves sRGB. */
    readonly chroma: number;
    /** Hue angle in degrees, 0 to 360. */
    readonly hue: number;
}

export interface Oklab {
    readonly lightness: number;
    readonly a: number;
    readonly b: number;
}

/** Linear-light sRGB. Each channel is 0 to 1 when the colour is displayable. */
export interface LinearRgb {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
}

const GAMUT_TOLERANCE = 1e-5;
const GAMUT_SEARCH_STEPS = 24;
const CUSP_SEARCH_STEPS = 24;

export function oklchToOklab(color: Oklch): Oklab {
    const radians = (color.hue * Math.PI) / 180;

    return {
        lightness: color.lightness,
        a: color.chroma * Math.cos(radians),
        b: color.chroma * Math.sin(radians),
    };
}

export function oklabToLinearRgb(color: Oklab): LinearRgb {
    const { lightness, a, b } = color;

    const longRoot = lightness + 0.3963377774 * a + 0.2158037573 * b;
    const mediumRoot = lightness - 0.1055613458 * a - 0.0638541728 * b;
    const shortRoot = lightness - 0.0894841775 * a - 1.291485548 * b;

    const long = longRoot * longRoot * longRoot;
    const medium = mediumRoot * mediumRoot * mediumRoot;
    const short = shortRoot * shortRoot * shortRoot;

    return {
        red: 4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
        green:
            -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
        blue:
            -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
    };
}

export function isDisplayable(color: Oklch): boolean {
    const linear = oklabToLinearRgb(oklchToOklab(color));

    return [linear.red, linear.green, linear.blue].every(
        (channel) =>
            channel >= -GAMUT_TOLERANCE && channel <= 1 + GAMUT_TOLERANCE,
    );
}

/**
 * Reduce chroma until the colour fits inside sRGB, keeping lightness and hue.
 * A colour that already fits is returned unchanged.
 */
export function fitToSrgbGamut(color: Oklch): Oklch {
    if (isDisplayable(color)) {
        return color;
    }

    let displayableChroma = 0;
    let excessiveChroma = color.chroma;

    for (let step = 0; step < GAMUT_SEARCH_STEPS; step += 1) {
        const candidate = (displayableChroma + excessiveChroma) / 2;

        if (isDisplayable({ ...color, chroma: candidate })) {
            displayableChroma = candidate;
        } else {
            excessiveChroma = candidate;
        }
    }

    return { ...color, chroma: displayableChroma };
}

/**
 * The most chroma sRGB can show at this lightness and hue. Cyan at a middle
 * lightness offers much less than orange does, so a Board that asks for the
 * same chroma everywhere crowds its colours onto the edge of the gamut.
 */
export function largestDisplayableChroma(
    lightness: number,
    hue: number,
): number {
    let displayable = 0;
    let excessive = 0.5;

    for (let step = 0; step < GAMUT_SEARCH_STEPS; step += 1) {
        const candidate = (displayable + excessive) / 2;

        if (isDisplayable({ lightness, chroma: candidate, hue })) {
            displayable = candidate;
        } else {
            excessive = candidate;
        }
    }

    return displayable;
}

/**
 * The lightness at which this hue can be most colourful on a screen. Yellow
 * peaks light, blue peaks dark. A wheel that ignores this renders half its
 * hues as near-grey.
 */
export function mostColourfulLightness(hue: number): number {
    let low = 0;
    let high = 1;

    for (let step = 0; step < CUSP_SEARCH_STEPS; step += 1) {
        const oneThird = low + (high - low) / 3;
        const twoThirds = high - (high - low) / 3;

        if (
            largestDisplayableChroma(oneThird, hue) <
            largestDisplayableChroma(twoThirds, hue)
        ) {
            low = oneThird;
        } else {
            high = twoThirds;
        }
    }

    return (low + high) / 2;
}

function encodeGamma(channel: number): number {
    const clamped = Math.min(1, Math.max(0, channel));

    return clamped <= 0.0031308
        ? clamped * 12.92
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function toHexPair(channel: number): string {
    return Math.round(encodeGamma(channel) * 255)
        .toString(16)
        .padStart(2, '0');
}

/** Render a colour as `#rrggbb`, pulling it into sRGB first if it is outside. */
export function toHex(color: Oklch): string {
    const linear = oklabToLinearRgb(oklchToOklab(fitToSrgbGamut(color)));

    return `#${toHexPair(linear.red)}${toHexPair(linear.green)}${toHexPair(linear.blue)}`;
}

/**
 * How far apart two colours look, as a plain Euclidean distance in Oklab.
 * Roughly: below 0.02 is hard to tell apart, above 0.1 is obviously different.
 */
export function perceptualDistance(first: Oklch, second: Oklch): number {
    const left = oklchToOklab(first);
    const right = oklchToOklab(second);

    return Math.hypot(
        left.lightness - right.lightness,
        left.a - right.a,
        left.b - right.b,
    );
}
