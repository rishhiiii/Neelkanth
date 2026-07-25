import { useState, useEffect } from 'react'
import Hero from '../../components/Hero/Hero'
import CompanyIntro from '../../components/CompanyIntro/CompanyIntro'
import Products from '../../components/Products/Products'
import HealthConcerns from '../../components/HealthConcerns/HealthConcerns'
import WhyChoose from '../../components/WhyChoose/WhyChoose'
import Certifications from '../../components/Certifications/Certifications'
import Testimonials from '../../components/Testimonials/Testimonials'
import Offers from '../../components/Offers/Offers'
import LatestBlogs from '../../components/LatestBlogs/LatestBlogs'
import Contact from '../../components/Contact/Contact'
import FloatingButtons from '../../components/FloatingButtons/FloatingButtons'
import * as productsApi from '../../api/products'

function Home() {
  const [featured, setFeatured] = useState([])
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    let mounted = true

    productsApi.getFeatured(8).then((res) => {
      if (mounted && res.data?.data?.length > 0) setFeatured(res.data.data)
    }).catch(() => {})

    productsApi.listProducts({ limit: 50, sort: 'newest' }).then((res) => {
      if (mounted && res.data?.data?.length > 0) setAllProducts(res.data.data)
    }).catch(() => {})

    return () => { mounted = false }
  }, [])

  const gridItems = featured.length > 0 ? featured : allProducts.slice(0, 8)
  const bestSellers = allProducts.slice(0, 10)

  return (
    <>
      <Hero />
      <CompanyIntro />
      <Products
        id="featured"
        sub="Our most trusted formulations for daily wellness"
        title="Featured Products"
        items={gridItems}
      />
      <HealthConcerns />
      <WhyChoose />
       <Products
        id="bestsellers"
        sub="Handpicked for your wellness journey"
        title="Best Sellers"
        items={bestSellers}
        showArrows
      />
      <Certifications />
      <Testimonials />
      <Offers />
     
      <Products
        id="all-products"
        sub="Browse our complete range of Ayurvedic formulations"
        title="All Products"
        items={allProducts}
      />
      <LatestBlogs />
      <Contact />
      <FloatingButtons />
    </>
  )
}

export default Home
