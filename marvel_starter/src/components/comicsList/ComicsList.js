import { useState, useEffect } from "react";

import { Link } from "react-router-dom";


import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {   
        initial ? setNewItemLoading(false) : setNewItemLoading(true);   
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }
    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;   
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 8)
        setComicsEnded(comicsEnded => ended)
    }

    const renderItems = (arr) => {
        const items =  arr.map((item, i) => {
            
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    
    const text = <p style={{fontSize: 20, marginTop: 40}}>you unlocked all the characters</p>
    const unlockedAll = comicsEnded ? text : null;
    const button = <button onClick={() => onRequest(offset)} className="button button__main button__long">
                        <div className="inner">load more</div>
                    </button>
    
    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            {unlockedAll || button}           
        </div>
    )
}

export default ComicsList;