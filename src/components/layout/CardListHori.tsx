import BigCardVerti from "../ui/BigCardVerti.tsx";
import { useState, useEffect } from "react";
import axios from "axios";


class CardItem {
    id: string;
    name: string;
    cover: string;
    artistName: string;

    constructor(id: string, name: string, cover: string, artistName: string) {
        this.id = id;
        this.name = name;
        this.cover = cover;
        this.artistName = artistName;
    }
}

interface propsContext{
    cardContentType: string;
    header: string;
    contentUrl: string;
}

function CardListHori(props: propsContext) {
    const [cardList, setCardList] = useState<CardItem[]>([]);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:8080/v1/album?page_number=0&page_size=100',
            headers: {
                 Authorization: 'Bearer ' +
                    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoaWV1QWRtaW4iLCJpYXQiOjE3Mzk5Mzc3NjAsImV4cCI6MTc0MDA0NTc2MH0.2BzI29m1wthO3qGC_-nYVnUa8s8I22wvFLGg-HOEjF6cuX1LvuMTk93g7Ndpo2ftz6yOmqj7hxKprUQ12q5Kng'
            }
        })
            .then(function(response){
                setCardList(response.data.data.content.map(i => new CardItem(i.uuid, i.title, "cover", "artist")))
            })
    }, []);


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