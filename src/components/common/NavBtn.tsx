import {useRef} from "react";

interface propsContext{
    icon: string;
    width?: string|number;
    height?: string|number;
    text?: string;
    onClick?: () => void;
}

function NavBtn ({ icon, text, onClick = () => {}}: propsContext){
    const btnRef  = useRef<HTMLButtonElement | null>(null);

    return<button onClick={onClick} ref={btnRef}
                  className="flex items-center rounded-lg gap-4
                  bg-[var(--color-ic-seconday-1)]
                  hover:bg-[var(--color-sc-primary-1)] hover:cursor-pointer
                  transition delay-0 duration-300
                  font-bold text-xl"
                  style={{padding:'15px'}}>
        <img className={"w-[35px]"} src={icon} alt=""/>
        {text}
    </button>
}

export default NavBtn;