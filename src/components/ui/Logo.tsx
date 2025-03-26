import logoIcon from "../../assets/images/logo/logo.svg";

function Logo(){
    return (
        <div>
        <button className={"rounded-lg flex items-center gap-4"}
            style={{height:"60px", width:"60px",
                padding:"10px",
                backgroundColor: "var(--color-ic-seconday-1)"}}>
            <img src={logoIcon} alt=""/>
            <p className={"uppercase font-extrabold text-2xl tracking-wider"}>Groovie</p>
        </button>
    </div>
    );
}

export default Logo;