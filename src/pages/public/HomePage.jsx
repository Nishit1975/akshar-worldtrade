import { Helmet } from 'react-helmet-async'
import Hero from '../../components/sections/Hero'
import ExportMarkets from '../../components/sections/ExportMarkets'
import FeaturedProducts from '../../components/sections/FeaturedProducts'
import GlobalTradeSection from '../../components/sections/GlobalTradeSection'
import ExportWorkflow from '../../components/sections/ExportWorkflow'
import ComplianceSection from '../../components/sections/ComplianceSection'
import HomeFAQ from '../../components/sections/HomeFAQ'
import BuyerCTA from '../../components/sections/BuyerCTA'
import { getCanonicalUrl } from '../../config/company'

const HomePage = () => {
  const canonicalUrl = getCanonicalUrl('/')

  return (
    <>
      <Helmet>
        <title>Akshar Worldtrade | Indian Exporter &amp; Global Trade Supplier</title>
        <meta
          name="description"
          content="Akshar Worldtrade is a trusted Indian exporter supplying quality agricultural commodities, spices, grains, and pulses to international buyers, importers, and distributors worldwide."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="Akshar Worldtrade | Indian Exporter &amp; Global Trade Supplier" />
        <meta
          property="og:description"
          content="Akshar Worldtrade connects international buyers with quality Indian agricultural commodities, spices, grains, and pulses with reliable export documentation."
        />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Akshar Worldtrade | Indian Exporter &amp; Global Trade Supplier" />
        <meta
          name="twitter:description"
          content="Akshar Worldtrade connects international buyers with quality Indian agricultural commodities, spices, grains, and pulses with reliable export documentation."
        />
      </Helmet>

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Dedicated Export Markets Corridor */}
      <ExportMarkets />

      {/* 3. Product Categories Showcase */}
      <FeaturedProducts />

      {/* 4. Export Capabilities */}
      <GlobalTradeSection />

      {/* 5. Step-Based Export Workflow */}
      <ExportWorkflow />

      {/* 6. Regulatory Compliance & Documentation Standards */}
      <ComplianceSection />

      {/* 7. Frequently Asked Questions Accordion */}
      <HomeFAQ />

      {/* 8. High-Conversion Final B2B Buyer CTA */}
      <BuyerCTA />
    </>
  )
}

export default HomePage

