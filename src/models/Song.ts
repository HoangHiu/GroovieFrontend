class Song {
    songId: string;
    songName: string;
    artistId: string;
    artistName: string;

    constructor(songId: string, songName: string, artistId: string, artistName: string) {
        this.songId = songId;
        this.songName = songName;
        this.artistId = artistId;
        this.artistName = artistName;
    }
}

export default Song;
