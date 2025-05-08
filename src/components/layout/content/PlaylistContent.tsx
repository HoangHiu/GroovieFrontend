import Song from "../../../models/Song.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import FormPopUp from "../../ui/FormPopUp.tsx";
import imgPlaceholder from "../../../assets/images/placeholder/image-placeholder.svg";

function PlaylistContent({
                             playlistId,
                             onSelectSong,
                             currentSongIndex,
                         }: {
    playlistId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number;
}) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [playlist, setPlaylist] = useState<{ name: string; coverUrls: string[] } | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState<'updatePlaylist' | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSong = songs.filter(song =>
        song.songName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        async function fetchPlaylistData() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await axios.get(
                    `http://localhost:8080/v1/playlist/${playlistId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = response.data.data;
                console.log(data.coverUrls)
                setPlaylist({ name: data.name, coverUrls: data.coverUrls });
            } catch (error) {
                console.error("Error fetching playlist data:", error);
            }

            try {
                const response = await axios.get(
                    `http://localhost:8080/v1/playlist/songs?playlistId=${playlistId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = response.data.data;
                setSongs(
                    data.map((song: any) =>
                        new Song(
                            song.uuid,
                            song.title,
                            song.albumDtoOut.userDtoOut.uuid,
                            song.albumDtoOut.userDtoOut.personalDetailDtoOut.name,
                            song.duration,
                            song.url
                        )
                    )
                );
            } catch (error) {
                console.error("Error fetching playlist data:", error);
            }
        }
        fetchPlaylistData();
    }, [playlistId]);

    const handleDeleteSong = async (songId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await axios.delete("http://localhost:8080/v1/playlist/songs", {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                data: { playlistId, songId },
            });
            setSongs(prev => prev.filter(s => s.songId !== songId));
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    };

    const handleFindSimilarSongs = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const songIds = songs.map(s => s.songId);
            const recommendResponse = await axios.post(
                "http://localhost:18080/recommend-songs/",
                { songIds },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            const recommendedSongIds = recommendResponse.data.recommended_songs;
            const detailsRes = await axios.post(
                "http://localhost:8080/v1/song/bulk-get-songs",
                recommendedSongIds,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setRecommendedSongs(
                detailsRes.data.data.map((song: any) =>
                    new Song(
                        song.uuid,
                        song.title,
                        song.albumDtoOut.userDtoOut.uuid,
                        song.albumDtoOut.userDtoOut.personalDetailDtoOut.name,
                        song.duration,
                        song.coverUrl
                    )
                )
            );
        } catch (error) {
            console.error("Error finding similar songs:", error);
        }
    };

    useEffect(() => {
        if (playlist?.coverUrls) {
            setCovers(playlist.coverUrls);
        }
    }, [playlist]);

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        window.location.reload();
    };

    const handleUpdatePlaylistClick = () => {
        setFormType('updatePlaylist');
        setIsFormOpen(true);
    };

    const [covers, setCovers] = useState<string[]>(playlist?.coverUrls || []);

    const handleCoverError = (idx: number) => {
        setCovers(prev => prev.map((u,i) => i===idx ? imgPlaceholder : u));
    };


    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            <section className="flex items-center gap-6"
                     style={{padding: '20px', background: 'var(--color-bas-seconday-1)', height: 220}}>
                {covers.length < 4 ? (
                    <img
                        src={covers[0] || imgPlaceholder}
                        alt={playlist?.name}
                        onError={() => handleCoverError(0)}
                        className="w-40 h-40 object-cover rounded-sm bg-gray-400"
                    />
                ) : (
                    <div
                        className="grid grid-cols-2 grid-rows-2 gap-1 w-40 h-40 rounded-sm overflow-hidden bg-gray-400">
                        {covers.slice(0, 4).map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`${playlist?.name} cover ${idx + 1}`}
                                onError={() => handleCoverError(idx)}
                                className="w-full h-full object-cover"
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">Playlist</p>
                    <h1 className="text-6xl font-bold">{playlist?.name}</h1>
                    <div className="flex gap-3 items-center">
                        <p className="font-semibold text-sm">Song count: {songs.length}</p>
                    </div>
                </div>
            </section>

            <section style={{padding: "20px 20px 0 20px"}} className="flex justify-end gap-4">
                <input
                    style={{padding: '6px'}}
                    className="border-[var(--color-bas-seconday-2)] border-1 rounded-md"
                    type="text"
                    placeholder="Find your song"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    style={{padding: "10px 20px"}}
                    className="bg-[var(--color-sc-primary-1)] text-white rounded transition hover:bg-[var(--color-bas-primary-3)]"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdatePlaylistClick();
                    }}
                >
                    Edit Info
                </button>
            </section>

            <section style={{padding: "10px 40px"}} className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400 border-separate border-spacing-y-2">
                    <thead className="text-xs uppercase text-gray-400 border-b">
                    <tr>
                        <th style={{padding: "10px 20px"}} className="text-center w-[20px]">#</th>
                        <th className="px-6 py-3">Song</th>
                        <th className="px-6 py-3">Artist</th>
                        <th className="px-6 py-3">Playtime</th>
                        <th className="px-6 py-3 text-center w-[40px]">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSong.map((song, index) => (
                        <tr
                            key={song.songId}
                            className={`border-b border-gray-700 hover:bg-[var(--color-ic-seconday-3)] cursor-pointer relative ${
                                currentSongIndex === index ? "bg-[var(--color-primary)] text-white" : ""
                            }`}
                            onClick={() => onSelectSong(index, songs)}
                        >
                            <td className="p-4 text-center font-semibold">{index + 1}</td>
                            <td style={{padding: "5px 0"}}
                                className="flex items-center gap-4">
                                <img className={"w-[40px] rounded-lg"} src={song.albumCover} alt=""/>
                                <p className={"font-semibold"}>{song.songName}</p></td>
                            <td className="px-6 py-4 font-semibold">{song.artistName}</td>
                            <td className="px-6 py-4 font-semibold">
                                {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button style={{padding: "10px 15px"}}
                                    className="text-white px-2 py-1 rounded rounded-full hover:cursor-pointer hover:bg-[var(--color-bas-seconday-3)] transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSong(song.songId);
                                    }}
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {recommendedSongs.length > 0 && (
                <section style={{marginTop: "40px", padding: "10px 40px"}}
                         className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Recommended Songs</h2>
                    <table className="w-full text-sm text-left text-gray-400 border-separate border-spacing-y-2">
                        <thead className="text-xs uppercase text-gray-400 border-b">
                        <tr>
                            <th style={{padding: "10px 20px"}} className="text-center w-[20px]">#</th>
                            <th className="px-6 py-3">Song</th>
                            <th className="px-6 py-3">Artist</th>
                            <th className="px-6 py-3">Playtime</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recommendedSongs.map((song, index) => (
                            <tr
                                key={song.songId}
                                className={`border-b border-gray-700 hover:bg-[var(--color-ic-seconday-3)] cursor-pointer ${
                                    currentSongIndex === index ? "bg-[var(--color-primary)] text-white" : ""
                                }`}
                                onClick={() => onSelectSong(index, recommendedSongs)}
                            >
                                <td className="p-4 text-center font-semibold">{index + 1}</td>
                                <td style={{padding: "5px 0"}}
                                    className="flex items-center gap-4">
                                    <img className={"w-[40px] rounded-lg"} src={song.albumCover} alt=""/>
                                    <p className={"font-semibold"}>{song.songName}</p></td>
                                <td className="px-6 py-4 font-semibold">{song.artistName}</td>
                                <td className="px-6 py-4 font-semibold">{song.artistName}</td>
                                <td className="px-6 py-4 font-semibold">
                                    {Math.floor(song.duration / 60)}:
                                    {String(song.duration % 60).padStart(2, "0")}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            )}

            {recommendedSongs.length <= 0 ? <div className="flex justify-center mt-4">
                <button style={{padding: "0px 20px"}}
                    onClick={handleFindSimilarSongs}
                    className="hover:bg-[var(--color-bas-primary-3)] text-white rounded-lg font-semibold
                    bg-[var(--color-bg-primary-2)] h-[60px] rounded-lg border-3 border-[var(--color-bas-primary-2)]
                    transition delay-0 duration-300"
                >
                    Find Similar Songs
                </button>
            </div> : null}

            <FormPopUp
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                formType={formType}
                onSuccess={handleFormSuccess}
                playlistId={playlistId}
            />
        </div>
    );
}

export default PlaylistContent;
