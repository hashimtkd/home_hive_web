import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ContactUs() {
  return (
    <div className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
        <p className="mt-4 text-lg leading-6 text-gray-500">
          Have a question or want to work together? We'd love to hear from you.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-xl">
        <form className="grid grid-cols-1 gap-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1">
              <Input type="text" id="name" placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <Input type="email" id="email" placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <div className="mt-1">
              <textarea
                id="message"
                rows={4}
                className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-black focus:ring-black"
                placeholder="How can we help?"
              />
            </div>
          </div>
          <div>
            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
