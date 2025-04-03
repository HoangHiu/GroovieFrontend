import BigCardVerti from "../components/ui/BigCardVerti.tsx";
import FormPopUp from "../components/ui/FormPopUp.tsx";
import  { useEffect, useState } from "react";
import axios from "axios";

interface Playlist {
    id: string;
    name: string;
}

function PlaylistListPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const fetchPlaylists = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/v1/playlist/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                const fetchedPlaylists = response.data.data.map((playlist: any) => ({
                    id: playlist.uuid,
                    name: playlist.name,
                }));
                setPlaylists(fetchedPlaylists);
            } else {
                console.error("API response indicates failure:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    return (
        <div style={{ padding: "10px" }}
             className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <section style={{ padding: "10px 20px 0 20px" }}
                     className={"flex justify-between items-center"}>
                <h1 className={"text-2xl font-black"}>Your Playlists</h1>
                <div className={"flex gap-4"}>
                    <input style={{ padding: '6px' }}
                           className={"border-[var(--color-bas-seconday-2)] border-1 border-solid rounded-md"}
                           type="text" placeholder={"Find your playlist"} />
                    <button onClick={() => setIsOpen(prev => !prev)}
                            style={{ padding: "10px 20px" }}
                            className={"flex items-center rounded-lg bg-[var(--color-sc-primary-1)] " +
                                "hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer"}>
                        Add new playlist
                    </button>
                </div>
            </section>
            <section className={"w-full flex flex-wrap"}>
                {playlists.map(playlist => (
                    <BigCardVerti
                        key={playlist.id}
                        itemId={playlist.id}
                        itemName={playlist.name}
                        itemCover={"/default-cover.jpg"}
                        itemType={"playlist"}
                        onDelete={fetchPlaylists}/>
                ))}
            </section>
            <FormPopUp isOpen={isOpen} setIsOpen={setIsOpen} formType={"createPlaylist"} onSuccess={fetchPlaylists}/>
        </div>
    );
}

export default PlaylistListPage;
