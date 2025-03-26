interface Playlist {
    id: string;
    name: string;
    cover: string;
}

const playlists: Playlist[] = [
    { id: "1", name: "Chill Vibes", cover: "/covers/chill-vibes.jpg" },
    { id: "2", name: "Workout", cover: "/covers/workout.jpg" },
    { id: "3", name: "Focus", cover: "/covers/focus.jpg" },
];

function PlaylistPage(){
    return (
        <div className={"flex flex-col gap-7 bg-[var(--color-ic-seconday-1)] rounded-lg overflow-auto"}>
            <section>
                <h1>Your PLaylists</h1>
                <button>+</button>
            </section>
            <section>

            </section>
        </div>
    )
}

export default PlaylistPage;