import CardListHori from "../components/layout/CardListHori.tsx";

function Home() {
    return (
        <div style={{paddingTop: "30px overflow-auto"}}
             className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <CardListHori header={"Recommended for you"} cardContentType={"album"} apiUrl={""}></CardListHori>
            <CardListHori header={"Popular today"} cardContentType={"album"} apiUrl={""}></CardListHori>
            <CardListHori header={"Growing in popularity"} cardContentType={"artist"} apiUrl={""}></CardListHori>
        </div>
    );
}

export default Home;
