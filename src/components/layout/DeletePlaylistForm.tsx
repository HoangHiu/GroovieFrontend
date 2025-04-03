import { useState } from "react";
import axios from "axios";

interface Props {
    playlistId: string;
    onSuccess: () => void;
}

function DeletePlaylistForm({ playlistId, onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:8080/v1/playlist/me?playlistId=${playlistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                console.log("Playlist deleted successfully:", response.data);
                onSuccess(); // Trigger refresh
            } else {
                setError(response.data.message || "Failed to delete playlist.");
            }
        } catch (error) {
            console.error("Error deleting playlist:", error);
            setError("An error occurred while deleting the playlist.");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            {error && <p className="text-red-500">{error}</p>}
            <button
                style={{ padding: "10px" }}
                className="flex justify-center rounded-lg bg-red-500 hover:bg-red-700 hover:cursor-pointer font-semibold text-white"
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading ? "Deleting..." : "Delete Playlist"}
            </button>
        </div>
    );
}

export default DeletePlaylistForm;
