import React from "react";
import Header from "./header";
import HomeCarousel from "./HomeCarousel";
import LoginTypeSelection from "./LoginTypeSelection";
import Footer from "./Footer";

const HomePage = () => {
    return(
        <div>
        <Header/>
        <HomeCarousel/>
        <LoginTypeSelection/>
        <Footer/>
        </div>
    );
}

export default HomePage;