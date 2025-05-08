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
    itemType: "album-true" | "album-false" | "artist" | "playlist";
}

function BigCardHori({ itemId, itemName, itemCover, itemArtistName, onDelete, itemType }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(itemCover);

    const navigate = useNavigate();

    const handleClick = () => {
        if (itemType === "album-true") {
            navigate(`/album/${itemId}/true`);
        } else if (itemType === "album-false") {
            navigate(`/album/${itemId}/false`);
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

    const getFormType = (): string => {
        if (itemType === "album-true") return "deleteAlbum";
        if (itemType === "playlist") return "deletePlaylist";
        return "";
    };

    const handleDeleteSuccess = () => {
        if (onDelete) onDelete();
        if (itemType === "album-true") {
            navigate("/albums/me");
        } else if (itemType === "playlist") {
            navigate("/playlists/me");
        }
    };

    return (
        <div style={{padding: "0 10px"}}
             onClick={handleClick}
             className="flex items-center p-4 w-full gap-4 hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer transition duration-300 ease-in-out rounded-lg"
        >
            <img
                src={imageSrc}
                alt={itemName}
                onError={handleOnErrorLoadingImg}
                className={`${
                    itemType === "album-true" || itemType === "album-false" || itemType === "playlist"
                        ? "rounded-sm"
                        : "rounded-full"
                } w-[40px] aspect-square object-cover bg-gray-400`}
            />

            <div style={{margin: "0 10px"}} className={"flex w-full justify-between"}>
                <h1 className="font-bold truncate text-[var(--color-at-seconday-1)] max-w-[200px] flex-1 ">{itemName}</h1>
                <p className="text-sm text-[var(--color-at-seconday-1)] truncate ">
                    {itemArtistName}
                </p>
                {(itemType === "playlist" || itemType === "album-true") && (
                    <button style={{padding: "0 10px"}}
                        className=" top-0 right-0 rounded-full hover:bg-white px-2 text-sm font-bold truncate text-[var(--color-at-seconday-1)]"
                        onClick={handleDeleteClick}
                    >
                        X
                    </button>
                )}
            </div>


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
}

export default BigCardHori;
