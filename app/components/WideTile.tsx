interface WideTileProps {
    category: string
    words: string[]
}

export function WideTile({ category, words }: WideTileProps) {
    return (
        <>
            <div className="text-xl">
                {category}
            </div>
            <div className="text-lg font-medium">
                {words.join(', ')}
            </div>
        </>
    )
}