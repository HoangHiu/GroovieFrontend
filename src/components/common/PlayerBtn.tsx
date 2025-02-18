interface propsContext{
    icon: string
}

function PlayerBtn({icon}: propsContext){
    return(
        <>
            <button
                style={{padding: "8px"}}
                className={"hover:bg-[var(--color-ic-seconday-1)] hover:cursor-pointer focus:outline-none focus:shadow-outline" +
                    "transition duration-300 ease-in-out" +
                    "border rounded-lg"}>
                <img src={icon} alt=""/>
            </button>
        </>
    )
}

export default PlayerBtn;