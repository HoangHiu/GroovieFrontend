import SongCardHoriz from "../ui/SongCardHoriz.tsx";

function AlbumContent(){
    return(
        <div className={"bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <section style={{padding: "20px"}}
                className={"w-full h-[220px] bg-[var(--color-bas-seconday-1)] " +
                    "flex items-center gap-6"}>
                <img className={"h-full aspect-square"}
                     src="" alt=""/>
                <div className={"flex flex-col gap-2"}>
                    <p className={"text-xs font-semibold text-[var(--color-sc-seconday-2)]"}>Album type</p>
                    <h1 className={"text-6xl font-bold"}>Album title</h1>
                    <div className={"flex gap-3 items-center"}>
                        <p className={"font-semibold text-sm"}>Artist name</p>
                        <i>|</i>
                        <p className={"font-semibold text-sm"}>Song count</p>
                        <i>|</i>
                        <p className={"font-semibold text-sm"}>Total playtime</p>
                    </div>
                </div>
            </section>
            <section>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
                <SongCardHoriz title={"song"} authorName={"author"}/>
            </section>
        </div>
    )
}

export default AlbumContent;