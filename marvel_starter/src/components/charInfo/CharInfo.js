import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);


    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])
 
    const updateChar = () => {
        // const charId = this.props.id;
        const {charId} = props
        if (!charId) {
            return
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        return (
            <div className="char__info">
                {skeleton || errorMessage || spinner || <View char={char}/>}
            </div>
        )
}
const View = ({char}) => {
    let {name, description, thumbnail, homepage, wiki, comics} = char;
    let style = {objectFit: 'cover'}
    if (/image_not_available.jpg/i.test(thumbnail)) {
        style= {objectFit: 'unset'}
    }
    if (description === '') {
        description = 'No character data'
    }
    return (
        <>
            <div className="char__basics">
                <img style={style} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                <Comics comics={comics}/>
            </ul>
        </>
    )
}
const Comics = ({comics}) => {
    const newComics = comics.slice(0, 10);
    console.log(newComics.length)
    console.log(newComics)
    if (newComics.length === 0) {
        return (
            <li>
                There is no comics with this character
            </li>
        )
    }
    const items = newComics.map((item, i) => {
        const id = item.resourceURI.match(/\d{5,}/g)
        console.log(id)
        return (
            <Link to={`/comics/${id}`} key={i} className="char__comics-item">
                {item.name}
            </Link>
        )
    })
    return items
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
