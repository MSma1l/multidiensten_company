import Hero from './sections/Hero.jsx'
import QuickStats from './sections/QuickStats.jsx'
import Features from './sections/Features.jsx'
import About from './sections/About.jsx'
import Testimonials from './sections/Testimonials.jsx'
import CTABlock from './sections/CTABlock.jsx'

export default function Home() {
  return (
    <div className="page">
      <Hero />
      <QuickStats />
      <Features />
      <About />
      <Testimonials />
      <CTABlock />
    </div>
  )
}
