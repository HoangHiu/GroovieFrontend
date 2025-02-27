import {useOutletContext, useParams} from "react-router-dom";
import AlbumContent from "../components/layout/AlbumContent.tsx";
import Song from "../models/Song.ts";
import {useEffect} from "react";

type ContextType = {
    setCurrentPlaylist: (playlist: Song[]) => void;
    setCurrentSongIndex: (index: number) => void;
    currentPlaylist: Song[];
    currentSongIndex: number;
};

function AlbumPage() {
    const { setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex } =
        useOutletContext<ContextType>();

    const { id } = useParams();

    return (
        <div className="h-full grid grid-rows-[1fr_auto] grid-cols-[auto_minmax(0,1fr)] gap-4">
            <AlbumContent
                albumId={id!}
                onSelectSong={(index, playlist) => {
                    setCurrentSongIndex(index);
                    setCurrentPlaylist(playlist);
                }}
                currentSongIndex={currentSongIndex}
            />
        </div>
    );
}

export default AlbumPage;
