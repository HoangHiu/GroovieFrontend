import Navbar from "./Navbar.tsx";
function Sidebar({roles} : {roles: string[]}) {
    return (
        <div className="w-fit h-full flex flex-col gap-3">
            <Navbar roles={roles}/>
        </div>
    );
}

export default Sidebar;