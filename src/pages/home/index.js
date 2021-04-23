import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <div className='section blueBackground'>
                <h1>E-Mail Network Visualisations</h1>
                <p>Welcome to our website.<br/>Here you can visualize the network of sent emails in the company <a href='https://en.wikipedia.org/wiki/Enron' target='_blank' rel='noreferrer'>Enron</a>.</p>
                <div className='navigation'>
                    {/* Will  go to visualisation page */}
                    <Link className='link' to='/'>Start visualizing!</Link>
                    {/* Goes to other part of this page */}
                    <a className='link' href='/#info'>More Info</a>
                </div>
            </div>

            <div className='section whiteBackground' id='info'>
                <h1>About us</h1>
                <p>We are a team of enthousiastic students. Below you can read a bit more about each of the team members.</p>

                <div className='cardContainer'>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Anke</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Aloys</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Christine</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                </div>
                <div className='cardContainer'>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Hugo</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Kristopher</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card blueBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Tom</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                </div>
            </div>

            <div className='section blueBackground'>
                <h1>Information about visualisations</h1>
                <p>Here you can get some more information about all the visualisations that are used in this project</p>
                <div className='cardContainer'>
                    <div className='card whiteBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Force Directed Graph</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card whiteBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Hierarchical Edge Bundling</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                </div>
                <div className='cardContainer'>
                    <div className='card whiteBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>Arc Diagram</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                    <div className='card whiteBackground'>
                        <img src='https://via.placeholder.com/250' alt='placeholder' />
                        <h2>3D visualisation</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Cras quis ipsum nec diam cursus imperdiet. 
                            Donec congue efficitur magna nec lobortis.
                            Phasellus tincidunt neque a lacus tempor facilisis. 
                            Integer hendrerit nec est ac aliquam. Curabitur faucibus neque viverra, 
                            feugiat magna id, vulputate tortor. 
                            Sed pharetra odio vel elit sodales cursus.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
