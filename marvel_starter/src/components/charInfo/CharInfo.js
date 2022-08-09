import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

class CharInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            char: null,
            loading: false,
            error: false,
        }
    }
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar()
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }
 
    updateChar = () => {
        // const charId = this.props.id;
        const {charId} = this.props
        if (!charId) {
            return
        }
        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
        // this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
        });
    }
    onCharLoading = () => {
        this.setState({
            loading: true,
        });
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render() {
        // const {name, description, thumbnail, homepage, wiki} = this.state.char;
        const {char, loading, error} = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        return (
            <div className="char__info">
                {skeleton || errorMessage || spinner || <View char={char}/>}
            </div>
        )
    }
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