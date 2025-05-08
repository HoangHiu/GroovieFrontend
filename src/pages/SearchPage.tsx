import Song from "../models/Song.ts";
import {useOutletContext, useParams} from "react-router-dom";
import SearchPageContent from "../components/layout/content/SearchPageContent.tsx";
import {useEffect} from "react";

type ContextType = {
    setCurrentPlaylist: (playlist: Song[]) => void;
    setCurrentSongIndex: (index: number) => void;
    currentPlaylist: Song[];
    currentSongIndex: number;
};

function SearchPage(){
    const { setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex } =
        useOutletContext<ContextType>();

    const { id } = useParams();

    useEffect(() => {
    }, [currentPlaylist, currentSongIndex]);

    return(
        <SearchPageContent
            playlistId={id!}
            onSelectSong={(index, playlist) => {
                setCurrentSongIndex(index);
                setCurrentPlaylist(playlist);
            }}
            currentSongIndex={currentSongIndex}
        />
    )
}

export default SearchPage;