import { useEffect, useState } from "react";
import axios from "axios";
import imgPlaceholder from "../../../assets/images/placeholder/image-placeholder.svg";

function UpdateAlbumForm({
                             albumId,
                             onSuccess
                         }: {
    albumId: string;
    onSuccess: () => void;
}) {
    const [title, setTitle] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(imgPlaceholder);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchAlbum = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/album/${albumId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const album = res.data.data;
                setTitle(album.title);
                setReleaseYear(album.releaseYear.toString());
                if (album.coverUrl) {
                    setImagePreview(album.coverUrl);
                }
            } catch (err) {
                console.error("Error fetching album:", err);
                setError("Failed to fetch album details.");
            }
        };

        fetchAlbum();
    }, [albumId, token]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "image/jpeg") {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a JPEG image.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const updateRes = await axios.put(
                `http://localhost:8080/v1/album/${albumId}`,
                {
                    title,
                    releaseYear: parseInt(releaseYear, 10),
                    description: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const updatedAlbum = updateRes.data.data;
            console.log("Album updated:", updatedAlbum);

            if (imageFile && updatedAlbum.url) {
                await axios.put(updatedAlbum.url, imageFile, {
                    headers: {
                        "Content-Type": imageFile.type,
                    },
                    transformRequest: [(data, headers) => {
                        delete headers.common;
                        delete headers.Authorization;
                        return data;
                    }]
                });
                console.log("New cover image uploaded.");
            }

            onSuccess();
        } catch (err) {
            console.error("Error updating album:", err);
            setError("An error occurred while updating the album.");
        }

        setIsLoading(false);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label className="text-lg">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-sm text-base"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg">Release Year</label>
                <input
                    type="text"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    required
                    pattern="\d{4}"
                    title="Enter a valid year"
                    className="p-2 border border-gray-300 rounded-sm text-base"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg">Cover Image (JPEG)</label>
                <div className="flex items-center gap-4">
                    <img
                        src={imagePreview}
                        alt="Album Cover Preview"
                        className="w-[100px] h-[100px] object-cover rounded border"
                    />
                    <input type="file" accept="image/jpeg" onChange={handleImageChange} />
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
                {isLoading ? "Updating..." : "Update Album"}
            </button>
        </form>
    );
}

export default UpdateAlbumForm;
