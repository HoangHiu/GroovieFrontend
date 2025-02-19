import CardListHori from "./CardListHori.tsx";

function MainContent() {
    return(
        <div style={{paddingTop: "30px"}}
            className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <CardListHori header={"Recommended for you"} cardContentType={"album"} contentUrl={""}></CardListHori>
            <CardListHori header={"Popular today"} cardContentType={"album"} contentUrl={""}></CardListHori>
            <CardListHori header={"Growing in popularity"} cardContentType={"artist"} contentUrl={""}></CardListHori>
        </div>
    );
}

export default MainContent;