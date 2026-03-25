import HeroSection from '../components/home/HeroSection'
import FeaturedCategories from '../components/home/FeaturedCategories'
import FeaturedProducts from '../components/home/FeaturedProducts'
import BrandStory from '../components/home/BrandStory'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'

const Home = () => {
  return (
    <div className="bg-primary">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default Home
