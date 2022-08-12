import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    let [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    let {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(true)
    }, [])

    const onRequest = (initial) => {   
        initial ? setNewItemLoading(false) : setNewItemLoading(true);   
        getAllComics(offset)
            .then(onComicsListLoaded)
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
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const text = <p style={{fontSize: 20, marginTop: 40}}>you unlocked all the characters</p>
    const unlockedAll = comicsEnded ? text : null;
    if (loading) {
        newItemLoading = !newItemLoading;
    }
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const newSpinner = newItemLoading ? <Spinner/> : null;
    const button = <button onClick={onRequest} className="button button__main button__long">
                        <div className="inner">load more</div>
                    </button>
    
    return (
        <div className="comics__list">

            {errorMessage || spinner || items}
            {newSpinner}
            {unlockedAll || button}

            
        </div>
    )
}

export default ComicsList;