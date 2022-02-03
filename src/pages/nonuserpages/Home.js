import React from 'react';
import {
    Box
} from '@mui/material';

import NavBar from '../../components/navbarcomponent/NavBar'
import HomeComponent from '../../components/linkcomponent/HomeComponent';
import GuideComponent from '../../components/linkcomponent/GuideComponent';
import AboutComponent from '../../components/linkcomponent/AboutComponent';
import NewFooter from '../../components/linkcomponent/NewFooter';

import { Helmet } from 'react-helmet';
import logohelmet from '../../assets/img/png/logoforhelmet.png';

export default function Home() {
    return (
        <Box>
            <Helmet>
                <title>Rendezvous</title>
                <link rel="Rendezous Icon" href={logohelmet} />
            </Helmet>
            <NavBar />
            <HomeComponent />
            <GuideComponent />
            <AboutComponent />
            <NewFooter />
        </Box>
    )
}
