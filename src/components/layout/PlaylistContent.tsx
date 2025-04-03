import Song from "../../models/Song.ts";
import { useEffect, useState } from "react";
import axios from "axios";

function PlaylistContent(
    {
        playlistId,
        onSelectSong,
        currentSongIndex
    }: {
        playlistId: string;
        onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
        currentSongIndex: number;
    }
) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [playlist, setPlaylist] = useState<{ name: string } | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered row index

    useEffect(() => {
        async function fetchPlaylistData() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/v1/playlist/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = response.data.data;
                setPlaylist({ name: data.name });

                setSongs(data.songs.map((song: any) =>
                    new Song(song.uuid, song.title, song.albumDtoOut.userDtoOut.uuid, song.albumDtoOut.userDtoOut.personalDetailDtoOut.name)
                ));
            } catch (error) {
                console.error("Error fetching playlist data:", error);
            }
        }

        fetchPlaylistData();
    }, [playlistId]);

    // Function to handle song deletion
    const handleDeleteSong = async (songId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await axios.delete("http://localhost:8080/v1/playlist/songs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: { // Request body
                    playlistId: playlistId,
                    songId: songId,
                },
            });

            setSongs(songs.filter(song => song.songId !== songId));
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    };

    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            <section style={{ padding: "20px" }} className="w-full h-[220px] bg-[var(--color-bas-seconday-1)] flex items-center gap-6">
                <img className="h-full aspect-square" src="/default-cover.jpg" alt="Playlist Cover" />
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">Playlist</p>
                    <h1 className="text-6xl font-bold">{playlist?.name}</h1>
                    <div className="flex gap-3 items-center">
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
                        <th className="w-[40px]"></th> {/* Column for delete button */}
                    </tr>
                    </thead>
                    <tbody>
                    {songs.map((song, index) => (
                        <tr
                            key={song.songId}
                            className={`hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer relative ${
                                currentSongIndex === index ? "bg-[var(--color-primary)] text-white" : ""
                            }`}
                            onClick={() => onSelectSong(index, songs)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <td className="text-center">{index + 1}</td>
                            <td>{song.songName}</td>
                            <td>{song.artistName}</td>
                            <td>6:00</td>
                            <td className="text-right">
                                {hoveredIndex === index && (
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSong(song.songId);
                                        }}
                                    >
                                        X
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PlaylistContent;
