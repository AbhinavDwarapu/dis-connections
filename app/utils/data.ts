interface CategoryResponse {
    category: string
    items: string[]
    mechanism: string
    confidence: string
}

export const fetchCategory = async (categories: Record<string, string[]>, currentlySelected: string[]): Promise<CategoryResponse | null> => {
    const response = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify({
            words: currentlySelected.join(" "),
            categories: Object.keys(categories).join(','),
        })
    });

    if (!response.ok) {
        return null
    }

    const data: CategoryResponse = JSON.parse(await response.json())

    return data
}