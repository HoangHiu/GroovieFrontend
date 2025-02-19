import BigCardVerti from "../ui/BigCardVerti.tsx";
import { useState, useEffect } from "react";

class CardItem {
    id: string;
    name: string;
    cover: string;
    artistName: string;
    type: string;

    constructor(id: string, name: string, cover: string, artistName: string, type: string) {
        this.id = id;
        this.name = name;
        this.cover = cover;
        this.artistName = artistName;
        this.type = type;
    }
}

interface propsContext{
    cardContentType: string;
    header: string;
    contentUrl: string;
}

function CardListHori(props: propsContext) {
    const [cardList, setCardList] = useState<CardItem[]>([
        new CardItem("1", "Shape of You", "shape-of-you.jpg", "Ed Sheeran", "album"),
        new CardItem("2", "Blinding Lights", "blinding-lights.jpg", "The Weeknd", "single"),
        new CardItem("3", "Someone Like You", "someone-like-you.jpg", "Adele", "album"),
        new CardItem("4", "Uptown Funk", "uptown-funk.jpg", "Bruno Mars", "single"),
        new CardItem("5", "Bohemian Rhapsody", "bohemian-rhapsody.jpg", "Queen", "album"),
        new CardItem("6", "Uptown Funk", "uptown-funk.jpg", "Bruno Mars", "single"),
        new CardItem("7", "Bohemian Rhapsody", "bohemian-rhapsody.jpg", "Queen", "album"),

    ]);

    // useEffect(() => {
    //     // setCardList([
    //     //     new CardItem("1", "Shape of You", "shape-of-you.jpg", "Ed Sheeran", "album"),
    //     //     new CardItem("2", "Blinding Lights", "blinding-lights.jpg", "The Weeknd", "single"),
    //     //     new CardItem("3", "Someone Like You", "someone-like-you.jpg", "Adele", "album"),
    //     //     new CardItem("4", "Uptown Funk", "uptown-funk.jpg", "Bruno Mars", "single"),
    //     //     new CardItem("5", "Bohemian Rhapsody", "bohemian-rhapsody.jpg", "Queen", "album"),
    //     // ]);
    // }, []);


    return(
        <div style={{padding: "0 20px"}}>
            <h1 style={{paddingBottom: "15px"}} className={"text-3xl font-bold"}>{props.header}</h1>
            <div className={"max-w-full flex overflow-x-auto"}>
                {cardList.map(c => <BigCardVerti key={c.id} itemId={c.id} itemName={c.name} itemCover={c.cover}
                                                 itemType={props.cardContentType} itemArtistName={c.artistName}></BigCardVerti>)}
            </div>
        </div>
    )
}

export default CardListHori;