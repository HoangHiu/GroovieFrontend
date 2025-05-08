import {Outlet, useNavigate} from "react-router-dom";
import Player from "./Player";
import {useEffect, useState} from "react";
import Sidebar from "./Sidebar.tsx";
import Logo from "../ui/Logo.tsx";

import {jwtDecode} from "jwt-decode";
import NavBtn from "../common/NavBtn.tsx";
import accountIcon from "../../assets/images/nav/account.svg";
import loginIcon from "../../assets/images/nav/login.svg";
import UserInfoPopup from "../ui/UserInfoPopup.tsx";

interface DecodedToken {
    roles: string[];
    exp?: number;
}

function useAuth() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                setRoles(decoded.roles || []);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                setToken(null);
                setRoles([]);
            }
        } else {
            setRoles([]);
        }
    }, [token]);

    function login(newToken: string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return { token, roles, login, logout };
}

const MainPageLayout = () => {
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);

    const navigate = useNavigate();
    const { token, roles, logout } = useAuth();

    function handleToLogin() {
        navigate("/login");
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    function handleOpenSubMenu(e: MouseEvent) {
        e.stopPropagation();
        setShowSubMenu(show => !show);
    }

    useEffect(() => {
        function handleClickOutside() {
            setShowSubMenu(false);
        }
        if (showSubMenu) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [showSubMenu]);

    return (
        <div className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[auto_minmax(0,1fr)] gap-4 relative">
            <div style={{padding:'0 10px'}}
                className="col-span-2 flex w-full bg-[var(--color-ic-seconday-1)] justify-between rounded-lg">
                <Logo></Logo>
                <div className={"flex relative"}>
                    {token ? (
                        <>
                            <NavBtn
                                text=""
                                icon={accountIcon}
                                onClick={handleOpenSubMenu}
                            />
                            {showSubMenu && (
                                <div
                                    className="rounded-lg flex flex-col absolute right-5 bottom-[-80px] w-30 mt-2 bg-[var(--color-ic-seconday-2)] shadow-lg rounded-lg z-10 transition duration-300 ease-in-out"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button style={{padding:'10px'}}
                                        className="rounded-lg text-left hover:cursor-pointer hover:bg-[var(--color-bas-seconday-1)] transition duration-300 ease-in-out"
                                        onClick={() => {
                                            setShowUserInfo(true);
                                            setShowSubMenu(false);
                                        }}
                                    >
                                        My Info
                                    </button>
                                    <button style={{padding:'10px'}}
                                        className="rounded-lg text-red-400 text-left hover:cursor-pointer hover:bg-[var(--color-bas-seconday-1)] transition duration-300 ease-in-out"
                                        onClick={() => {
                                            handleLogout();
                                            setShowSubMenu(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <NavBtn onClick={handleToLogin} icon={loginIcon} text="Login" />
                    )}
                </div>
            </div>
            <Sidebar roles={roles}/>

            <Outlet context={{setCurrentPlaylist, setCurrentSongIndex, currentPlaylist, currentSongIndex}}/>

            <Player
                album={currentPlaylist}
                songIndex={currentSongIndex}
                setSongIndex={setCurrentSongIndex}
            />
            <UserInfoPopup contentChangeable={true} isOpen={showUserInfo} setIsOpen={setShowUserInfo} />
        </div>
    );
};

export default MainPageLayout;
