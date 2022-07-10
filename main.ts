import { parse } from "https://deno.land/std@0.147.0/flags/mod.ts";
import shuffle from "https://deno.land/x/shuffle@v1.0.1/mod.ts";

function createAndMixBoxes(count: number): number[] {
  return shuffle([...Array(count).keys()]);
}

type PrisonerStrategy = (
  prisonerId: number,
  boxes: number[],
  allowedSearches: number,
) => boolean;

function searchRandomlyStrategy(
  prisonerId: number,
  boxes: number[],
  allowedSearches: number,
): boolean {
  const searchedBoxes = new Set<number>();

  for (let i = 0; i < allowedSearches; i++) {
    const guess = getRandomBoxGuess(boxes.length, searchedBoxes);

    if (prisonerId === boxes[guess]) {
      return true;
    }

    searchedBoxes.add(guess);
  }

  return false;
}

function getRandomBoxGuess(count: number, searchedBoxes: Set<number>): number {
  let guess;

  do {
    guess = getRandomNumber(0, count - 1);
  } while (searchedBoxes.has(guess));

  return guess;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function searchLoopStrategy(
  prisonerId: number,
  boxes: number[],
  allowedSearches: number,
): boolean {
  let currentGuess = prisonerId;

  for (let i = 0; i < allowedSearches; i++) {
    if (prisonerId === boxes[currentGuess]) {
      return true;
    }

    currentGuess = boxes[currentGuess];
  }

  return false;
}

function simulate(count: number, strategy: PrisonerStrategy): boolean[] {
  const boxes = createAndMixBoxes(count);
  const prisonerResults = new Array(count).fill(false).map((_, prisonerId) => {
    return strategy(prisonerId, boxes, Math.floor(count / 2));
  });

  return prisonerResults;
}

function runExperiment(
  trials: number,
  count: number,
  strategy: PrisonerStrategy,
): number {
  const trialResults = new Array(trials).fill(false).map(() => {
    return simulate(count, strategy).every((prisonerResult) => prisonerResult);
  });

  const successCount = trialResults.filter((trialResult) => trialResult).length;

  return successCount / trials;
}

function main() {
  const { trials, "prisoner-count": prisonerCount, strategy: strategyString } =
    parse(Deno.args, {
      default: {
        trials: 100,
        "prisoner-count": 10,
        strategy: "random",
      },
    });

  let strategy: PrisonerStrategy;
  if (strategyString === "random") {
    strategy = searchRandomlyStrategy;
  } else if (strategyString === "loop") {
    strategy = searchLoopStrategy;
  } else {
    console.error(
      `Unknown strategy '${strategyString}': must be 'random' or 'loop'`,
    );
    Deno.exit(1);
  }

  console.log(runExperiment(trials, prisonerCount, strategy));
}

main();
