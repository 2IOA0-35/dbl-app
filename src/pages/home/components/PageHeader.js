import PropTypes from 'prop-types';

/* eslint-disable react/react-in-jsx-scope */
const PageHeader = ( { title, intro } ) => {
    return (
        <div>
            <h1>{title}</h1>
            <p className='pageInfo'>{intro}</p>
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired
};

export default PageHeader;