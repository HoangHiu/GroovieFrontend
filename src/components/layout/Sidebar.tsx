import Navbar from "./Navbar.tsx";

import loginIcon from "../../assets/images/nav/login.svg";
import logoutIcon from "../../assets/images/nav/logout.svg";
import accountIcon from "../../assets/images/nav/account.svg";
import Logo from "../ui/Logo.tsx";
import {useNavigate} from "react-router-dom";
import NavBtn from "../common/NavBtn.tsx";
import {useEffect, useState} from "react";

import {jwtDecode} from "jwt-decode";

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

function Sidebar() {
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
        <div className="w-fit h-full flex flex-col gap-3">
            <Logo />
            <Navbar roles={roles}/>

            {token ? (
                <>
                    <NavBtn onClick={() => {navigate("/me")}} icon={accountIcon} />
                    <NavBtn onClick={handleLogout} icon={logoutIcon} />
                </>
            ) : (
                    <NavBtn onClick={handleToLogin} icon={loginIcon} />
            )}
        </div>
    );
}

export default Sidebar;