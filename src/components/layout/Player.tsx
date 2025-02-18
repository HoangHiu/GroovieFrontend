import playIcon from "../../assets/images/player/play.svg";
import repeatIcon from "../../assets/images/player/repeat.svg";
import skNextIcon from "../../assets/images/player/skip_next.svg";
import skPreviousIcon from "../../assets/images/player/skip_previous.svg";
import shuffleIcon from "../../assets/images/player/shuffle.svg";
import PlayerBtn from "../common/PlayerBtn.tsx";

function Player(){
    return(
        <>
            <div style={{padding: "0px 15px"}}
                className="p-8
             flex items-center w-full bg-[var(--color-bg-primary-2)] h-[60px] rounded-lg border-3 border-[var(--color-bas-primary-2)]">
                <section className={"flex"}>
                    <PlayerBtn icon={repeatIcon}></PlayerBtn>
                    <PlayerBtn icon={skPreviousIcon}></PlayerBtn>
                    <PlayerBtn icon={playIcon}></PlayerBtn>
                    <PlayerBtn icon={skNextIcon}></PlayerBtn>
                    <PlayerBtn icon={shuffleIcon}></PlayerBtn>
                </section>
            </div>
        </>
    );
}

export default Player;