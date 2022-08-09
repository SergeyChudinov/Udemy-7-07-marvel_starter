import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


// import abyss from '../../resources/img/abyss.jpg';

const CharList = (props) => {


    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    let [newItemLoading, setNewItemLoading] = useState(false);
    const [error, setError] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest()
    }, [])
    
    const onRequest = () => {
        onCharListLoading()
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;   
        }
        setCharList(charList => [...charList, ...newCharList])
        setLoading(loading => false)
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }
    const onError = () => {
        setLoading(loading => false)
        setNewItemLoading(newItemLoading => false)
        setError(true)
    }
    const onCharSelected = (id) => {
        props.onCharSelected(id);
    }

    const itemRefs = useRef([]);
    // const setRef = (ref) => {
    //     itemRefs.push(ref);
    // }
    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderItems = (arr) => {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className='char__item'
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                    onCharSelected(item.id);
                    focusOnItem(i);
                    }} 
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const text = <p style={{fontSize: 20, marginTop: 40}}>you unlocked all the characters</p>
    const unlockedAll = charEnded ? text : null;
    if (loading) {
        newItemLoading = !newItemLoading;
    }
    const newSpinner = newItemLoading ? <Spinner/> : null;
    const button = <button onClick={onRequest} className="button button__main button__long">
                        <div className="inner">load more</div>
                    </button>
    return (
        <div className="char__list">
            {errorMessage || spinner || items}
            {newSpinner}
            {unlockedAll || button}
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;




