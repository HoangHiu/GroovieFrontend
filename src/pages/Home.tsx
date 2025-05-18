import CardListHori from "../components/layout/CardListHori.tsx";

function Home() {
    return (
        <div style={{paddingTop: "30px"}}
             className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <CardListHori header={"Recommended for you"} cardContentType={"album-false"} apiUrl={"http://localhost:8080/v1/album/search?page_number=1&page_size=5"}></CardListHori>
            <CardListHori header={"Popular today"} cardContentType={"album-false"} apiUrl={"http://localhost:8080/v1/album/search?page_number=2&page_size=5"}></CardListHori>
        </div>
    );
}

export default Home;
