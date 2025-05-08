import CreatePlaylistForm from "../layout/form/CreatePlaylistForm.tsx";
import React, { useEffect } from "react";
import DeletePlaylistForm from "../layout/form/DeletePlaylistForm.tsx";
import AddSongToPlaylistForm from "../layout/form/AddSongToPlaylistForm.tsx";
import CreateSongInAlbumForm from "../layout/form/CreateSongInAlbumForm.tsx";
import UpdatePlaylistForm from "../layout/form/UpdatePlaylistForm.tsx";
import CreateAlbumForm from "../layout/form/CreateAlbumForm.tsx";
import UpdateAlbumForm from "../layout/form/UpdateAlbumForm.tsx";
import DeleteAlbumForm from "../layout/form/DeleteAlbumForm.tsx";
import UpdateSongInAlbumForm from "../layout/form/UpdateSongInAlbumForm.tsx";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    formType: string;
    onSuccess: () => void;
    playlistId?: string;
    songId?: string;
    albumId?: string;
}

function FormPopUp({ isOpen, setIsOpen, formType, onSuccess, playlistId, songId, albumId }: Props) {
    const [formHeader, setFormHeader] = React.useState("");

    useEffect(() => {
        switch (formType) {
            case "createPlaylist":
                setFormHeader("Create Playlist");
                break;
            case "deletePlaylist":
                setFormHeader("Delete Playlist?");
                break;
            case "addToPlaylist":
                setFormHeader("Choose your playlist");
                break;
            case "createSong":
                setFormHeader("Add A Song");
                break;
            case "updatePlaylist":
                setFormHeader("Update Playlist");
                break;
            case "createAlbum":
                setFormHeader("Create Album");
                break;
            case "updateAlbum":
                setFormHeader("Update Album");
                break;
            case "deleteAlbum":
                setFormHeader("Delete Album?");
                break;
            case "updateSongInfo":
                setFormHeader("Update Song Info");
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
            case "addToPlaylist":
                return <AddSongToPlaylistForm songId={songId}
                                           onSuccess={() => {
                                               setIsOpen(false);
                                               onSuccess();
                                           }} />;
            case "createSong":
                return <CreateSongInAlbumForm albumId={albumId}
                                              onSuccess={() => {
                                                  setIsOpen(false);
                                                  onSuccess();
                                              }}/>
            case "updatePlaylist":
                return <UpdatePlaylistForm playlistId={playlistId}
                                              onSuccess={() => {
                                                  setIsOpen(false);
                                                  onSuccess();
                                              }}/>
            case "createAlbum":
                return <CreateAlbumForm onSuccess={() => {
                    setIsOpen(false);
                    onSuccess();
                }} />;
            case "updateAlbum":
                return <UpdateAlbumForm albumId={albumId}
                    onSuccess={() => {
                    setIsOpen(false);
                    onSuccess();
                }} />;
            case "deleteAlbum":
                return <DeleteAlbumForm albumId={albumId}
                                        onSuccess={() => {
                                            setIsOpen(false);
                                            onSuccess();
                                        }} />;
            case "updateSongInfo":
                return <UpdateSongInAlbumForm songId={songId}
                                              albumId={albumId}
                                              onSuccess={() => {
                                                  setIsOpen(false);
                                                  onSuccess();
                                              }} />
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
                     className={"flex justify-between items-center border-b-2 border-[var(--color-sc-seconday-1)] min-w-[200px]"}>
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
