import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { currencies } from '../utils/currencies';
import { motion } from 'framer-motion';
import { healthMilestones, calculateProgress } from '../utils/statistics';
import moment from 'moment';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    cigarettesPerDay: '',
    cigarettesPerPack: '',
    pricePerPack: '',
    currency: 'USD',
    quitDate: '',
    notifications: true,
    reminderTime: '09:00',
    yearsSmoking: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          navigate('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData({
            email: auth.currentUser.email,
            cigarettesPerDay: data.cigarettesPerDay || '',
            cigarettesPerPack: data.cigarettesPerPack || '',
            pricePerPack: data.pricePerPack || '',
            currency: data.currency || 'USD',
            quitDate: data.quitDate ? data.quitDate.split('T')[0] : '',
            notifications: data.notifications !== false,
            reminderTime: data.reminderTime || '09:00',
            yearsSmoking: data.yearsSmoking || '',
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your profile data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userId = auth.currentUser.uid;
      
      // Update email if changed
      if (formData.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      // Update user data in Firestore
      await updateDoc(doc(db, 'users', userId), {
        cigarettesPerDay: Number(formData.cigarettesPerDay),
        cigarettesPerPack: Number(formData.cigarettesPerPack),
        pricePerPack: Number(formData.pricePerPack),
        quitDate: formData.quitDate,
        notifications: formData.notifications,
        reminderTime: formData.reminderTime,
        yearsSmoking: Number(formData.yearsSmoking),
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Password updated successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setError(
        error.code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : 'Failed to update password. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setSaving(true);

    try {
      const user = auth.currentUser;
      
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete user account
      await deleteUser(user);

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error.message || 'Failed to delete account. Please check your password and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Lifetime Impact Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Smoking History Impact</h2>
          
          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lifetime Statistics */}
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Lifetime Impact</h3>
                  <ul className="space-y-2 text-red-700">
                    <li className="flex justify-between">
                      <span>Total Cigarettes Smoked:</span>
                      <span className="font-semibold">
                        {(userData.cigarettesPerDay * moment(userData.quitDate).diff(moment().subtract(userData.yearsSmoking, 'years'), 'days')).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Money Spent on Smoking:</span>
                      <span className="font-semibold">
                        {currencies.find(c => c.id === userData.currency)?.symbol}
                        {((userData.cigarettesPerDay / userData.cigarettesPerPack) * userData.pricePerPack * moment(userData.quitDate).diff(moment().subtract(userData.yearsSmoking, 'years'), 'days')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Days as Smoker:</span>
                      <span className="font-semibold">
                        {moment(userData.quitDate).diff(moment().subtract(userData.yearsSmoking, 'years'), 'days').toLocaleString()} days
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recovery Progress */}
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Recovery Progress</h3>
                  <div className="space-y-2 text-green-700">
                    <p className="mb-4">
                      It's never too late to quit! Your body has an amazing ability to heal itself.
                    </p>
                    {calculateProgress(userData.quitDate, userData.cigarettesPerDay, userData.pricePerPack).nextMilestone && (
                      <div>
                        <p className="font-semibold">Next Health Milestone:</p>
                        <p>{calculateProgress(userData.quitDate, userData.cigarettesPerDay, userData.pricePerPack).nextMilestone.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Profile Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cigarettes per Day
                </label>
                <input
                  type="number"
                  name="cigarettesPerDay"
                  value={formData.cigarettesPerDay}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cigarettes per Pack
                </label>
                <input
                  type="number"
                  name="cigarettesPerPack"
                  value={formData.cigarettesPerPack}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Years of Smoking
                </label>
                <input
                  type="number"
                  name="yearsSmoking"
                  value={formData.yearsSmoking}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price per Pack
                </label>
                <input
                  type="number"
                  name="pricePerPack"
                  value={formData.pricePerPack}
                  onChange={handleInputChange}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <div className="mt-1 block w-full p-2 bg-gray-100 rounded-md border border-gray-300 text-gray-700">
                  {currencies.find(c => c.id === formData.currency)?.name || 'USD'} 
                  ({currencies.find(c => c.id === formData.currency)?.symbol || '$'})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quit Date
                </label>
                <input
                  type="date"
                  name="quitDate"
                  value={formData.quitDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Daily Reminders
              </label>
            </div>

            {formData.notifications && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reminder Time
                </label>
                <input
                  type="time"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-600 hover:text-blue-800"
              >
                Change Password
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {showPasswordForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePasswordUpdate}
              className="mt-8 pt-8 border-t border-gray-200 space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Change Password
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </motion.form>
          )}

          {/* Delete Account Section */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
            <p className="mt-1 text-sm text-gray-500">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Are you sure you want to delete your account?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <form onSubmit={handleDeleteAccount}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please enter your password to confirm
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  {deleteError && (
                    <p className="text-sm text-red-600 mb-4">{deleteError}</p>
                  )}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                        setDeleteError('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {saving ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
