<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import {
    COLUMN_COUNT,
    DEFAULT_BOARD_PARAMETERS,
    ROW_LETTERS,
    type Swatch,
    generateBoard,
} from '@/game/board';
import { perceptualDistance } from '@/game/color';

const board = generateBoard();

const showCoordinates = ref(false);
const inspected = ref<Swatch | null>(null);

const rowLetters = ROW_LETTERS.split('');

const columnTemplate = {
    gridTemplateColumns: `repeat(${COLUMN_COUNT}, 2.25rem)`,
};

const columnNumbers = Array.from(
    { length: COLUMN_COUNT },
    (_, index) => index + 1,
);

/**
 * How far apart the closest pair of touching Swatches looks. A guessing board
 * wants this high: two Swatches nobody can tell apart are two Swatches nobody
 * can aim at.
 */
const crowding = computed(() => {
    const distances: number[] = [];

    for (let row = 0; row < ROW_LETTERS.length; row += 1) {
        for (let column = 0; column < COLUMN_COUNT; column += 1) {
            const here = board.swatches[row * COLUMN_COUNT + column];

            if (column > 0) {
                distances.push(
                    perceptualDistance(
                        board.swatches[row * COLUMN_COUNT + column - 1].color,
                        here.color,
                    ),
                );
            }

            if (row > 0) {
                distances.push(
                    perceptualDistance(
                        board.swatches[(row - 1) * COLUMN_COUNT + column].color,
                        here.color,
                    ),
                );
            }
        }
    }

    distances.sort((first, second) => first - second);

    return {
        closest: distances[0],
        median: distances[Math.floor(distances.length / 2)],
        hardToTellApart: distances.filter((distance) => distance < 0.02).length,
        total: distances.length,
    };
});

function isLight(swatch: Swatch): boolean {
    return swatch.color.lightness > 0.6;
}
</script>

<template>
    <Head title="Board preview" />

    <div class="min-h-screen bg-neutral-900 p-8 text-neutral-200">
        <header class="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <h1 class="text-xl font-medium">Board preview</h1>
            <label class="flex items-center gap-2 text-sm">
                <input v-model="showCoordinates" type="checkbox" />
                Show coordinates
            </label>
            <p class="text-sm text-neutral-400">
                Closest touching pair
                {{ crowding.closest.toFixed(3) }} &middot; median
                {{ crowding.median.toFixed(3) }} &middot;
                {{ crowding.hardToTellApart }} of {{ crowding.total }} touching
                pairs are hard to tell apart
            </p>
        </header>

        <div class="inline-block">
            <div class="flex">
                <div class="w-6"></div>
                <div class="grid gap-px px-px" :style="columnTemplate">
                    <div
                        v-for="number in columnNumbers"
                        :key="number"
                        class="text-center text-[10px] text-neutral-500"
                    >
                        {{ number }}
                    </div>
                </div>
            </div>

            <div class="flex">
                <div class="grid w-6 gap-px py-px">
                    <div
                        v-for="letter in rowLetters"
                        :key="letter"
                        class="flex h-9 items-center justify-center text-[10px] text-neutral-500"
                    >
                        {{ letter }}
                    </div>
                </div>

                <div class="grid gap-px bg-black p-px" :style="columnTemplate">
                    <button
                        v-for="swatch in board.swatches"
                        :key="swatch.coordinate"
                        type="button"
                        class="h-9 w-9 cursor-pointer text-[8px] leading-9 outline-offset-[-3px] hover:outline hover:outline-2 hover:outline-white"
                        :class="
                            isLight(swatch) ? 'text-black/50' : 'text-white/50'
                        "
                        :style="{ backgroundColor: swatch.hex }"
                        :title="`${swatch.coordinate} ${swatch.hex}`"
                        @click="inspected = swatch"
                    >
                        {{ showCoordinates ? swatch.coordinate : '' }}
                    </button>
                </div>
            </div>
        </div>

        <dl
            v-if="inspected"
            class="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm"
        >
            <div class="flex items-center gap-3">
                <span
                    class="inline-block h-10 w-10 rounded"
                    :style="{ backgroundColor: inspected.hex }"
                ></span>
                <strong>{{ inspected.coordinate }}</strong>
            </div>
            <div>
                <dt class="text-neutral-500">Hex</dt>
                <dd>{{ inspected.hex }}</dd>
            </div>
            <div>
                <dt class="text-neutral-500">Lightness</dt>
                <dd>{{ inspected.color.lightness.toFixed(3) }}</dd>
            </div>
            <div>
                <dt class="text-neutral-500">Chroma</dt>
                <dd>{{ inspected.color.chroma.toFixed(3) }}</dd>
            </div>
            <div>
                <dt class="text-neutral-500">Hue</dt>
                <dd>{{ inspected.color.hue.toFixed(1) }}&deg;</dd>
            </div>
        </dl>

        <details class="mt-8 text-sm text-neutral-400">
            <summary class="cursor-pointer">Board parameters</summary>
            <pre class="mt-2 text-xs">{{
                JSON.stringify(DEFAULT_BOARD_PARAMETERS, null, 4)
            }}</pre>
        </details>
    </div>
</template>
