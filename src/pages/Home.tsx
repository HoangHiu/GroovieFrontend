import Sidebar from "../components/layout/Sidebar.tsx";
import MainContent from "../components/layout/MainContent.tsx";
import Player from "../components/layout/Player.tsx";

function Home(){
    return (
        <>
            <Sidebar></Sidebar>
            <MainContent></MainContent>
            <Player></Player>
        </>
    )
}

export default Home;