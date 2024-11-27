import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { currencies } from '../utils/currencies';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cigarettesPerDay: '',
    cigarettesPerPack: '',
    pricePerPack: '',
    currency: currencies[0].id, // Default to first currency in the list
    yearsSmoking: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate numeric fields
      const cigarettesPerDay = parseFloat(formData.cigarettesPerDay);
      const cigarettesPerPack = parseFloat(formData.cigarettesPerPack);
      const pricePerPack = parseFloat(formData.pricePerPack);
      const yearsSmoking = parseFloat(formData.yearsSmoking);

      if (isNaN(cigarettesPerDay) || isNaN(cigarettesPerPack) || isNaN(pricePerPack) || isNaN(yearsSmoking)) {
        throw new Error('Please enter valid numbers for all fields');
      }

      // Validate currency
      const selectedCurrency = currencies.find(c => c.id === formData.currency);
      if (!selectedCurrency) {
        throw new Error('Please select a valid currency');
      }

      const userId = auth.currentUser.uid;
      const quitDate = new Date().toISOString();
      
      await setDoc(doc(db, 'users', userId), {
        cigarettesPerDay: cigarettesPerDay,
        cigarettesPerPack: cigarettesPerPack,
        pricePerPack: pricePerPack,
        yearsSmoking: yearsSmoking,
        currency: selectedCurrency.id, // Ensure we're using the correct case
        quitDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to save your information. Please try again.');
      console.error('Onboarding error:', error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric input
    if (['cigarettesPerDay', 'cigarettesPerPack', 'pricePerPack', 'yearsSmoking'].includes(name)) {
      // Only allow positive numbers with up to 2 decimal places
      if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Let's get started
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about your smoking habits to help us personalize your journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="cigarettesPerDay" className="block text-sm font-medium text-gray-700">
                    How many cigarettes do you smoke per day?
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="cigarettesPerDay"
                      id="cigarettesPerDay"
                      required
                      min="1"
                      value={formData.cigarettesPerDay}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cigarettesPerPack" className="block text-sm font-medium text-gray-700">
                    How many cigarettes are in one pack?
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="cigarettesPerPack"
                      id="cigarettesPerPack"
                      required
                      min="1"
                      value={formData.cigarettesPerPack}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Select your currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Note: Currency cannot be changed after onboarding
                  </p>
                </div>

                <div>
                  <label htmlFor="pricePerPack" className="block text-sm font-medium text-gray-700">
                    How much does one pack cost?
                  </label>
                  <div className="mt-1">
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">
                          {currencies.find(c => c.id === formData.currency)?.symbol}
                        </span>
                      </div>
                      <input
                        type="number"
                        name="pricePerPack"
                        id="pricePerPack"
                        required
                        min="0"
                        step="0.01"
                        value={formData.pricePerPack}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div>
                <label htmlFor="yearsSmoking" className="block text-sm font-medium text-gray-700">
                  How many years have you been smoking?
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="yearsSmoking"
                    id="yearsSmoking"
                    required
                    min="0"
                    step="0.5"
                    value={formData.yearsSmoking}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? 'Saving...' : 'Start Your Journey'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Step {step} of 3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
