import logoIcon from "../../assets/images/logo/logo.svg";

function Logo(){
    return (
        <>
        <button className={"rounded-lg"}
            style={{height:"60px", width:"60px",
                padding:"10px",
                backgroundColor: "var(--color-ic-seconday-1)"}}>
            <img src={logoIcon} alt=""/>
        </button>
    </>
    );
}

export default Logo;