import React from "react";
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div>
            hello this is Home page, let's try chatbot

            <button>
                <Link to="/chatbot">chatbot</Link>
            </button>

        </div>
    )
}

export default Home