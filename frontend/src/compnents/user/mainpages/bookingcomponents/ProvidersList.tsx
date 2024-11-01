import { ProvidersListProps,ProductsListProps } from "./type";

  
export const ProvidersList: React.FC<ProvidersListProps> = ({
    providers,
    selectedProvider,
    onProviderSelect,
  }) => (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Available Gas Providers:
      </h2>
      <ul className="space-y-4">
        {providers.map((provider) => (
          <li key={provider._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-150 ease-in-out">
            <label className="flex items-start cursor-pointer">
              <input
                type="radio"
                name="provider"
                value={provider._id}
                checked={selectedProvider?._id === provider._id}
                onChange={() => onProviderSelect(provider)}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div className="ml-3">
                <p className="text-lg font-medium text-gray-900">{provider.agentname}</p>
                <p className="text-sm text-gray-500">Pincode: {provider.pincode}</p>
                {provider.email && <p className="text-sm text-gray-500">Email: {provider.email}</p>}
                {provider.mobile && <p className="text-sm text-gray-500">Mobile: {provider.mobile}</p>}
                <ProductsList products={provider.products} />
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
  
  
  export const ProductsList: React.FC<ProductsListProps> = ({ products }) => (
    products.length > 0 && (
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-700">Products available:</p>
        <ul className="mt-1 space-y-1">
          {products
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <li key={product._id} className="text-sm text-gray-600">
                {product.companyname} - ₹{product.price} ({product.weight}kg) Quantity - {product.quantity}
              </li>
            ))}
        </ul>
      </div>
    )
  );
  
  