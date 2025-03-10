import {useRef} from "react";

interface propsContext{
    icon: string;
    width?: string|number;
    height?: string|number;
    onClick?: () => void;
}

function NavBtn ({ icon, width= "60px", height="60px", onClick = () => {}}: propsContext){
    const btnRef  = useRef<HTMLButtonElement | null>(null);

    return<button onClick={onClick} ref={btnRef}
                  className="flex items-center justify-center rounded-lg gap-4
                  bg-[var(--color-ic-seconday-1)]
                  hover:bg-[var(--color-sc-primary-1)] hover:cursor-pointer
                  transition delay-0 duration-300"
                  style={{height, width}}>
        <img className={"w-[35px]"} src={icon} alt=""/>
    </button>
}

export default NavBtn;