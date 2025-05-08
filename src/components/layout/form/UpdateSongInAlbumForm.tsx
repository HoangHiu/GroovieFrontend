import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
    albumId: string;
    songId: string;
    onSuccess: () => void;
}

interface Genre {
    uuid: string;
    name: string;
}

interface SongDetailDto {
    title: string;
    duration: number;
    languages: string;
    genres: string[];
}

export default function UpdateSongInfoForm({ albumId, songId, onSuccess }: Props) {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [languages, setLanguages] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [songFile, setSongFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch genres
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:8080/v1/genre", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setGenres(res.data.data.map((g: any) => ({ uuid: g.uuid, name: g.name }))))
            .catch((err) => {
                console.error("Failed to fetch genres:", err);
                setError("Could not load genres.");
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get<SongDetailDto>(`http://localhost:8080/v1/song/${songId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const dto = res.data.data;
                setTitle(dto.title);
                setDuration(dto.duration);
                setLanguages(dto.languages);

                // map the returned names into uuids
                const nameSet = new Set(dto.genres);  // dto.genres is string[] of names
                const initialUuidSelection = genres
                    .filter((g) => nameSet.has(g.name))
                    .map((g) => g.uuid);
                setSelectedGenres(initialUuidSelection);
            })
            .catch((err) => {
                console.error("Failed to fetch song details:", err);
                setError("Could not load song data.");
            });
    }, [songId, genres]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        setSongFile(file);
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            setDuration(Math.ceil(audio.duration));
            URL.revokeObjectURL(url);
        };
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.value;
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        try {
            const updateRes = await axios.put(
                `http://localhost:8080/v1/song/${songId}`,
                {
                    title,
                    duration,
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

            const uploadUrl = updateRes.data.data.url;

            if (songFile) {
                await axios.put(uploadUrl, songFile, {
                    headers: { "Content-Type": "audio/mpeg" },
                });
            }

            onSuccess();
        } catch (err: any) {
            console.error("Error updating song:", err);
            setError(err.response?.data?.message || "Update failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
                Song Title
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />
            </label>

            <label className="flex flex-col gap-2">
                Duration (sec)
                <input
                    type="number"
                    value={duration}
                    readOnly
                    className="border rounded px-3 py-2 bg-gray-100"
                />
            </label>

            <label className="flex flex-col gap-2">
                Languages (comma-separated)
                <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />
            </label>

            <fieldset className="flex flex-col gap-2">
                <legend className="text-lg font-medium">Genres</legend>
                <div className="flex flex-wrap gap-4">
                    {genres.map((g) => (
                        <label key={g.uuid} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={g.uuid}
                                checked={selectedGenres.includes(g.uuid)}
                                onChange={handleGenreChange}
                            />
                            {g.name}
                        </label>
                    ))}
                </div>
            </fieldset>

            <label className="flex flex-col gap-2">
                Song File (MP3)
                <input type="file" accept="audio/mp3" onChange={handleFileChange} />
            </label>

            {error && <p className="text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? "Updating..." : "Update Song"}
            </button>
        </form>
    );
}
