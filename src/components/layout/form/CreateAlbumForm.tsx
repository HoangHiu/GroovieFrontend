import { useState } from "react";
import axios from "axios";
import imgPlaceholder from "../../../assets/images/placeholder/image-placeholder.svg";

function CreateAlbumForm({ onSuccess }: { onSuccess: () => void }) {
    const [title, setTitle] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(imgPlaceholder);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No authentication token found.");
            setIsLoading(false);
            return;
        }

        try {
            const createRes = await axios.post(
                "http://localhost:8080/v1/album",
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

            const album = createRes.data.data;
            console.log("Album created:", album);

            // Upload cover image if exists
            if (imageFile && album.url) {
                await axios.put(album.url, imageFile, {
                    headers: {
                        "Content-Type": imageFile.type,
                    },
                    transformRequest: [(data, headers) => {
                        delete headers.common;
                        delete headers.Authorization;
                        return data;
                    }]
                });
                console.log("Cover image uploaded.");
            }

            setTitle("");
            setReleaseYear("");
            setImageFile(null);
            setImagePreview(imgPlaceholder);
            onSuccess();
        } catch (err) {
            console.error("Error creating album:", err);
            setError("An error occurred while creating the album.");
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
                {isLoading ? "Creating..." : "Create Album"}
            </button>
        </form>
    );
}

export default CreateAlbumForm;
