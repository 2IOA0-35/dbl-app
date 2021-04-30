import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Card from './components/Card';
import PageHeader from './components/PageHeader';

export default function Home() {
    return (
        <>
            <div className='section blueBackground'>
                <h1>E-Mail Network Visualisations</h1>
                <p>Welcome to our website.<br />Here you can visualize the network of sent emails in the company <a href='https://en.wikipedia.org/wiki/Enron' target='_blank' rel='noreferrer'>Enron</a>.</p>
                <div className='navigation'>
                    {/* Will  go to visualisation page */}
                    <Link className='link' to='/'>Start visualizing!</Link>
                    {/* Goes to other part of this page */}
                    <a className='link' href='/#info'>More Info</a>
                </div>
            </div>

            <div className='section whiteBackground' id='info'>

                <PageHeader
                    title='About Us'
                    intro='We are a team of enthousiastic students. Below you can read a bit more about each of the team members.'
                />

                <div className='cardContainer'>

                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Anke'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Aloys'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Christine'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />
                </div>
                <div className='cardContainer'>
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Hugo'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />

                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Kristopher'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />

                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Tom'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        bgColor='#001f3f'
                        textColor='white'
                    />
                </div>
            </div>

            <div className='section blueBackground'>
                <PageHeader
                    title='Information about visualisations'
                    intro='Here you can get some more information about all the visualisations that are used in this project'
                />
                <div className='cardContainer'>
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Force Directed Graph'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        textColor='#001f3f'
                        bgColor='white'
                    />
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Hierarchical Edge Building'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        textColor='#001f3f'
                        bgColor='white'
                    />
                </div>
                <div className='cardContainer'>
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='Arc Diagram'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        textColor='#001f3f'
                        bgColor='white'
                    />
                    <Card
                        imgSrc='https://via.placeholder.com/250'
                        title='3D Visualisation'
                        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Cras quis ipsum nec diam cursus imperdiet. 
                        Donec congue efficitur magna nec lobortis.
                        Phasellus tincidunt neque a lacus tempor facilisis. 
                        Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                        feugiat magna id, vulputate tortor. 
                        Sed pharetra odio vel elit sodales cursus.'
                        textColor='#001f3f'
                        bgColor='white'
                    />
                </div>
            </div>
        </>
    );
}