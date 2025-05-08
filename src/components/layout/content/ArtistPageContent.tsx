import imgPlaceholder from "../../../assets/images/placeholder/image-placeholder.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Song from "../../../models/Song.ts";
import CardListHori from "../CardListHori.tsx";

interface Album {
    uuid: string;
    name: string;
    coverUrl: string;
    songCount: number;
}

interface Artist {
    name: string;
    bio: string;
    gender: string;
    profileImageUrl: string;
}

function ArtistPageContent({
                               artistId,
                               onSelectSong,
                               currentSongIndex,
                           }: {
    artistId: string;
    onSelectSong: (songIndex: number, songPlaylist: Song[]) => void;
    currentSongIndex: number;
}) {
    const [artist, setArtist] = useState<Artist | null>(null);

    useEffect(() => {
        let imgUrl = "";
        async function fetchArtistCover() {
            try {
                const res = await axios.get(`http://localhost:8080/user/${artistId}/cover`, {
                });
                imgUrl = res.data.data;
            } catch (err) {
                console.error("Failed to fetch artist cover:", err);
            }
        }

        async function fetchArtistData() {
            try {
                const res = await axios.get(`http://localhost:8080/user/${artistId}`, {
                });
                const data = res.data.data;
                console.log(data)
                setArtist({
                    name: data.personalDetail.name,
                    bio: data.personalDetail.bio,
                    gender: data.personalDetail.gender,
                    profileImageUrl: imgUrl,
                });
            } catch (err) {
                console.error("Failed to fetch artist:", err);
            }
        }
        fetchArtistCover();
        fetchArtistData();
    }, [artistId]);


    return (
        <div className="bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
            {artist && (
                <section style={{padding: "0 20px"}}
                    className="w-full h-[220px] bg-[var(--color-bas-seconday-1)] flex items-center gap-6 p-6">
                    <img
                        src={artist.profileImageUrl}
                        className="h-[80%] aspect-square object-cover rounded-full"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-[var(--color-sc-seconday-2)]">Artist</p>
                        <h1 className="text-5xl font-bold">{artist.name}</h1>
                        <p className="text-sm max-w-xl text-gray-400">{artist.bio}</p>
                    </div>
                </section>
            )}

            <section style={{padding: "20px"}}
                className="mt-6 px-6">
                <CardListHori cardContentType={"album-false"} header={"Albums"} apiUrl={`http://localhost:8080/v1/album/search?userId=${artistId}&page_number=1&page_size=10`}></CardListHori>
            </section>
        </div>
    );
}

export default ArtistPageContent;
