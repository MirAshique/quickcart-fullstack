const Footer = () => {
  return (
    <footer className="mt-28 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              QuickCart
            </h2>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern SaaS-style eCommerce platform designed for secure
              transactions, seamless checkout, and powerful business analytics.
            </p>
          </div>

          {/* Customer Assurance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white mb-4">
              Customer Assurance
            </h3>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>✔ Secure payments powered by Stripe</li>
              <li>✔ Encrypted authentication & OTP verification</li>
              <li>✔ Real-time order tracking</li>
              <li>✔ 24/7 customer support ready</li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white mb-4">
              Platform
            </h3>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>Scalable architecture</li>
              <li>Admin analytics dashboard</li>
              <li>Role-based access control</li>
              <li>Cloud-ready deployment</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200 dark:border-gray-800"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">

          <p>
            © {new Date().getFullYear()} QuickCart. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
