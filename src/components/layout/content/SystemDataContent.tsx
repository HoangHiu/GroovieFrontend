import { useState, useEffect } from "react";
import axios from "axios";
import BigCardHori from "../../ui/BigCardHori.tsx";
import { FaTrash } from "react-icons/fa";
import UserInfoPopup from "../../ui/UserInfoPopup.tsx";
import CreateUserForm from "../form/CreateUserForm.tsx";

type PersonalDetailDtoOut = {
    name: string;
    dateOfBirth: string | null;
    gender: string | null;
    phoneNumber: string | null;
    bio: string | null;
    location: string | null;
};

type User = {
    uuid: string;
    username: string;
    email: string | null;
    personalDetailDtoOut: PersonalDetailDtoOut;
    profilePic: string;
};

type Album = {
    uuid: string;
    title: string;
    description: string;
    coverUrl: string;
    artistName: string;
};

type Group = {
    uuid: string;
    name: string;
    description: string;
    role: string;
};


type Tab = "users" | "albums";

const SystemDataContent = () => {
    const [selectedTab, setSelectedTab] = useState<Tab>("users");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [users, setUsers] = useState<User[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [clickedUserId, setClickedUserId] = useState<string>();
    const [clickedUserUrl, setClickedUserUrl] = useState<string>();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [groups, setGroups] = useState<Group[]>([]);
    const [filterRole, setFilterRole] = useState<string>("MODERATOR");
    const [searchText, setSearchText] = useState<string>("");
    const [albumSearchText, setAlbumSearchText] = useState<string>("");
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
        setNoResults(false);
    }, [selectedTab, searchText, filterRole, albumSearchText]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/api/v1/group", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const filtered = res.data.data.filter((g: Group) => g.role !== 'ADMIN');
                setGroups(filtered);
                setFilterRole("MODERATOR");
            } catch (err) {
                console.error("Failed to fetch groups for filter", err);
            }
        };
        fetchGroups();
    }, []);

    // Fetch users or albums
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                if (selectedTab === "users") {
                    const res = await axios.get("http://localhost:8080/user/search", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            page_number: currentPage,
                            page_size: pageSize,
                            info_name: searchText,
                            role: filterRole
                        },
                    });
                    const data = res.data.data;
                    setUsers(data.content || []);
                    setTotalPages(data.totalPages);
                    setNoResults(data.content.length === 0);
                } else {
                    const res = await axios.get("http://localhost:8080/v1/album/search", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            page_number: currentPage,
                            page_size: pageSize,
                            title: albumSearchText
                        },
                    });
                    const data = res.data.data;
                    setAlbums(
                        (data.content || []).map((album: any) => ({
                            uuid: album.uuid,
                            title: album.title,
                            description: album.description,
                            coverUrl: album.url,
                            artistName: album.userDtoOut.personalDetailDtoOut.name,
                        }))
                    );
                    setTotalPages(data.totalPages);
                    setNoResults((data.content || []).length === 0);
                }
            } catch (err: any) {
                if (selectedTab === "users" && err.response?.status === 404) {
                    setUsers([]);
                    setTotalPages(0);
                    setNoResults(true);
                } else if (selectedTab === "albums" && err.response?.status === 404) {
                    setAlbums([]);
                    setTotalPages(0);
                    setNoResults(true);
                } else {
                    console.error(`Failed to fetch ${selectedTab}:`, err);
                }
            }
        };
        fetchData();
    }, [selectedTab, currentPage, searchText, filterRole, albumSearchText]);

    const handleCreate = () => setShowCreateForm(true);

    const handleCreateSuccess = () => {
        setCurrentPage(1);
    };

    const handleDelete = async (user: User) => {
        const confirmed = window.confirm(`Are you sure you want to delete user "${user.username}"?`);
        if (!confirmed) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/user/${user.uuid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers((prev) => prev.filter((u) => u.uuid !== user.uuid));
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        }
    };

    const renderPagination = () => (
        <div className="flex gap-2 bottom-5 right-5 absolute items-center justify-center space-x-2 mt-6">
            <button style={{padding: "5px 15px"}}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[var(--color-bas-seconday-1)] hover:bg-[var(--color-bas-seconday-2)] hover:cursor-pointer disabled:opacity-50"
            >
                ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button style={{padding: "1px 10px"}}
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded bg-[var(--color-bas-seconday-1)] hover:bg-[var(--color-bas-seconday-2)] ${
                        num === currentPage ? " bg-purple-500 text-white" : " bg-[var(--color-bas-seconday-1)] hover:bg-[var(--color-bas-primary-2)]"
                    }`}
                >
                    {num}
                </button>
            ))}
            <button style={{padding: "5px 15px"}}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[var(--color-bas-seconday-1)] hover:bg-[var(--color-bas-seconday-2)] hover:cursor-pointer disabled:opacity-50"
            >
                Next ›
            </button>
        </div>
    );

    return (
        <>
            <div style={{padding: '30px'}}
                 className="relative p-4 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto">
                <div className="flex justify-between items-start mb-6 space-x-4">
                    <div style={{marginBottom: "20px", padding: ""}}
                         className="flex justify-between rounded-lg gap-3 bg-[var(--color-ic-seconday-3)]">
                        {(["users", "albums"] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setPageSize(tab == "users" ? 7 : 6)
                                    setSelectedTab(tab)
                                }}
                                style={{padding: "8px 20px"}}
                                className={`px-4 py-2 rounded hover:bg-[var(--color-bas-seconday-1)] hover:cursor-pointer ${
                                    selectedTab === tab ? "bg-[var(--color-bas-primary-2)]" : null
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {selectedTab === "users" && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{padding: "5px 15px"}}
                                className="px-3 py-1 border rounded w-60"
                            />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                style={{padding: "5px 15px"}}
                                className="px-3 py-1 border rounded"
                            >
                                {groups.map((g) => (
                                    <option
                                        style={{boxShadow: "0 0 10px 100px #1882A8 inset"}}
                                        className={"bg-[var(--color-ic-seconday-2)]"} key={g.uuid} value={g.role}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                style={{padding: "5px 15px"}}
                                onClick={handleCreate}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                + Create User
                            </button>
                        </div>
                    )}

                    {selectedTab === "albums" && (
                        <div className="flex items-center space-x-2">
                            <input style={{padding: "5px 15px"}}
                                type="text"
                                placeholder="Search by album title"
                                value={albumSearchText}
                                onChange={(e) => setAlbumSearchText(e.target.value)}
                                className="px-3 py-1 border rounded w-60"
                            />
                        </div>
                    )}

                    {showCreateForm && (
                        <CreateUserForm
                            onClose={() => setShowCreateForm(false)}
                            onSuccess={handleCreateSuccess}
                        />
                    )}
                </div>

                {/* Content */}
                {selectedTab === "users" ? (
                    noResults ? (
                        <p className="text-center text-[var(--color-sc-seconday-2)] mt-8">No users found</p>
                    ) : (
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table
                                className="w-full text-sm text-left text-[var(--color-sc-seconday-2)] border-separate border-spacing-y-2">
                                <thead className="text-xs uppercase bg-[var(--color-ic-seconday-3)]">
                                <tr>
                                    <th style={{padding: "10px"}} className="px-6 py-3 text-center w-[20px]">#</th>
                                    <th className="px-6 py-3">Profile</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Username</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3 w-[40px]"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((u, i) => (
                                    <tr key={u.uuid}
                                        className="border-b border-gray-700 hover:bg-[var(--color-ic-seconday-2)] cursor-pointer"
                                        onClick={() => {
                                            setClickedUserUrl(u.profilePic);
                                            setClickedUserId(u.uuid);
                                            setShowUserInfo(true);
                                        }}>
                                        <td className="p-4 text-center font-semibold">{(currentPage - 1) * pageSize + i + 1}</td>
                                        <td className="px-6 py-4">
                                            <img src={u.profilePic} alt={u.username}
                                                 className="w-10 h-10 rounded-lg object-cover"/>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{u.personalDetailDtoOut.name || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">@{u.username}</td>
                                        <td className="px-6 py-4 font-semibold">{u.email || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">{u.personalDetailDtoOut.phoneNumber || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">{u.personalDetailDtoOut.location || 'N/A'}</td>
                                        <td className="relative p-4 text-center">
                                            <button onClick={e => {
                                                e.stopPropagation();
                                                handleDelete(u);
                                            }}
                                                    className="text-xl leading-none focus:outline-none rounded-full hover:bg-[var(--color-bas-seconday-1)] p-2">
                                                <FaTrash/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : noResults ? (
                    <p className="text-center text-[var(--color-sc-seconday-2)] mt-8">No albums found</p>
                ) : (
                    <section className="w-full flex flex-wrap gap-4">
                        <div
                            style={{padding: "10px"}}
                            className="w-full text-sm text-left text-[var(--color-sc-seconday-2)] space-y-2"
                        >
                            <div style={{padding: "10px"}} className="flex bg-[var(--color-ic-seconday-3)] font-semibold uppercase">
                                <div className="px-6 py-3 w-[20px] flex-3">Name</div>
                                <div className="px-6 py-3 flex-[2.07]">Artist</div>
                                <div className="px-6 py-3">Action</div>
                            </div>

                        </div>
                        {albums.map((album) => (
                            <BigCardHori
                                key={album.uuid}
                                itemId={album.uuid}
                                itemName={album.title}
                                itemCover={album.coverUrl}
                                itemArtistName={album.artistName}
                                itemType="album-true"
                                onDelete={() => setCurrentPage(1)}
                            />
                        ))}
                    </section>
                )}

                {renderPagination()}
            </div>
            <UserInfoPopup inputCoverUrl={clickedUserUrl} userId={clickedUserId} isOpen={showUserInfo}
                           setIsOpen={setShowUserInfo}/>
            {showCreateForm &&
                <CreateUserForm onClose={() => setShowCreateForm(false)} onSuccess={handleCreateSuccess}/>}
        </>
    );
};

export default SystemDataContent;