import Song from "../models/Song.ts";
import {useOutletContext, useParams} from "react-router-dom";
import PlaylistContent from "../components/layout/PlaylistContent.tsx";

type ContextType = {
    setCurrentPlaylist: (playlist: Song[]) => void;
    setCurrentSongIndex: (index: number) => void;
    currentPlaylist: Song[];
    currentSongIndex: number;
};

function PlaylistContentPage() {
    const { setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex } =
        useOutletContext<ContextType>();

    const { id } = useParams();

    return (
        <PlaylistContent
            playlistId={id!}
            onSelectSong={(index, playlist) => {
                setCurrentSongIndex(index);
                setCurrentPlaylist(playlist);
            }}
            currentSongIndex={currentSongIndex}
        />
    );
}

export default PlaylistContentPage;