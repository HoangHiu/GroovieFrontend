import NavBtn from "../common/NavBtn.tsx";

import homeIcon from "../../assets/images/nav/home.svg";
import searchIcon from "../../assets/images/nav/search.svg";
import {useNavigate} from "react-router-dom";

function Navbar(){
    const navigate = useNavigate()

    function handleToHome(){
        navigate("/")
    }

    return(
    <>
        <div style={{padding: "15px 0px"}} className="flex flex-col pt-8 rounded-lg gap-4 bg-[var(--color-ic-seconday-1)]">
            <NavBtn onClick={handleToHome} icon={homeIcon}></NavBtn>
            <NavBtn icon={searchIcon}></NavBtn>
        </div>
    </>
    );
}

export default Navbar;