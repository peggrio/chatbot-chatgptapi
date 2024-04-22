import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <p>Hello this is Home page</p>
            <div>Let's try chatbot
                <button>
                    <Link to="/chatbot">chatbot</Link>
                </button>
            </div>
            <div>Let's try rash generator
                <button>
                    <Link to="/rash_generator">Rash_generator</Link>
                </button>
            </div>

        </div>
    );
};

export default Home;