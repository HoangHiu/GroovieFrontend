import {Outlet, useNavigate} from "react-router-dom";
import Player from "./Player";
import {useEffect, useState} from "react";
import Sidebar from "./Sidebar.tsx";
import Logo from "../ui/Logo.tsx";

import {jwtDecode} from "jwt-decode";
import NavBtn from "../common/NavBtn.tsx";
import accountIcon from "../../assets/images/nav/account.svg";
import logoutIcon from "../../assets/images/nav/logout.svg";
import loginIcon from "../../assets/images/nav/login.svg";

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
                setRoles(decoded.roles || []); // Ensure it's an array
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token"); // Remove if invalid
                setToken(null);
                setRoles([]);
            }
        } else {
            setRoles([]); // Reset roles if no token
        }
    }, [token]); // Runs when token changes

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

    const navigate = useNavigate();
    const { token, roles, logout } = useAuth();

    function handleToLogin() {
        navigate("/login");
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[auto_minmax(0,1fr)] gap-4">
            <div style={{padding:'0 10px'}}
                className="col-span-2 flex w-full bg-[var(--color-ic-seconday-1)] justify-between rounded-lg">
                <Logo></Logo>
                <div className={"flex"}>
                    {token ? (
                        <>
                            <NavBtn text={""} onClick={() => {navigate("/me")}} icon={accountIcon} />
                            <NavBtn onClick={handleLogout} icon={logoutIcon} />
                        </>
                    ) : (
                        <NavBtn onClick={handleToLogin} icon={loginIcon} />
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
        </div>
    );
};

export default MainPageLayout;
