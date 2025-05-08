import Song from "../models/Song.ts";
import {useOutletContext, useParams} from "react-router-dom";
import {useEffect} from "react";
import ArtistPageContent from "../components/layout/content/ArtistPageContent.tsx";

type ContextType = {
    setCurrentPlaylist: (playlist: Song[]) => void;
    setCurrentSongIndex: (index: number) => void;
    currentPlaylist: Song[];
    currentSongIndex: number;
};

function ArtistPage(){
    const { setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex } =
        useOutletContext<ContextType>();

    const { id } = useParams();

    useEffect(() => {
    }, [currentPlaylist, currentSongIndex]);

    return(
        <ArtistPageContent
            artistId={id!}
            onSelectSong={(index, playlist) => {
                setCurrentSongIndex(index);
                setCurrentPlaylist(playlist);
            }}
            currentSongIndex={currentSongIndex}
        />
    )
}

export default ArtistPage