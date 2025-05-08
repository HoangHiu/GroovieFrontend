import { useState } from "react";
import axios from "axios";

interface Props {
    onSuccess: () => void;
}

function CreatePlaylistForm({ onSuccess }: Props) {
    const [playlistName, setPlaylistName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/v1/playlist/me",
                { name: playlistName, description: null },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                console.log("Playlist created successfully:", response.data);
                setPlaylistName("");
                onSuccess(); // Trigger refresh
            } else {
                setError(response.data.message || "Failed to create playlist.");
            }
        } catch (error) {
            console.error("Error creating playlist:", error);
            setError("An error occurred while creating the playlist.");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2 text-lg">
                    Playlist name
                    <input
                        style={{ padding: "10px" }}
                        className="border border-gray-300 opacity-50 rounded-sm text-base"
                        type="text"
                        placeholder="Playlist name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        required
                    />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    style={{ padding: "10px" }}
                    className="flex justify-center rounded-lg bg-[var(--color-sc-primary-1)] hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer font-semibold"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}

export default CreatePlaylistForm;
