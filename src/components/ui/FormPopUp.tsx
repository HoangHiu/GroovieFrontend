import CreatePlaylistForm from "../layout/CreatePlaylistForm.tsx";
import React, { useEffect } from "react";
import DeletePlaylistForm from "../layout/DeletePlaylistForm.tsx";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    formType: string;
    onSuccess: () => void;
    playlistId?: string;
}

function FormPopUp({ isOpen, setIsOpen, formType, onSuccess, playlistId }: Props) {
    const [formHeader, setFormHeader] = React.useState("");

    useEffect(() => {
        switch (formType) {
            case "createPlaylist":
                setFormHeader("Create Playlist");
                break;
            default:
                setFormHeader("");
        }
    }, [formType]);

    function getFormLayout() {
        switch (formType) {
            case "createPlaylist":
                return <CreatePlaylistForm onSuccess={() => {
                    setIsOpen(false);
                    onSuccess();
                }} />;
            case "deletePlaylist":
                return <DeletePlaylistForm playlistId={playlistId}
                    onSuccess={() => {
                    setIsOpen(false);
                    onSuccess();
                }} />;
            default:
                return null;
        }
    }

    return (
        <div style={{ display: isOpen ? "flex" : "none" }}
             className={"bg-gray-900/50 top-[-20px] left-[-20px] w-screen h-screen z-30 absolute items-center justify-center"}>
            <div style={{ padding: "20px" }}
                 className={"flex flex-col bg-[var(--color-ic-seconday-2)] rounded-lg"}>
                <div style={{ paddingBottom: "10px", marginBottom: "20px" }}
                     className={"flex justify-between items-center border-b-2 border-[var(--color-sc-seconday-1)]"}>
                    <h1 className={"text-xl font-semibold"}>{formHeader}</h1>
                    <button style={{ padding: "10px" }}
                            className={"hover:bg-red-500 hover:cursor-pointer rounded-lg"}
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsOpen(false)
                            }}>X
                    </button>
                </div>
                <div>
                    {getFormLayout()}
                </div>
            </div>
        </div>
    );
}

export default FormPopUp;
