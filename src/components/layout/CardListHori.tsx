import BigCardVerti from "../ui/BigCardVerti.tsx";
import { useState, useEffect } from "react";
import axios from "axios";


class CardItem {
    id: string;
    name: string;
    cover: string;
    artistId: string;
    artistName: string;

    constructor(id: string, name: string, cover: string, artistId: string, artistName: string) {
        this.id = id;
        this.name = name;
        this.cover = cover;
        this.artistId = artistId;
        this.artistName = artistName;
    }
}

interface propsContext{
    cardContentType: string;
    header: string;
    apiUrl: string;
}

function CardListHori(props: propsContext) {
    const [cardList, setCardList] = useState<CardItem[]>([]);

    const getAllUrl : string = "http://localhost:8080/v1/album?page_number=0&page_size=100"

    const authToken : string = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoaWV1QWRtaW4iLCJpYXQiOjE3NDA1NTg3NDgsImV4cCI6MTc0MDY2Njc0OH0.9mCa2C3xws49ludPakflOstVs4_QAJ3ON_K1JaFv0SbcEfBRHQGpQQNXtsPtTJr391q2F8BFAEf5ltRVCHiUvA"

    useEffect(() => {
            axios({
                method: "get",
                url: getAllUrl,
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
                .then((response) => {
                    return response.data.data.content
                })
                .then((callResult) => {
                    setCardItems(callResult, props.cardContentType)
                })

    }, [cardList, authToken]);

    function setCardItems(callResult, cardContentType: string){
        switch (cardContentType) {
            case "album":
                setCardList(callResult.map(it => new CardItem(
                    it.uuid,
                    it.title,
                    it.url,
                    it.userDtoOut.uuid,
                    it.userDtoOut.personalDetailDtoOut.name
                )))
                break
            case "artist":
                setCardList(callResult.map(it => new CardItem(
                    it.uuid,
                    it.title,
                    it.url,
                    it.userDtoOut.uuid,
                    it.userDtoOut.personalDetailDtoOut.name
                )))
                break
        }
    }

    return(
        <div style={{padding: "0 20px"}}>
            <h1 style={{paddingBottom: "15px"}} className={"text-3xl font-bold"}>{props.header}</h1>
            <div className={"max-w-full flex overflow-x-auto"}>
                {cardList.map(c => <BigCardVerti
                    key={c.id}
                    itemId={c.id}
                    itemName={c.name}
                    itemCover={c.cover}
                    itemType={props.cardContentType}
                    itemArtistName={c.artistName}></BigCardVerti>
                )}
            </div>
        </div>
    )
}

export default CardListHori;
