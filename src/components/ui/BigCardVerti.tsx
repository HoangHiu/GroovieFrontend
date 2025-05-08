import React, { useState } from "react";
import imgPlaceholder from "../../assets/images/placeholder/image-placeholder.svg";
import { useNavigate } from "react-router-dom";
import FormPopUp from "./FormPopUp.tsx";

interface Props {
    itemId: string;
    itemName: string;
    itemCover: string | string[];
    itemArtistName?: string;
    onDelete?: () => void;
    itemType: "album-true" | "album-false" | "artist" | "playlist";
}

const BigCardVerti: React.FC<Props> = ({
                                           itemId,
                                           itemName,
                                           itemCover,
                                           itemArtistName,
                                           onDelete,
                                           itemType
                                       }) => {
    const navigate = useNavigate();
    // Normalize covers into state to allow fallback on error
    const initialCovers = Array.isArray(itemCover) ? itemCover : [itemCover];
    const [covers, setCovers] = useState<string[]>(
        initialCovers.length > 0 ? initialCovers : [imgPlaceholder]
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (itemType === "album-true") navigate(`/album/${itemId}/true`);
        else if (itemType === "album-false") navigate(`/album/${itemId}/false`);
        else if (itemType === "artist") navigate(`/artist/${itemId}`);
        else if (itemType === "playlist") navigate(`/playlist/${itemId}`);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setIsOpen(true);
    };

    const handleOnError = (idx: number) => {
        setCovers(prev => prev.map((url, i) => (i === idx ? imgPlaceholder : url)));
    };

    const getFormType = (): string => {
        if (itemType === "album-true") return "deleteAlbum";
        if (itemType === "playlist") return "deletePlaylist";
        return "";
    };

    const handleDeleteSuccess = () => {
        if (onDelete) onDelete();
        if (itemType === "album-true") navigate("/albums/me");
        if (itemType === "playlist") navigate("/playlists/me");
    };

    return (
        <div
            style={{ padding: "15px" }}
            className="flex flex-col min-w-[180px] w-[180px] gap-1 hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer transition duration-300 ease-in-out rounded-lg"
            onClick={handleClick}
        >
            {covers.length < 4 ? (
                <img
                    src={covers[0]}
                    alt={itemName}
                    className={`${itemType === "artist" ? "rounded-full" : "rounded-sm"} w-[150px] h-[150px] bg-gray-400 mx-auto object-cover`}
                    onError={() => handleOnError(0)}
                    style={{ marginBottom: "15px" }}
                />
            ) : (
                <div
                    className="grid overflow-hidden rounded-sm bg-gray-400 gap-1 w-[150px] h-[150px] mx-auto grid-cols-2 grid-rows-2"
                >
                    {covers.slice(0, 4).map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`${itemName} cover ${idx + 1}`}
                            className="object-cover w-full h-full"
                            onError={() => handleOnError(idx)}
                        />
                    ))}
                </div>
            )}

            <h1 className="relative font-bold truncate whitespace-nowrap w-full">
                {itemName}
                {(itemType === "playlist" || itemType === "album-true") && (
                    <button
                        style={{ padding: "0px 8px" }}
                        className="absolute right-0 z-10 rounded-full hover:bg-white hover:cursor-pointer transition duration-300 ease-in-out"
                        onClick={handleDeleteClick}
                    >
                        X
                    </button>
                )}
            </h1>

            <p className="text-sm text-[var(--color-at-seconday-1)] truncate whitespace-nowrap w-full">
                {itemArtistName}
            </p>

            <FormPopUp
                playlistId={itemId}
                albumId={itemId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                formType={getFormType()}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};

export default BigCardVerti;
