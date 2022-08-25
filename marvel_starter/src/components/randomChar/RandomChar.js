import { useState, useEffect } from "react";

import useMarvelService from '../../services/MarvelService';

import mjolnir from '../../resources/img/mjolnir.png';
import setContent from "../../utils/setContent";

import './randomChar.scss';

const RandomChar = () => {
    let [char, setChar] = useState({});

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // const timerId = setInterval(updateChar, 6000);
        // return () => {
        //     clearInterval(timerId);
        // }
        // eslint-disable-next-line
    }, [])

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011401 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main">
                    <div onClick={updateChar} className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )

}
const View = ({data}) => {
    let {name, description, thumbnail, homepage, wiki} = data;
    let style = {objectFit: 'cover'}
    if (/image_not_available.jpg/i.test(thumbnail)) {
        style= {objectFit: 'contain'}
    }
    if (description === '') {
        description = 'No character data'
    }
    if (description !== undefined) {
        const array = description.split('');
        if (array.length > 150) {
            let num = array.length - 150;
            array.splice(150, num);
            array.push('...')
        };
        description = array.join('');
    }

    return (
        <div className="randomchar__block">
            <img style={style}
                src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}


export default RandomChar;