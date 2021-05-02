import PropTypes from 'prop-types';

/* eslint-disable react/react-in-jsx-scope */
const Card = ({ imgSrc, title, text, bgColor, textColor }) => {
    return (
        <div className='card' style={{ backgroundColor: bgColor, color: textColor }}>
            <img src={imgSrc} alt={title}/>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
};

Card.propTypes = {
    imgSrc: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired
};

export default Card;