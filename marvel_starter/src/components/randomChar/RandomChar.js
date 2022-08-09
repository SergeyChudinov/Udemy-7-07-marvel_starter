import { Component } from 'react/cjs/react.production.min';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false,
    }
    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0;
        this.updateChar()
        // this.timeId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        // clearInterval(this.timeId);
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

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011401 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        let {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        return (
            <div className="randomchar">
                {errorMessage || spinner || <View char={char}/>}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div onClick={this.updateChar} className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

}
const View = ({char}) => {
    let {name, description, thumbnail, homepage, wiki} = char;
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

    // <img {notAvalable ? style={{objectFit: 'contain'} : style={{objectFit: 'cover'}}/>}
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