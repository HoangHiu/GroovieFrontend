import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
    albumId: string;
    onSuccess: () => void;
}

function CreateSongInAlbumForm({ albumId, onSuccess }: Props) {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(0);
    const [languages, setLanguages] = useState('');
    const [genres, setGenres] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [songFile, setSongFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get("http://localhost:8080/v1/genres")
            .then(response => {
                setGenres(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching genres:", error);
                setError("Failed to fetch genres.");
            });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSongFile(file);

            const audio = new Audio(URL.createObjectURL(file));
            audio.addEventListener('loadedmetadata', () => {
                setDuration(Math.ceil(audio.duration));
            });
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const genre = e.target.value;
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

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
            // Create song record
            const createSongResponse = await axios.post(
                "http://localhost:8080/v1/song",
                {
                    title,
                    duration,
                    fileSize: songFile?.size ?? 0,
                    languages,
                    genreIds: selectedGenres,
                    albumId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (createSongResponse.data.success) {
                const songData = createSongResponse.data.data;
                const songId = songData.uuid;

                // Prepare both requests
                const uploadToDB = axios.put(songData.url, songFile, {
                    headers: {
                        "Content-Type": "audio/mpeg",
                    },
                });

                const formData = new FormData();

                formData.append("song_id", songId);
                formData.append("file", songFile as File);

                const analyzeAudio = axios.post("http://localhost:18080/analyze-audio/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Run both in parallel
                const [uploadResponse, analyzeResponse] = await Promise.all([uploadToDB, analyzeAudio]);

                if (uploadResponse.status === 200 || uploadResponse.status === 204) {
                    console.log("Song file uploaded successfully.");
                    console.log("Analysis response:", analyzeResponse.data);

                    setTitle("");
                    setDuration(0);
                    setLanguages("");
                    setSelectedGenres([]);
                    setSongFile(null);
                    onSuccess();
                } else {
                    setError("Failed to upload song file.");
                }
            } else {
                setError(createSongResponse.data.message || "Failed to create song.");
            }
        } catch (error) {
            console.error("Error creating or uploading song:", error);
            setError("An error occurred while creating or uploading the song.");
        }

        setIsLoading(false);
    };


    return (
        <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-lg">
                Song title
                <input
                style={{ padding: "10px" }}
                className="border border-gray-300 opacity-50 rounded-sm text-base"
                type="text"
                placeholder="Song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </label>
            <label className="flex flex-col gap-2 text-lg">
                Song duration (in seconds)
                <input
                    style={{padding: "10px"}}
                    className="border border-gray-300 opacity-50 rounded-sm text-base"
                    type="number"
                    value={duration}
                    readOnly
                />
            </label>
            <label className="flex flex-col gap-2 text-lg">
                Languages (comma-separated)
                <input
                    style={{padding: "10px" }}
                className="border border-gray-300 opacity-50 rounded-sm text-base"
                type="text"
                placeholder="Languages"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                required
                />
            </label>
            <label className="flex flex-col gap-2 text-lg">
                Select Genres
                    <div className="flex gap-4 flex-wrap">
                        {genres.map((genre) => (
                                <label key={genre} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                            value={genre}
                            checked={selectedGenres.includes(genre)}
                            onChange={handleGenreChange}
                    />
                    {genre}
                    </label>
                        ))}
                    </div>
            </label>
            <label className="flex flex-col gap-2 text-lg">
                Song file (MP3)
                <input
                type="file"
                accept="audio/mp3"
                onChange={handleFileChange}
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
                    {isLoading ? "Creating..." : "Create Song"}
                </button>
            </form>
        </div>
);
}

export default CreateSongInAlbumForm;
