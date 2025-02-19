import Sidebar from "../components/layout/Sidebar.tsx";
import MainContent from "../components/layout/MainContent.tsx";
import Player from "../components/layout/Player.tsx";

function Home(){
    return (
        <div className="h-full grid grid-rows-[1fr_auto] grid-cols-[auto_1fr] gap-4">
            <Sidebar/>
            <MainContent/>
            <Player/>
        </div>
    )
}

export default Home;