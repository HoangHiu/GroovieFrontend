import {useRef, useState} from "react";

interface propsContext{
    icon: string;
    width?: string|number;
    height?: string|number;
}

function NavBtn ({ icon, width= "60px", height="60px" }: propsContext){
    const initBackground: string = "var(--color-ic-seconday-1)";
    const highlightBackground: string = "var(--color-sc-primary-1)";

    const [currentBtnColor, setCurrentBtnColor] = useState(initBackground)
    const btnRef  = useRef<HTMLButtonElement | null>(null);

    function handleOnClick(){
        setCurrentBtnColor((prevColor) =>
            prevColor === initBackground ? highlightBackground : initBackground)
    }

    function handleOnMouseEnter(){
        setCurrentBtnColor((prevColor) =>
            prevColor === initBackground ? highlightBackground : initBackground)
    }

    function handleOnMouseLeave(){
        setCurrentBtnColor((prevColor) =>
            prevColor === highlightBackground ? initBackground : highlightBackground)
    }

    return<button onClick={handleOnClick} ref={btnRef}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                  className="flex items-center justify-center rounded-lg gap-4"
                  style={{height, width, backgroundColor: currentBtnColor}}>
        <img src={icon} alt=""/>
    </button>
}

export default NavBtn;