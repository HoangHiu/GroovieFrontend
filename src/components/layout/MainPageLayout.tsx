import { Outlet } from "react-router-dom";
import Player from "./Player";
import {useEffect, useState} from "react";
import Sidebar from "./Sidebar.tsx";

const MainPageLayout = () => {
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);

    useEffect(() => {
        console.log(currentPlaylist, currentSongIndex);
    }, [currentPlaylist, currentSongIndex]);

    return (
        <div className="h-full grid grid-rows-[1fr_auto] grid-cols-[auto_minmax(0,1fr)] gap-4">
            <Sidebar />

            <Outlet context={{ setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex }} />

            <Player
                album={currentPlaylist}
                songIndex={currentSongIndex}
                setSongIndex={setCurrentSongIndex}
            />
        </div>
    );
};

export default MainPageLayout;
