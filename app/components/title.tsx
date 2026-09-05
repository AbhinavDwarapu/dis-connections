export function TitleCard() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const formattedDate = `${month} ${day}, ${year}`;
    return (
        <div className="flex flex-row items-baseline gap-4">
            <div className="text-3xl font-alfa-slab-one">Connections</div>
            <div className="text-[28px] font-news-cycle">{formattedDate}</div>
        </div>
    )
}