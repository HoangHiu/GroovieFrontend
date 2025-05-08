import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
    songId: string;
    onSuccess: () => void;
}

function AddSongToPlaylistForm({ songId, onSuccess }: Props) {
    const [playlists, setPlaylists] = useState<{ uuid: string; name: string }[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No authentication token found.");
                    return;
                }

                const response = await axios.get("http://localhost:8080/v1/playlist/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setPlaylists(response.data.data);
                } else {
                    setError("Failed to fetch playlists.");
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
                setError("An error occurred while fetching playlists.");
            }
        }

        fetchPlaylists();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!selectedPlaylist) {
            setError("Please select a playlist.");
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/v1/playlist/songs",
                { playlistId: selectedPlaylist, songIds: [songId] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                console.log("Song added successfully:", response.data);
                onSuccess();
            } else {
                setError(response.data.message || "Failed to add song to playlist.");
            }
        } catch (error) {
            console.error("Error adding song:", error);
            setError("An error occurred while adding the song to the playlist.");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2 text-lg">
                    Select Playlist
                    <select
                        style={{ padding: "10px", backgroundColor: "var(--color-ic-seconday-2)", color: "white" }}
                        className="border border-gray-300 opacity-50 rounded-sm text-base"
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a playlist</option>
                        {playlists.map((playlist) => (
                            <option key={playlist.uuid} value={playlist.uuid}>
                                {playlist.name}
                            </option>
                        ))}
                    </select>
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    style={{ padding: "10px" }}
                    className="flex justify-center rounded-lg bg-[var(--color-sc-primary-1)] hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer font-semibold"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Confirm"}
                </button>
            </form>
        </div>
    );
}

export default AddSongToPlaylistForm;
