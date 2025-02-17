import SmallBtn from "../common/SmallBtn.tsx";

import homeIcon from "../../assets/images/nav/home.svg";
import searchIcon from "../../assets/images/nav/search.svg";

function Navbar(){
    return(
    <>
        <div style={{padding: "15px 0px"}} className="flex flex-col pt-8 rounded-lg gap-4 bg-[var(--color-ic-seconday-1)]">
            <SmallBtn icon={homeIcon}></SmallBtn>
            <SmallBtn icon={searchIcon}></SmallBtn>
        </div>
    </>
    );
}

export default Navbar;