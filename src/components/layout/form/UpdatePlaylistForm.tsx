import { useState } from "react";
import axios from "axios";

interface Props {
    playlistId: string;
    currentName: string;
    onSuccess: () => void;
}

function UpdatePlaylistForm({ playlistId, currentName, onSuccess }: Props) {
    const [newName, setNewName] = useState(currentName);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async () => {
        if (!newName.trim()) {
            setError("Playlist name cannot be empty.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/v1/playlist/me`,
                { name: newName },
                {
                    params: { playlistId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                console.log("Playlist updated successfully:", response.data);
                onSuccess();
            } else {
                setError(response.data.message || "Failed to update playlist.");
            }
        } catch (error) {
            console.error("Error updating playlist:", error);
            setError("An error occurred while updating the playlist.");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-4">
            {error && <p className="text-red-500">{error}</p>}
            <label className="flex flex-col gap-2 text-lg">
                New song title
                <input
                    style={{padding: "10px"}}
                    className="border border-gray-300 opacity-50 rounded-sm text-base"
                    type="text"
                    placeholder="New song title"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}

                    required
                />
            </label>
            <button
                style={{padding: "10px"}}
                className="flex justify-center rounded-lg bg-[var(--color-sc-primary-1)] hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer font-semibold text-white"
                onClick={handleUpdate}
                disabled={isLoading}
            >
                {isLoading ? "Updating..." : "Update"}
            </button>
        </div>
    );
}

export default UpdatePlaylistForm;
