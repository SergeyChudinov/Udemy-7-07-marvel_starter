import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import useMarvelService from '../../services/MarvelService';
import setContent from "../../utils/setContent";

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);


    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar()
        // eslint-disable-next-line
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
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}
const View = ({data}) => {
    let {name, description, thumbnail, homepage, wiki, comics} = data;
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
    if (newComics.length === 0) {
        return (
            <li>
                There is no comics with this character
            </li>
        )
    }
    const items = newComics.map((item, i) => {
        const id = item.resourceURI.match(/\d{5,}/g)
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