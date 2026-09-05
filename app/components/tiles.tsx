'use client'

interface TilesProps {
    word: string
    selected: boolean
    onToggle: () => void
    isLoading: boolean
}

export function Tiles({ word, selected, onToggle, isLoading }: TilesProps) {
    const tileColour = selected ? "bg-[#5A594E] text-white" : "bg-[#EFEFE6] text-black"

    return (
        <button
            onClick={onToggle}
            disabled={isLoading}
            className={`${tileColour} ${isLoading ? 'opacity-90 animate-pulse' : ''} flex text-lg h-20 w-38 rounded-md justify-center items-center transition-all duration-500`}>{word}
        </button>
    )
}
