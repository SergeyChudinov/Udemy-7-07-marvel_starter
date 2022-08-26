import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Transition } from 'react-transition-group';
import './charList.scss';

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

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    let [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [showCharList, setShowCharList] = useState(false);
    let {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
        // eslint-disable-next-line
    }, [])
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);       
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;   
        }
        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset + 9)
        setCharEnded(ended)
        setShowCharList(showCharList => true)
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
        const duration = 1000;
        const defaultStyle = {
            transition: `all ${duration}ms ease-in-out`,  //opacity visibility
            opacity: 0,
            visibility: 'hidden',
        }
        const transitionStyles = {
            entering: { opacity: 1, visibility: 'visible'  },
            entered:  { opacity: 1, visibility: 'visible'  },
            exiting:  { opacity: 0, visibility: 'hidden' },
            exited:  { opacity: 0, visibility: 'hidden' },
        };
        

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
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                    }} 
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>                
            )
        });
        return (
            <Transition timeout={duration} in={showCharList}>   
                {state => (
                    <ul className="char__grid" style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                        {items}
                    </ul>
                )}
            </Transition>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading);
        // eslint-disable-next-line
    }, [process])

    const text = <p style={{fontSize: 20, marginTop: 40}}>you unlocked all the characters</p>
    const unlockedAll = charEnded ? text : null;
    const button = <button disabled={newItemLoading} onClick={() => onRequest(offset)} className="button button__main button__long">
                       <div className="inner">load more</div>
                   </button>
    return (
        <div className="char__list">
            {elements}
            {unlockedAll || button}
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;




