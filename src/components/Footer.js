import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
              &copy; {new Date().getFullYear()} Quitter. All rights reserved.
              <span className="ml-2">Made with ❤️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
