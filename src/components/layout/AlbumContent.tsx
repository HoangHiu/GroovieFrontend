import Song from "../../models/Song.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import FormPopUp from "../ui/FormPopUp.tsx";

// import AddSongToPlaylistForm from "../layout/AddSongToPlaylistForm.tsx";

interface Playlist {
    playlistId: string;
    name: string;
}

function AlbumContent({
                          albumId,
                          onSelectSong,
                          currentSongIndex
                      }: {
    albumId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number;
}) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [album, setAlbum] = useState<{ name: string; artistId: string; artistName: string; coverUrl: string } | null>(null);
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        async function fetchAlbumData() {
            try {
                const albumResponse = await axios.get(`http://localhost:8080/v1/album/${albumId}`);
                const albumData = albumResponse.data.data;

                const newAlbum = {
                    name: albumData.title,
                    artistId: albumData.userDtoOut.uuid,
                    artistName: albumData.userDtoOut.personalDetailDtoOut.name,
                    coverUrl: albumData.coverUrl ?? "",
                };
                setAlbum(newAlbum);

                const songsResponse = await axios.get(`http://localhost:8080/v1/album/${albumId}/getSongs`);
                const songsData = songsResponse.data.data;

                setSongs(songsData.map((item: any) => new Song(item.uuid, item.title, newAlbum.artistId, newAlbum.artistName)));
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        }

        fetchAlbumData();
    }, [albumId]);

    const handleAddToPlaylistClick = (songId: string) => {
        setSelectedSongId(songId);
        setIsFormOpen(true);
    };

    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            <section style={{ padding: "20px" }} className="w-full h-[220px] bg-[var(--color-bas-seconday-1)] flex items-center gap-6">
                <img className="h-full aspect-square" src={album?.coverUrl || "/default-cover.jpg"} alt="Album Cover" />
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">Album</p>
                    <h1 className="text-6xl font-bold">{album?.name}</h1>
                    <div className="flex gap-3 items-center">
                        <p className="font-semibold text-sm">{album?.artistName}</p>
                        <i>|</i>
                        <p className="font-semibold text-sm">Song count: {songs.length}</p>
                    </div>
                </div>
            </section>

            <section style={{ marginTop: "20px" }}>
                <table className="table-auto w-full text-left">
                    <thead className="border-b-1">
                    <tr>
                        <th className="px-6 w-[20px] text-center">#</th>
                        <th>Song</th>
                        <th>Artist</th>
                        <th>Playtime</th>
                        <th className="w-[50px] text-center">+</th>
                    </tr>
                    </thead>

                    <tbody>
                    {songs.map((song, index) => (
                        <tr
                            key={song.songId}
                            className={`group hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer ${
                                currentSongIndex === index ? "bg-[var(--color-primary)] text-white" : ""
                            }`}
                            onClick={() => onSelectSong(index, songs)}
                        >
                            <td className="text-center">{index + 1}</td>
                            <td>{song.songName}</td>
                            <td>{song.artistName}</td>
                            <td>3:45</td>
                            <td className="text-center">
                                <button
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToPlaylistClick(song.songId);
                                    }}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {/* Form Popup for Adding Songs */}
            <FormPopUp
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                formType="addToPlaylist"
                onSuccess={() => setIsFormOpen(false)}
                songId={selectedSongId}
            />
        </div>
    );
}

export default AlbumContent;
