import imgPlaceholder from "../../assets/images/placeholder/image-placeholder.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormPopUp from "./FormPopUp.tsx";

interface Props {
    itemId: string;
    itemName: string;
    itemCover: string;
    itemArtistName?: string;
    onDelete?: () => void;
    itemType: "album" | "artist" | "playlist";
}

function BigCardVerti({ itemId, itemName, itemCover, itemArtistName, onDelete, itemType }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(itemCover);

    const navigate = useNavigate();

    const handleClick = () => {
        if (itemType === "album") {
            navigate(`/album/${itemId}`);
        } else if (itemType === "artist") {
            navigate(`/artist/${itemId}`);
        } else if (itemType === "playlist") {
            navigate(`/playlist/${itemId}`);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setIsOpen(true);
    };

    const handleOnErrorLoadingImg = () => {
        setImageSrc(imgPlaceholder);
    };

    const handleDeleteSuccess = () => {
        if (onDelete) onDelete();
        navigate("/playlists/me");
    };

    return (
        <div
            style={{ padding: "15px" }}
            className="flex flex-col w-[180px] gap-1 hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer transition duration-300 ease-in-out rounded-lg"
            onClick={handleClick}
        >
            <img
                style={{ margin: "0 0 15px 0" }}
                className={`${itemType === "album" || itemType === "playlist" ? "rounded-sm" : "rounded-full"} w-[150px] h-[150px] bg-gray-400`}
                src={imageSrc}
                alt={itemName}
                onError={handleOnErrorLoadingImg}
            />
            <h1 className="relative font-bold truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                {itemName}
                {itemType === "playlist" && (
                    <button
                        style={{ padding: "0px 8px" }}
                        className="absolute right-0 z-10 rounded-full hover:bg-white hover:cursor-pointer transition duration-400 ease-in-out"
                        onClick={handleDeleteClick}
                    >
                        X
                    </button>
                )}
            </h1>
            <p className="text-sm text-[var(--color-at-seconday-1)] truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                {itemArtistName}
            </p>

            <FormPopUp playlistId={itemId} isOpen={isOpen} setIsOpen={setIsOpen} formType="deletePlaylist" onSuccess={handleDeleteSuccess} />
        </div>
    );
}

export default BigCardVerti;
