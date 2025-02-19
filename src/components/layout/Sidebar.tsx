import Navbar from "./Navbar.tsx";

import loginIcon from "../../assets/images/nav/login.svg";
import SmallBtn from "../common/NavBtn.tsx";
import Logo from "../ui/Logo.tsx";

function Sidebar(){
    return (
        <>
            <div className="w-fit h-full flex flex-col gap-3">
                <Logo></Logo>
                <Navbar></Navbar>
                <SmallBtn icon={loginIcon}></SmallBtn>
            </div>
        </>
    )
}

export default Sidebar;