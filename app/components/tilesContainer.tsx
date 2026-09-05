'use client'

import { Dispatch, SetStateAction } from "react"
import { Tiles } from "./tiles"
import { motion } from "motion/react"
import { WideTile } from "./WideTile"
import { colours } from "../utils/colours"
import { spring } from "../utils/animations"

interface TilesContainerProps {
    setWords: Dispatch<SetStateAction<Record<string, boolean>>>
    words: Record<string, boolean>
    currentlySelected: string[]
    setCurrentlySelected: Dispatch<SetStateAction<string[]>>
    categories: Record<string, string[]>
    isLoading: boolean
}

export function TilesContainer({ isLoading, words, setWords, currentlySelected, setCurrentlySelected, categories }: TilesContainerProps) {
    const toggleWord = (word: string) => {
        const currentState = words[word];

        if (currentState) {
            setCurrentlySelected(currentlySelected.filter((current) => current !== word))
            setWords({ ...words, [word]: !words[word] })
            return
        }

        if (!currentState && currentlySelected.length > 3) return
        setCurrentlySelected([...currentlySelected, word])
        setWords({ ...words, [word]: !words[word] })
    }

    return (
        <div className="grid grid-cols-4 grid-rows-4 font-bold gap-2.5 max-w-164 w-164">
            {Object.entries(categories).map(([category, items], index) => {
                return (
                    <motion.div style={{ background: colours[index].value }} key={category} layout transition={spring} className={`flex flex-col col-span-4 h-20 w-163 rounded-md justify-center items-center transition-all duration-500`}>
                        <WideTile key={category} category={category} words={items} />
                    </motion.div>
                )
            })}
            {Object.entries(words).map(([word, selected]) => (
                <motion.div key={word} layout transition={spring}>
                    <Tiles
                        word={word}
                        selected={selected}
                        onToggle={() => toggleWord(word)}
                        isLoading={isLoading}
                    />
                </motion.div>

            ))}

        </div>
    )
}