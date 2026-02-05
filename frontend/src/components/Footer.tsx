import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">TaskFlow</h3>
            <p className="text-sm text-slate-600">
              Simplify your tasks, enhance your productivity. Your all-in-one solution for effective task management.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
              <li><Link href="/integrations" className="text-sm text-slate-600 hover:text-slate-900">Integrations</Link></li>
              <li><Link href="/roadmap" className="text-sm text-slate-600 hover:text-slate-900">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900">Documentation</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900">Blog</Link></li>
              <li><Link href="/tutorials" className="text-sm text-slate-600 hover:text-slate-900">Tutorials</Link></li>
              <li><Link href="/support" className="text-sm text-slate-600 hover:text-slate-900">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-600 hover:text-slate-900">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-slate-400 hover:text-slate-500">
              Terms
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-500">
              Privacy
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-500">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}