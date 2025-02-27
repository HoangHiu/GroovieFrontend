import imgPlaceholder from "../../assets/images/placeholder/image-placeholder.svg";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface propsContext{
    itemId: string,
    itemName: string,
    itemCover: string,
    itemArtistName: string,
    itemType: string
}

function BigCardVerti(props: propsContext){
    const [imageSrc, setImageSrc] = useState<string>(props.itemCover);

    const navigate = useNavigate();

    const handleClick = (itemId: string) => {
        if (props.itemType === "album") {
            navigate(`/album/${itemId}`);
        } else if (props.itemType === "artist") {
            navigate(`/artist/${itemId}`);
        }
    };

    const imgBorderType = ():string => {
        return (props.itemType === "album") ? "rounded-sm" : "rounded-full";
    }

    function handleOnErrorLoadingImg(){
        setImageSrc(imgPlaceholder)
    }

    return(
        <div style={{padding: "15px"}}
            className={"flex flex-col w-[180px] gap-1 hover:bg-[var(--color-ic-seconday-3)] hover:cursor-pointer" +
                " transition duration-300 ease-in-out" +
                " rounded-lg"}
            onClick={() => handleClick(props.itemId)}>
            <img style={{margin: "0 0 15px 0"}} className={imgBorderType() + " w-[150px] h-[150px] bg-gray-400 ]"} src={imageSrc} alt={""} onError={() => handleOnErrorLoadingImg}/>
            <h1 className={"font-bold " +
                "truncate overflow-hidden overflow-hidden text-ellipsis whitespace-nowrap w-full"}>{props.itemName}</h1>
            <p className={"text-sm text-[var(--color-at-seconday-1)] " +
                "truncate overflow-hidden overflow-hidden " +
                "text-ellipsis whitespace-nowrap w-full"}>{props.itemArtistName}</p>
        </div>
    );
}

export default BigCardVerti;