'use client'

import { useState } from "react";
import { TilesContainer } from "./components/tilesContainer";
import { TitleCard } from "./components/title";
import { ButtonContainer } from "./components/ButtonContainer";
import { initialWords } from "./utils/initialsWords";
import { deselectAll, shuffle, timeout, moveSelectionToTopRow, removeTopRow } from "./utils/helpers";
import { fetchCategory } from "./utils/data";
import { MistakesRemaining } from "./components/mistakesRemaining";

export default function Home() {
  const [words, setWords] = useState(initialWords)
  const [currentlySelected, setCurrentlySelected] = useState<string[]>([]);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const hasCurrentlySelected = currentlySelected.length > 0;
  const submitAvailable = currentlySelected.length === 4;

  const shuffleHandler = () => setWords(shuffle(words));

  const animateRemoval = async () => {
    setWords(moveSelectionToTopRow(words, currentlySelected))
    await timeout(1000);
    setWords(removeTopRow(words, currentlySelected))
  }

  const deselectAllHandler = () => {
    setWords(deselectAll(structuredClone(words)))
    setCurrentlySelected([]);
  }

  const submit = async () => {
    setIsLoading(true);

    const data = await fetchCategory(categories, currentlySelected)
    if (!data) return;

    const newCategories = structuredClone(categories);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newCategories as any)[data.category] = [...currentlySelected]

    setIsLoading(false);
    await animateRemoval();
    await timeout(200);
    setCategories(newCategories)
    setCurrentlySelected([]);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans max-h-screen">
      <main className="flex flex-1 w-full flex-col py-30 px-8 max-w-6xl">
        <TitleCard />
        <div className="flex flex-col h-full text-center mt-24 justify-center items-center w-full">
          <div className="mb-8">Create four groups of four!</div>
          <TilesContainer
            isLoading={isLoading}
            categories={categories}
            words={words}
            setWords={setWords}
            currentlySelected={currentlySelected}
            setCurrentlySelected={setCurrentlySelected} />
          <MistakesRemaining />
          <ButtonContainer isLoading={isLoading} deselectAll={deselectAllHandler} shuffle={shuffleHandler} submit={submit} hasCurrentlySelected={hasCurrentlySelected} submitAvailable={submitAvailable} />
        </div>
      </main>
    </div>
  );
}
