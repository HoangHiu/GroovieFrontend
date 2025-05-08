import { useState } from "react";
import axios from "axios";

interface Props {
    albumId: string;
    onSuccess: () => void;
}

function DeleteAlbumForm({ albumId, onSuccess }: Props) {
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
                `http://localhost:8080/v1/album/${albumId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                console.log("Album deleted successfully:", response.data);
                onSuccess();
            } else {
                setError(response.data.message || "Failed to delete album.");
            }
        } catch (error) {
            console.error("Error deleting album:", error);
            setError("An error occurred while deleting the album.");
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
                {isLoading ? "Deleting..." : "Confirm"}
            </button>
        </div>
    );
}

export default DeleteAlbumForm;
