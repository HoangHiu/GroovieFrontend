import loginSprite from "../../assets/images/login/loginSprite.svg";
import fullLogo from "../../assets/images/logo/logoFull.svg";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function LoginLayout(){
    const [currentlyLogin, setCurrentlyLogin] = useState<boolean>(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigator = useNavigate()

    function toggleCurrentlyLogin(){
        setCurrentlyLogin(!currentlyLogin);
        setError(null)
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!password || !username){
            setError("Missing credentials");
        }else {
            try {
                const response = await axios.post("http://localhost:8080/auth/login", {
                    username,
                    password,
                });

                if (response.data.data) {
                    localStorage.setItem("token", response.data.data);
                    setError(null)
                    navigator("/")
                }
            } catch (error) {
                setError("Invalid credentials");
            }
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!password || !passwordConfirm || !username){
            setError("Missing credentials");
        }else if(password !== passwordConfirm){
            setError("Passwords do not match");
        }else{
            try {
                const response = await axios.post("http://localhost:8080/auth/register", {
                    username,
                    password,
                });

                if (response.data.data) {
                    setCurrentlyLogin(true)
                    setError(null)
                }
            } catch (error) {
                setError("User already exists");
            }
        }
    };

    return(
        <div className={"max-w-full max-h-full flex flex-col items-center gap-18"}>
            <img className={"w-[150px]"} src={fullLogo} alt=""/>
            <div style={{padding: "0 150px"}} className={"w-full flex justify-evenly items-center "}>
                {/*login container*/}
                <div style={{padding: "20px"}}
                     className={"flex flex-col gap-4 " +
                         "bg-[var(--color-bg-seconday-2)] w-[350px] rounded-lg " +
                         "transition duration-300 ease-in-out"}>
                    {/*Header*/}
                    <h1 className={"text-2xl font-semibold text-[var(--color-at-seconday-2)]"}>
                        {(currentlyLogin ? "Login" : "Register")}
                    </h1>
                    {/*Form*/}
                    <form onSubmit={(currentlyLogin ? handleLogin : handleRegister)} className={"flex flex-col gap-5"}>
                        <label className={"text-[var(--color-sc-seconday-1)]"}>
                            Username
                            <input type="text"
                                   value={username}
                                   placeholder={"Username"}
                                   style={{padding:'5px 10px', marginTop: '8px'}}
                                   onChange={(e) => setUsername(e.target.value)} className="w-full border-0 p-2 rounded-md
                                   bg-[var(--color-ic-seconday-1)] text-[var(--color-bas-seconday-3)]"/>
                        </label>
                        <label className={"text-[var(--color-sc-seconday-1)]"}>
                            Password
                            <input type="password"
                                   value={password}
                                   placeholder={"Password"}
                                   style={{padding:'5px 10px', marginTop: '8px'}}
                                   onChange={(e) => setPassword(e.target.value)} className="w-full border-0 p-2 rounded-md
                                   bg-[var(--color-ic-seconday-1)] text-[var(--color-bas-seconday-3)]"/>
                        </label>
                        {currentlyLogin ? null :
                            <label className={"text-[var(--color-sc-seconday-1)]"}>
                            Confirm password
                            <input type="password"
                                   value={passwordConfirm}
                                   placeholder={"Confirm password"}
                                   style={{padding: '5px 10px', marginTop: '8px'}}
                                   onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full border-0 p-2 rounded-md
                                   bg-[var(--color-ic-seconday-1)] text-[var(--color-bas-seconday-3)]"/>
                            </label>}
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            style={{padding: "8px 16px", marginTop: '16px'}}
                            className={"bg-[var(--color-ic-seconday-1)] hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer" +
                                " border-0 rounded-lg" +
                                " transition duration-300 ease-in-out " +
                                " font-semibold text-center text-sm"}
                            type="submit">{currentlyLogin ? "Login" : "Register"}</button>
                    </form>

                    {/*Toggle form*/}
                    <div className={"flex flex-col gap-3"}>
                    <hr className="border-t border-gray-300 opacity-50"/>
                        <div className="flex justify-between items-center">
                            <p className={"text-sm opacity-75"}>{currentlyLogin ? "Doesn't have an account yet?" : "Already have an account?"}</p>
                            <button style={{padding: "8px 16px"}}
                                    onClick={toggleCurrentlyLogin}
                                    type="button"
                                    className={"bg-[var(--color-ic-seconday-1)] hover:bg-[var(--color-bas-primary-3)] hover:cursor-pointer" +
                                        " border-2 rounded-lg" +
                                        " transition duration-300 ease-in-out " +
                                        " font-semibold text-center text-sm"}
                            >
                                {currentlyLogin ? "Register" : "Login"}
                            </button>
                        </div>
                    </div>
                </div>
                <img className={"w-[500px]"} src={loginSprite} alt=""/>
            </div>
        </div>
    )
}

export default LoginLayout;