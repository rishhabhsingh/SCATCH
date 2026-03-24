import HeroSection from '../components/home/HeroSection'
import FeaturedCategories from '../components/home/FeaturedCategories'
import FeaturedProducts from '../components/home/FeaturedProducts'

const Home = () => {
  return (
    <div className="bg-primary">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  )
}

export default Home