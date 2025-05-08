import React, { useEffect, useState } from "react";
import axios from "axios";
import Song from "../../../models/Song.ts";
import FormPopUp from "../../ui/FormPopUp.tsx";

interface AlbumContentProps {
    albumId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number;
    contentChangeable: boolean;
}

// helper to decode roles from JWT in localStorage
function getRolesFromToken(): string[] {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
        const [, payloadB64] = token.split(".");
        const payload = JSON.parse(atob(payloadB64));
        return Array.isArray(payload.roles) ? payload.roles : [];
    } catch {
        return [];
    }
}

const AlbumContent: React.FC<AlbumContentProps> = ({
                                                       albumId,
                                                       onSelectSong,
                                                       currentSongIndex,
                                                       contentChangeable,
                                                   }) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [album, setAlbum] = useState<{
        name: string;
        artistId: string;
        artistName: string;
        coverUrl: string;
    } | null>(null);

    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState<
        "createSong" | "addToPlaylist" | "updateSongInfo" | "updateAlbum" | null
    >(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

    // derive artist flag from JWT
    const roles = getRolesFromToken();
    const isArtist = roles.includes("ARTIST");

    useEffect(() => {
        async function fetchAlbumData() {
            try {
                const albumResponse = await axios.get(
                    `http://localhost:8080/v1/album/${albumId}`
                );
                const albumData = albumResponse.data.data;
                const newAlbum = {
                    name: albumData.title,
                    artistId: albumData.userDtoOut.uuid,
                    artistName: albumData.userDtoOut.personalDetailDtoOut.name,
                    coverUrl: albumData.url,
                };
                setAlbum(newAlbum);

                const songsResponse = await axios.get(
                    `http://localhost:8080/v1/album/${albumId}/getSongs`
                );
                const songsData = songsResponse.data.data;
                setSongs(
                    songsData.map(
                        (item: any) =>
                            new Song(
                                item.uuid,
                                item.title,
                                newAlbum.artistId,
                                newAlbum.artistName,
                                item.duration
                            )
                    )
                );
            } catch (error) {
                console.error("Error fetching album data:", error);
            }
        }
        fetchAlbumData();
    }, [albumId]);

    const handleAddSongClick = () => {
        setFormType("createSong");
        setIsFormOpen(true);
    };

    const handleAddToPlaylistClick = (songId: string) => {
        setSelectedSongId(songId);
        setFormType("addToPlaylist");
        setIsFormOpen(true);
    };

    const handleUpdateSongInfoClick = (songId: string) => {
        setSelectedSongId(songId);
        setFormType("updateSongInfo");
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        window.location.reload();
    };

    const handleRemoveSong = async (songId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            await axios.post(
                "http://localhost:8080/v1/album/remove-song",
                {
                    albumId,
                    songId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // refresh song list
            const resp = await axios.get(
                `http://localhost:8080/v1/album/${albumId}/getSongs`
            );
            const data = resp.data.data;
            setSongs(
                data.map(
                    (item: any) =>
                        new Song(
                            item.uuid,
                            item.title,
                            album?.artistId || "",
                            album?.artistName || "",
                            item.duration
                        )
                )
            );
        } catch (error) {
            console.error("Error removing song:", error);
        }
    };

    // close popup on outside click
    useEffect(() => {
        function onClickOutside() {
            setOpenMenuFor(null);
        }
        if (openMenuFor) {
            document.addEventListener("click", onClickOutside);
            return () => document.removeEventListener("click", onClickOutside);
        }
    }, [openMenuFor]);

    const handleMenuToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        songId: string
    ) => {
        e.stopPropagation();
        setOpenMenuFor(openMenuFor === songId ? null : songId);
    };

    const filteredSong = songs.filter((song) =>
        song.songName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            {/* Album header */}
            <section
                style={{ padding: "20px" }}
                className="w-full h-[220px] bg-[var(--color-bas-seconday-1)] flex items-center gap-6"
            >
                <img
                    className="h-full aspect-square"
                    src={album?.coverUrl || "/default-cover.jpg"}
                    alt="Album Cover"
                />
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">
                        Album
                    </p>
                    <h1 className="text-6xl font-bold">{album?.name}</h1>
                    <div className="flex gap-3 items-center">
                        <p className="font-semibold text-sm">{album?.artistName}</p>
                        <i>|</i>
                        <p className="font-semibold text-sm">Song count: {songs.length}</p>
                    </div>
                </div>
            </section>

            {/* Search + Artist actions */}
            <section
                style={{ padding: "20px 20px 0px 20px" }}
                className="flex justify-end px-6 mt-4 gap-4"
            >
                <input
                    style={{ padding: "6px" }}
                    className="border-[var(--color-bas-seconday-2)] border-1 rounded-md"
                    type="text"
                    placeholder="Find your song"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {contentChangeable && isArtist && (
                    <div className="flex gap-4">
                        <button
                            style={{ padding: "10px 20px" }}
                            className="bg-[var(--color-sc-primary-1)] text-white px-4 py-2 rounded transition hover:bg-[var(--color-bas-primary-3)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFormType("updateAlbum");
                                setIsFormOpen(true);
                            }}
                        >
                            Edit Info
                        </button>
                        <button
                            style={{ padding: "10px 20px" }}
                            className="bg-[var(--color-sc-primary-1)] text-white px-4 py-2 rounded transition hover:bg-[var(--color-bas-primary-3)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddSongClick();
                            }}
                        >
                            Add a song
                        </button>
                    </div>
                )}
            </section>

            {/* Song list */}
            <section
                style={{ padding: "10px 40px" }}
                className="relative overflow-x-auto shadow-md sm:rounded-lg"
            >
                <table className="w-full text-sm text-left text-gray-400 border-separate border-spacing-y-2">
                    <thead className="text-xs uppercase text-gray-400 border-b">
                    <tr>
                        <th
                            style={{ padding: "10px 20px" }}
                            scope="col"
                            className="text-center w-[20px]"
                        >
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Song
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Artist
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Playtime
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSong.map((song, index) => (
                        <tr
                            key={song.songId}
                            className={`border-b border-gray-700 hover:bg-[var(--color-ic-seconday-2)] group cursor-pointer ${
                                currentSongIndex === index
                                    ? "bg-[var(--color-primary)] text-white"
                                    : ""
                            }`}
                            onClick={() => onSelectSong(index, songs)}
                        >
                            <td className="p-4 text-center font-semibold">
                                {index + 1}
                            </td>
                            <td className="flex items-center gap-4" style={{ padding: "5px 0" }}>
                                <img
                                    className="w-[40px] rounded-lg"
                                    src={album?.coverUrl}
                                    alt=""
                                />
                                <p className="font-semibold">{song.songName}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold">
                                {song.artistName}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                                {Math.floor(song.duration / 60)}:
                                {String(song.duration % 60).padStart(2, "0")}
                            </td>
                            <td className="relative p-4 text-center">
                                <button
                                    style={{ padding: "5px 12px" }}
                                    onClick={(e) => handleMenuToggle(e, song.songId)}
                                    className="text-xl leading-none focus:outline-none rounded-full hover:cursor-pointer hover:bg-[var(--color-bas-seconday-1)]"
                                >
                                    ⋮
                                </button>

                                {openMenuFor === song.songId && (
                                    <div
                                        className="absolute right-0 mt-2 w-35 bg-[var(--color-ic-seconday-3)] shadow-lg rounded-lg z-20"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            style={{padding: "10px 15px"}}
                                            className="w-full text-left font-semibold px-4 py-2 hover:bg-[var(--color-bas-seconday-1)]"
                                            onClick={() => {
                                                handleAddToPlaylistClick(song.songId);
                                                setOpenMenuFor(null);
                                            }}
                                        >
                                            Add to playlist
                                        </button>

                                        {contentChangeable && (
                                            <button
                                                style={{padding: "10px 15px"}}
                                                className="w-full text-left font-semibold px-4 py-2 hover:bg-[var(--color-bas-seconday-1)]"
                                                onClick={() => {
                                                    handleRemoveSong(song.songId);
                                                    setOpenMenuFor(null);
                                                }}
                                            >
                                                Remove song
                                            </button>
                                        )}

                                        {contentChangeable && isArtist && (
                                            <>
                                                <button
                                                    style={{padding: "10px 15px"}}
                                                    className="w-full text-left font-semibold px-4 py-2 hover:bg-[var(--color-bas-seconday-1)]"
                                                    onClick={() => {
                                                        handleUpdateSongInfoClick(song.songId);
                                                        setOpenMenuFor(null);
                                                    }}
                                                >
                                                    Edit song info
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            <FormPopUp
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                formType={formType}
                onSuccess={handleFormSuccess}
                albumId={albumId}
                songId={selectedSongId}
            />
        </div>
    );
};

export default AlbumContent;
