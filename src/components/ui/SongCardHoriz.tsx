import imgPlaceholder from "../../assets/images/placeholder/image-placeholder.svg";

interface propsContext{
    albumImg?: string,
    title: string,
    authorName: string,
    width?: string,
}

function SoundCardHoriz({albumImg, title, authorName, width} : propsContext){
    const getWidth = (): string => {
        if(width){
            return width;
        }
        return "40px"
    };

    return(
        <div className={"flex w-[350px] gap-3 border-4 border-indigo-500"}>
            <img style={{width: getWidth()}} src={(albumImg) ? albumImg : imgPlaceholder}/>
            <div className={"w-[200px] flex flex-col items-start"}>
                <h1 className={"font-bold " +
                    "truncate overflow-hidden overflow-hidden text-ellipsis whitespace-nowrap w-full"}>{title}</h1>
                <p className={"text-xs " +
                    "truncate overflow-hidden overflow-hidden text-ellipsis whitespace-nowrap w-full"}>{authorName}</p>
            </div>
        </div>
    )
}

export default SoundCardHoriz;

