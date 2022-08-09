import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])
 
    const updateChar = () => {
        // const charId = this.props.id;
        const {charId} = props
        if (!charId) {
            return
        }
        onCharLoading();
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    const onCharLoaded = (char) => {
        setChar(char)
        setLoading(false)
    }
    const onCharLoading = () => {
        setLoading(true)
    }
    const onError = () => {
        setLoading(false)
        setError(true)
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
    if (newComics.length === 0) {
        return (
            <li>
                There is no comics with this character
            </li>
        )
    }
    const items = newComics.map((item, i) => {
        return (
            <li key={i} className="char__comics-item">
                {item.name}
            </li>
        )
    })
    return items
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;