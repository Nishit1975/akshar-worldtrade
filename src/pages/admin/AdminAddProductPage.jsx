import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'

const AdminAddProductPage = () => {
  return (
    <>
      <Helmet>
        <title>Add Product | Admin Portal | Akshar Worldtrade</title>
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-1" aria-label="Breadcrumb">
              <Link to="/admin/products" className="hover:text-navy-600 transition-colors">
                Products
              </Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">New</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800">
              Add New Product
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Enter product specifications, upload high-resolution media, and publish to the global catalog.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-navy-700 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-2xs transition-colors self-start"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* Form Container */}
        <ProductForm isEdit={false} />
      </div>
    </>
  )
}

export default AdminAddProductPage
