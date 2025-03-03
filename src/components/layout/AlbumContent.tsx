import Song from "../../models/Song.ts";
import { useEffect, useState } from "react";
import axios from "axios";

function AlbumContent(
    {
      albumId,
      onSelectSong,
      currentSongIndex
    }: {
    albumId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number
    }
    ) {

    const [songs, setSongs] = useState<Song[]>([]);
    const [album, setAlbum] = useState<{
        name: string;
        artistId: string;
        artistName: string;
        coverUrl: string;
    } | null>(null);

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

    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            <section style={{ padding: "20px" }} className="w-full h-[220px] bg-[var(--color-bas-seconday-1)] flex items-center gap-6">
                <img className="h-full aspect-square" src="" alt="" />
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">Album</p>
                    <h1 className="text-6xl font-bold">{album?.name}</h1>
                    <div className="flex gap-3 items-center">
                        <p className="font-semibold text-sm">{album?.artistName}</p>
                        <i>|</i>
                        <p className="font-semibold text-sm">Song count</p>
                        <i>|</i>
                        <p className="font-semibold text-sm">Total playtime</p>
                    </div>
                </div>
            </section>

            <section style={{ marginTop: "20px" }}>
                <table className="table-auto w-full text-left gap-3">
                    <thead className="border-b-1">
                    <tr>
                        <th className="px-6 w-[20px] text-center">#</th>
                        <th>Song</th>
                        <th>Artist</th>
                        <th>Playtime</th>
                    </tr>
                    </thead>

                    <tbody>
                    {songs.map((song, index) => (
                        <tr
                            key={song.songId}
                            className={`hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer ${
                                currentSongIndex === index ? "bg-[var(--color-primary)] text-white" : ""
                            }`}
                            onClick={() => onSelectSong(index, songs)}
                        >
                            <td className="text-center">{index + 1}</td>
                            <td>{song.songName}</td>
                            <td>{song.artistName}</td>
                            <td>3:45</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AlbumContent;
