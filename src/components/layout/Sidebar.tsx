import Navbar from "./Navbar.tsx";

import loginIcon from "../../assets/images/nav/login.svg";
import logoutIcon from "../../assets/images/nav/logout.svg";
import Logo from "../ui/Logo.tsx";
import {useNavigate} from "react-router-dom";
import NavBtn from "../common/NavBtn.tsx";
import {useEffect} from "react";

function Sidebar(){
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function handleToLogin(){
        navigate("/login")
    }

    function handleLogout(){
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <>
            <div className="w-fit h-full flex flex-col gap-3">
                <Logo></Logo>
                <Navbar></Navbar>
                {token ? <NavBtn onClick={handleLogout} icon={logoutIcon}></NavBtn>
                    : <NavBtn onClick={handleToLogin} icon={loginIcon}></NavBtn>}

            </div>
        </>
    )
}

export default Sidebar;