interface ButtonContainerProps {
    shuffle: () => void
    deselectAll: () => void
    submit: () => Promise<void>
    hasCurrentlySelected: boolean
    submitAvailable: boolean
    isLoading: boolean
}

export function ButtonContainer({ isLoading, shuffle, deselectAll, submit, hasCurrentlySelected, submitAvailable }: ButtonContainerProps) {
    const disabledStyle = "border-[#979797] text-[#8B8B8B]"

    return (
        <div className="flex gap-3">
            <button onClick={shuffle} className="border font-semibold rounded-full py-3 px-4">Shuffle</button>
            <button disabled={!hasCurrentlySelected || isLoading} onClick={deselectAll} className={`${hasCurrentlySelected ? "" : disabledStyle} border font-semibold rounded-full py-3 px-4 transition-all duration-500`}>Deselect All</button>
            <button disabled={!submitAvailable || isLoading} onClick={submit} className={`${submitAvailable ? "" : disabledStyle} ${isLoading ? 'animate-pulse' : ''} border font-semibold rounded-full py-3 px-4 transition-all duration-500`}>Submit</button>
        </div>
    )
}