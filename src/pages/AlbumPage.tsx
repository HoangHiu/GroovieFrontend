import {useOutletContext, useParams} from "react-router-dom";
import AlbumContent from "../components/layout/AlbumContent.tsx";
import Song from "../models/Song.ts";

type ContextType = {
    setCurrentPlaylist: (playlist: Song[]) => void;
    setCurrentSongIndex: (index: number) => void;
    currentPlaylist: Song[];
    currentSongIndex: number;
};

function AlbumPage() {
    const { setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex } =
        useOutletContext<ContextType>();

    const { id, contentChangeable } = useParams<{ id: string; contentChangeable?: string }>();

    const isContentChangeable = contentChangeable === "true";


    return (
            <AlbumContent
                albumId={id!}
                onSelectSong={(index, playlist) => {
                    setCurrentSongIndex(index);
                    setCurrentPlaylist(playlist);
                }}
                currentSongIndex={currentSongIndex}
                contentChangeable= {isContentChangeable}
            />
    );
}

export default AlbumPage;
