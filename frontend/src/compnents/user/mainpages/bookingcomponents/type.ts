import { CardElement } from "@stripe/react-stripe-js";

export interface GasProvider {
    _id: string;
    agentname: string;
    pincode: string;
    email?: string;
    mobile?: string;
    products: GasProduct[];
  }
  
  export interface GasProduct {
    _id: string;
    companyname: string;
    weight: number;
    price: number;
    quantity: number;
  }
  
  export interface CustomerDetails {
    name: string;
    consumerId: string;
    mobile: string;
    address: string;
  }

//   providelist
export interface ProvidersListProps {
    providers: GasProvider[];
    selectedProvider: GasProvider | null;
    onProviderSelect: (provider: GasProvider) => void;
  }

//   pincodeinpute
export interface PincodeInputProps {
    pincode: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

//   ptoductlist
export interface ProductsListProps {
    products: GasProduct[];
  }

//   paymentmodal
export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: any;
    onProcessPayment: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    selectedGas: GasProduct | null;
  }

//   success modal
export interface SuccessMessageProps {
    isOpen: boolean;
    onClose: () => void;
  }

//   Booking modal
export interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerDetails: CustomerDetails;
    onCustomerDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedProvider: GasProvider;
    selectedGas: GasProduct | null;
    onGasSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    paymentMethod: "UPI" | "cod";
    onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBookingConfirm: () => void;
    isLoadingAddress: boolean;
  }

//   Customerdetails
export interface CustomerDetailsFormProps {
    customerDetails: CustomerDetails;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoadingAddress: boolean;
  }

//   BookingDetails
export interface BookingDetailsProps {
    bookingData: {
      selectedProviderId: string;
      customerDetails: CustomerDetails;
      selectedGas: {
        companyname: string;
        weight: number;
        price: number;
      };
    };
  }

//   Gasselector
export interface GasSelectorProps {
    selectedGas: GasProduct | null;
    products: GasProduct[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }

//   paymentselector
export interface PaymentMethodSelectorProps {
    paymentMethod: "UPI" | "cod";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }