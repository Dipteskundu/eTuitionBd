import Hero from '../components/Home/Hero';
import LatestTuitions from '../components/Home/LatestTuitions';
import LatestTutors from '../components/Home/LatestTutors';
import HowItWorks from '../components/Home/HowItWorks';
import WhyChooseUs from '../components/Home/WhyChooseUs';

const Home = () => {
    return (
        <div>
            <Hero />
            <LatestTuitions />
            <LatestTutors />
            <HowItWorks />
            <WhyChooseUs />
        </div>
    );
};

export default Home;
