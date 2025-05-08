import React, { useEffect, useState } from "react";
import BigCardVerti from "../../ui/BigCardVerti.tsx";
import imgPlaceholder from "../../../assets/images/placeholder/image-placeholder.svg";
import Song from "../../../models/Song.ts";

const baseUrl = "http://localhost:8080";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function SearchPageContent({
                               playlistId,
                               onSelectSong,
                               currentSongIndex,
                           }: {
    playlistId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMoreSongs, setHasMoreSongs] = useState(true);
    const [hasMoreAlbums, setHasMoreAlbums] = useState(true);
    const [hasMoreArtists, setHasMoreArtists] = useState(true);
    const [loadingSongs, setLoadingSongs] = useState(false);
    const [loadingAlbums, setLoadingAlbums] = useState(false);
    const [loadingArtists, setLoadingArtists] = useState(false);

    // Reset songs albums artist when searchTerm changes
    useEffect(() => {
        if (!searchTerm) {
            setSongs([]);
            setAlbums([]);
            setArtists([]);
            setPageNumber(1);
            setHasMoreSongs(true);
            setHasMoreAlbums(true);
            setHasMoreArtists(true);
        } else {
            loadMoreSongs();
            loadMoreAlbums();
            loadMoreArtists();
        }
    }, [searchTerm]);


    const loadMoreSongs = async () => {
        if (!searchTerm || loadingSongs) return;
        setLoadingSongs(true);

        // Simulate network delay
        await sleep(1000); // Sleep for 1 second to simulate loading

        fetch(`${baseUrl}/v1/song/search?title=${searchTerm}&page_number=${pageNumber}&page_size=5`, {

        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSongs(prev => [...prev,
                        ...data.data.content.map((song: any) =>
                            new Song(
                                song.uuid,
                                song.title,
                                song.albumDtoOut.userDtoOut.uuid,
                                song.albumDtoOut.userDtoOut.personalDetailDtoOut.name,
                                song.duration,
                                song.url
                            )
                        )]);
                    setHasMoreSongs(pageNumber < data.data.totalPages);
                    setPageNumber(prev => prev + 1);
                } else {
                    setHasMoreSongs(false);
                }
            })
            .catch(err => console.error("Pagination fetch error:", err))
            .finally(() => setLoadingSongs(false));
    };

    const loadMoreAlbums = async () => {
        if (!searchTerm || loadingAlbums) return;
        setLoadingAlbums(true);

        // Simulate network delay
        await sleep(1000); // Sleep for 1 second to simulate loading

        fetch(`${baseUrl}/v1/album/search?title=${searchTerm}&page_number=${pageNumber}&page_size=5`, {

        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAlbums(prev => [...prev, ...data.data.content]);
                    setHasMoreAlbums(pageNumber < data.data.totalPages);
                    setPageNumber(prev => prev + 1);
                } else {
                    setHasMoreAlbums(false);
                }
            })
            .catch(err => console.error("Pagination fetch error:", err))
            .finally(() => setLoadingAlbums(false));
    };

    const loadMoreArtists = async () => {
        if (!searchTerm || loadingArtists) return;
        setLoadingArtists(true);

        await sleep(1000); // simulate network delay

        fetch(`${baseUrl}/user/search?info_name=${searchTerm}&role=ARTIST&page_number=${pageNumber}&page_size=5`, {

        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setArtists(prev => [...prev, ...data.data.content]);
                    setHasMoreArtists(pageNumber < data.data.totalPages);
                } else {
                    setHasMoreArtists(false);
                }
            })
            .catch(err => console.error("Artist fetch error:", err))
            .finally(() => {
                setLoadingArtists(false);
            });
    };

    return (
        <div style={{padding: "20px"}} className="flex flex-col gap-3 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto p-5">
            {/* Search bar */}
            <div className="w-[20%] h-[50px]">
                <input
                    style={{ padding: "10px" }}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-4 max-h-[430px]">
                {/* Songs */}
                <div style={{ padding: "20px" }} className="flex-[0.8] bg-[var(--color-ic-seconday-2)] rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
                    <h2 className="font-semibold text-lg mb-2">Songs</h2>
                    <ul className="flex flex-col gap-3">
                        {songs.map((song) => (
                            <li
                                onClick={() => onSelectSong(0, [song])}
                                key={song.songId}
                                className="flex items-center gap-3 h-[50px] cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={song.albumCover || imgPlaceholder}
                                    onError={(e) => {
                                        e.currentTarget.src = imgPlaceholder;
                                    }}
                                    alt="cover"
                                    className="aspect-square h-full rounded-lg"
                                />
                                <div>
                                    <h1 className="font-semibold">{song.songName}</h1>
                                    <span className="text-sm text-gray-600">
                                        {song.artistName || "Unknown Artist"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Load More Button for Songs */}
                    {hasMoreSongs && !loadingSongs && searchTerm !== "" && (
                        <div className="text-center py-4">
                            <button
                                onClick={loadMoreSongs}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Load More
                            </button>
                        </div>
                    )}

                    {/* Loading Indicator for Songs */}
                    {loadingSongs && (
                        <div className="text-center py-2 text-sm text-gray-400">
                            Loading more...
                        </div>
                    )}
                </div>

                <div style={{padding: "20px"}}
                     className="flex-[1.2] bg-[var(--color-ic-seconday-2)] rounded-lg p-4 overflow-y-auto">
                    {/* Albums */}
                    <div className="">
                        <h2 className="font-semibold text-lg mb-2">Albums</h2>
                        <div className="flex-1 bg-[var(--color-ic-seconday-2)] flex flex-wrap rounded-lg p-4 overflow-auto"
                             style={{padding: "20px"}}>
                            {albums.map((c) => (
                                <BigCardVerti
                                    key={c.uuid}
                                    itemId={c.uuid}
                                    itemName={c.title}
                                    itemCover={c.url}
                                    itemType="album-false"
                                    itemArtistName={c.userDtoOut.personalDetailDtoOut.name}
                                />
                            ))}
                        </div>

                        {/* Load More Button for Albums */}
                        {hasMoreAlbums && !loadingAlbums && searchTerm !== "" && (
                            <div className="text-center py-4">
                                <button
                                    onClick={loadMoreAlbums}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {/* Loading Indicator for Albums */}
                        {loadingAlbums && (
                            <div className="text-center py-2 text-sm text-gray-400">
                                Loading more...
                            </div>
                        )}
                    </div>
                </div>

                {/* Artists */}
                <div className="flex flex-col flex-[1.2] max-w-[800px] gap-4">
                    <div className="flex-1 bg-[var(--color-ic-seconday-2)] rounded-lg p-4 overflow-y-auto" style={{ padding: "20px" }}>
                        <h2 className="font-semibold text-lg mb-2">Artists</h2>
                        <div style={{padding: "20px"}}
                            className="flex flex-wrap gap-4">
                            {artists.map((artist) => (
                                <BigCardVerti
                                    key={artist.uuid}
                                    itemId={artist.uuid}
                                    itemName={artist.personalDetailDtoOut?.name || "Unknown"}
                                    itemCover={artist.profilePic || imgPlaceholder}
                                    itemType="artist"
                                />
                            ))}
                        </div>

                        {hasMoreArtists && !loadingArtists && searchTerm !== "" && (
                            <div className="text-center py-4">
                                <button
                                    onClick={loadMoreArtists}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {loadingArtists && (
                            <div className="text-center py-2 text-sm text-gray-400">
                                Loading more...
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}

export default SearchPageContent;
