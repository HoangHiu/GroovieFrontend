import CardListHori from "./CardListHori.tsx";

function MainContent() {


    return(
        <div style={{paddingTop: "30px"}}
            className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <CardListHori header={"Recommended for you"} cardContentType={"album"} apiUrl={""}></CardListHori>
            <CardListHori header={"Popular today"} cardContentType={"album"} apiUrl={""}></CardListHori>
            <CardListHori header={"Growing in popularity"} cardContentType={"artist"} apiUrl={""}></CardListHori>
        </div>
    );
}

export default MainContent;