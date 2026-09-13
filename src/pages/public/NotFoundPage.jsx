import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Container from '../../components/ui/Container'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Akshar Worldtrade</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="The page you are looking for does not exist or has been moved. Explore Akshar Worldtrade export products and trade services."
        />
      </Helmet>

      <section className="bg-white min-h-[50vh] flex items-center py-12 lg:py-16">
        <Container size="sm">
          <div className="text-center space-y-4 sm:space-y-5">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
              Error 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy-800 tracking-tight">
              Page Not Found
            </h1>
            <div className="h-0.5 w-12 bg-gold-500 rounded-full mx-auto" aria-hidden="true" />
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:py-3 bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold rounded transition-colors min-h-[44px]"
              >
                Return to Home
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:py-3 border border-navy-200 text-navy-600 hover:bg-navy-50 text-sm font-semibold rounded transition-colors min-h-[44px]"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:py-3 border border-transparent text-gray-600 hover:text-navy-700 text-sm font-medium transition-colors min-h-[44px]"
              >
                Contact Trade Desk
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default NotFoundPage
