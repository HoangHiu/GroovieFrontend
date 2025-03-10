import NavBtn from "../common/NavBtn.tsx";

import homeIcon from "../../assets/images/nav/home.svg";
import searchIcon from "../../assets/images/nav/search.svg";
import playlistIcon from "../../assets/images/nav/playlists.svg";
import albumIcon from "../../assets/images/nav/album.svg";
import systemDataIcon from "../../assets/images/nav/dataset.svg";
import manModeratorIcon from "../../assets/images/nav/manModerator.svg";

import {useNavigate} from "react-router-dom";

function Navbar({roles} : {roles : string[]}){
    const navigate = useNavigate();

    const navItems = [
        { icon: homeIcon, onClick: () => navigate("/") },
        { icon: searchIcon, onClick: undefined },
    ];

    if (roles.length > 0) {
        navItems.push({ icon: playlistIcon, onClick: undefined });
    }

    if (roles.includes("ARTIST")){
        navItems.push({ icon: albumIcon, onClick: undefined });
    }

    if (roles.includes("MODERATOR") || roles.includes("ADMIN")) {
        navItems.push({ icon: systemDataIcon, onClick: undefined });
    }

    if (roles.includes("ADMIN")) {
        navItems.push({ icon: manModeratorIcon, onClick: undefined });
    }

    return (
        <div className="flex flex-col pt-8 rounded-lg bg-[var(--color-ic-seconday-1)] p-4">
            {navItems.map((item, index) => (
                <NavBtn key={index} icon={item.icon} onClick={item.onClick} />
            ))}
        </div>
    );
}

export default Navbar;