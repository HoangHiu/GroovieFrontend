interface propsContext{
    icon: string,
    onClick?: () => void;
}

function PlayerBtn({icon, onClick}: propsContext){
    return(
        <>
            <button onClick={onClick}
                style={{padding: "8px"}}
                className={"hover:bg-[var(--color-ic-seconday-1)] hover:cursor-pointer focus:outline-none focus:shadow-outline" +
                    "transition duration-300 ease-in-out" +
                    "border rounded-lg"}>
                <img className={"min-w-[24px]"} src={icon} alt=""/>
            </button>
        </>
    )
}

export default PlayerBtn;