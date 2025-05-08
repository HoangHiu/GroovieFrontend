import BigCardVerti from "../components/ui/BigCardVerti.tsx";
import FormPopUp from "../components/ui/FormPopUp.tsx";
import { useEffect, useState } from "react";
import axios from "axios";

interface Album {
    id: string;
    name: string;
    coverUrl: string;
}

function AlbumListPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [searchTerm, setSearchTerm] = useState("");


    const fetchAlbums = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/v1/album/me?page_number=0&page_size=100", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                const fetchedAlbums = response.data.data.content.map((album: any) => ({
                    id: album.uuid,
                    name: album.title,
                    coverUrl: album.url || "/default-cover.jpg",
                }));
                setAlbums(fetchedAlbums);
            } else {
                console.error("API response indicates failure:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch albums:", error);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const filteredAlbums = albums.filter(album =>
        album.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{padding: "10px"}}
             className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <section style={{padding: "10px 20px 0 20px"}}
                     className={"flex justify-between items-center"}>
                <h1 className={"text-2xl font-black"}>Your Albums</h1>
                <div className={"flex gap-4"}>
                    <input
                        style={{padding: '6px'}}
                        className={"border-[var(--color-bas-seconday-2)] border-1 border-solid rounded-md"}
                        type="text"
                        placeholder={"Find your album"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button onClick={() => setIsOpen(prev => !prev)}
                            style={{padding: "10px 20px"}}
                            className={"flex items-center rounded-lg bg-[var(--color-sc-primary-1)] " +
                                "hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer"}>
                        Add new album
                    </button>
                </div>
            </section>
            <section className={"w-full flex flex-wrap"}>
                {filteredAlbums.map(album => (
                    <BigCardVerti
                        key={album.id}
                        itemId={album.id}
                        itemName={album.name}
                        itemCover={album.coverUrl}
                        itemType={"album-true"}
                        onDelete={fetchAlbums}
                    />
                ))}
            </section>
            <FormPopUp isOpen={isOpen} setIsOpen={setIsOpen} formType={"createAlbum"} onSuccess={fetchAlbums}/>
        </div>
    );
}

export default AlbumListPage;
