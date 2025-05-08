import React, {JSX, useEffect, useState} from "react";
import axios from "axios";
import imgPlaceholder from "../../assets/images/placeholder/image-placeholder.svg";
import { loadStripe } from '@stripe/stripe-js';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    userId?: string;
    contentChangeable?: boolean;
    inputCoverUrl?: string;
}

function UserInfoPopup({ isOpen, setIsOpen, userId, contentChangeable, inputCoverUrl }: Props) {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState<any>({});
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const [userRes, coverRes] = await Promise.all(userId != undefined ? [
                    axios.get("http://localhost:8080/user/" + userId, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8080/user/ " + userId +"/cover", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ] : [
                    axios.get("http://localhost:8080/user/me/info", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8080/user/me/cover", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                const userData = userRes.data.data;
                setUserInfo(userData);
                setEditedInfo(userData.personalDetail);
                setCoverUrl(coverRes.data.data);
            } catch (error) {
                console.error("Error fetching user info or cover", error);
            }
        };

        if (isOpen) {
            fetchUserData();
            setIsEditing(false);
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedInfo((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "image/jpeg") {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverUrl(reader.result as string);
                setNewImageFile(file);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a JPEG image.");
        }
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const requestBody = {
                name: editedInfo.name,
                dateOfBirth: editedInfo.dateOfBirth ? new Date(editedInfo.dateOfBirth).getTime() : null,
                gender: editedInfo.gender || "",
                phoneNumber: editedInfo.phoneNumber || "",
                bio: editedInfo.bio,
                location: editedInfo.location,
            };

            console.log(requestBody);

            if(userId != undefined){
                await axios.put("http://localhost:8080/user/info?user_id=" + userId, requestBody, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            }else{
                await axios.put("http://localhost:8080/user/me/info", requestBody, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            }

            if (newImageFile) {
                let presignedRes;
                if(userId != undefined){
                    presignedRes = await axios.put("http://localhost:8080/user/" + userId + "/cover", null, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }else{
                    presignedRes = await axios.put("http://localhost:8080/user/me/cover", null, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }

                console.log(presignedRes.data);
                const presignedUrl = presignedRes.data.data;

                await axios.put(presignedUrl, newImageFile, {
                    headers: {
                        "Content-Type": newImageFile.type,
                    },
                    transformRequest: [(data, headers) => {
                        delete headers.common;
                        delete headers.Authorization;
                        return data;
                    }]
                });
            }

            setUserInfo({
                ...userInfo,
                personalDetail: { ...editedInfo },
            });
            setIsEditing(false);
            alert("Profile updated successfully.");
        } catch (error) {
            console.error("Failed to update user info", error);
            alert("Update failed.");
        }
    };

    const handleCancel = () => {
        setEditedInfo(userInfo.personalDetail);
        setIsEditing(false);
        setNewImageFile(null);
    };

    const handleOnErrorLoadingImg = () => {
        setCoverUrl(imgPlaceholder);
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const stripe_public_key = 'pk_test_51RI1KjBV063LVQneZyJwZTtb6Rza5WNmsbmR5n9fajyRME13gYSTZvfLaIhYcpfJ9xVedS5gjuAsSc8sAbLUjoYX00ByQVD2Sb';

        const stripePromise = loadStripe(stripe_public_key);

        const response = await axios.post(
            "http://localhost:8080/api/v1/payment/create-checkout-session",
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const stripe = await stripePromise;

        const { error } = await stripe!.redirectToCheckout({ sessionId: response.data.data });

        if (error) {
            console.error(error);
        }
    };

    const handleCancelSubscription = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/v1/payment/cancel-subscription",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Subscription canceled successfully.");
        } catch (error) {
            console.error("Failed to cancel subscription", error);
            alert("Cancellation failed.");
        }
    };

    const handleShowSubscriptionButton = (): JSX.Element | null => {
        const userRoles = userInfo?.groups;

        if (!userRoles || !Array.isArray(userRoles)) {
            return null;
        }

        if (userRoles.some((group: any) => group.role === "REGULAR")) {
            return (
                <button onClick={handleCheckout} style={{padding: "5px 15px"}} className="bg-[var(--color-sc-primary-2)] rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-ic-primary-3)]">
                    Become Artist
                </button>
            );
        } else if (userRoles.some((group: any) => group.role === "ARTIST")) {
            return (
                <button onClick={handleCancelSubscription} style={{padding: "5px 15px"}} className="bg-[var(--color-sc-primary-2)] rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-ic-primary-3)]">
                    Cancel Subscription
                </button>
            );
        } else {
            return null;
        }
    };


    return (
        <div
            style={{ display: isOpen ? "flex" : "none"}}
            className="bg-gray-900/50 top-[-20px] left-[-20px] w-screen h-screen z-30 absolute items-center justify-center"
        >
            <div style={{ padding: "25px" }} className="flex bg-[var(--color-ic-seconday-2)] rounded-lg min-w-[450px] gap-4">
                <div className="flex items-center justify-center relative">
                </div>

                <div className="flex flex-col flex-1 pr-6">
                    <div style={{paddingBottom: "18px"}}
                        className="flex justify-between items-start border-b-2 border-[var(--color-sc-seconday-1)] pb-2 mb-4">
                        <div className={"flex items-center gap-5"}>
                            <label className={isEditing ? "cursor-pointer" : "cursor-default"}>
                                {inputCoverUrl === undefined ? (
                                    <>
                                        <img
                                            src={coverUrl || imgPlaceholder}
                                            onError={handleOnErrorLoadingImg}
                                            className="w-[50px] aspect-square rounded-full object-cover border-2 border-white"
                                        />
                                        {isEditing && (
                                            <input
                                                type="file"
                                                accept="image/jpeg"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        )}
                                    </>
                                ) : <img
                                    src={inputCoverUrl || imgPlaceholder}
                                    onError={handleOnErrorLoadingImg}
                                    className="w-[50px] aspect-square rounded-full object-cover border-2 border-white"
                                />}

                            </label>
                            {userInfo ? <div>
                                <h1 className={"font-semibold"}>{editedInfo["name"]}</h1>
                                <h1 className={"opacity-50 "}>{userInfo["email"]}</h1>
                            </div> : null}
                        </div>
                        <button
                            style={{padding: "10px"}}
                            className="rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-bas-seconday-2)]"
                            onClick={() => setIsOpen(false)}
                        >
                            X
                        </button>
                    </div>

                    {/*user Info */}
                    {userInfo ? (
                        <div className="space-y-3">
                            {['name', 'bio', 'location', 'gender'].map((field) => (
                                <div key={field}
                                     style={{padding: "10px"}}
                                     className={"flex justify-between border-b-2 border-[var(--color-bas-seconday-1)]"}>
                                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)} </strong>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name={field}
                                            value={editedInfo[field] || ""}
                                            onChange={handleInputChange}
                                            className="ml-2 px-2 py-1 rounded bg-white text-black"
                                        />
                                    ) : (
                                        <span className="ml-2">{editedInfo[field] || "N/A"}</span>
                                    )}
                                </div>
                            ))}
                            <div key={"email"}
                                 style={{padding: "10px"}}
                                 className={"flex justify-between border-b-2 border-[var(--color-bas-seconday-1)]"}>
                                <strong>{"email".charAt(0).toUpperCase() + "email".slice(1)} </strong>
                                <span className="ml-2">{userInfo["email"] || "N/A"}</span>
                            </div>

                            <div
                                style={{padding: "10px"}}
                                className={"flex justify-between border-b-2 border-[var(--color-bas-seconday-1)]"}>
                                <strong>Date of Birth</strong>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={editedInfo.dateOfBirth || ""}
                                        onChange={handleInputChange}
                                        className="ml-2 px-2 py-1 rounded bg-white text-black"
                                    />
                                ) : (
                                    <span className="ml-2">
                                        {editedInfo.dateOfBirth
                                            ? new Date(editedInfo.dateOfBirth).toISOString().split("T")[0]
                                            : "N/A"}
                                    </span>
                                )}
                            </div>

                            {contentChangeable == true ?
                                <div style={{paddingTop: "20px"}} className="flex gap-3 mt-4">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleConfirm}
                                                style={{padding: "5px 15px"}}
                                                className="bg-[var(--color-bas-seconday-1)] rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-bas-seconday-2)]"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                style={{padding: "5px 15px"}}
                                                className="bg-[var(--color-bas-seconday-1)] rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-bas-seconday-2)]"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            style={{padding: "5px 15px"}}
                                            className="bg-[var(--color-bas-seconday-1)] rounded-lg font-semibold hover:cursor-pointer hover:bg-[var(--color-bas-seconday-2)]"
                                        >
                                            Update Info
                                        </button>
                                    )}
                                    {handleShowSubscriptionButton()}
                                </div> : null
                            }

                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserInfoPopup;
