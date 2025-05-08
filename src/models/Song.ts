class Song {
    songId: string;
    songName: string;
    artistId: string;
    artistName: string;
    duration?: number;
    albumCover?: string;

    constructor(songId: string, songName: string, artistId: string, artistName: string, duration?: number, albumCover?: string) {
        this.songId = songId;
        this.songName = songName;
        this.artistId = artistId;
        this.artistName = artistName;
        this.duration = duration;
        this.albumCover = albumCover;
    }
}

export default Song;
