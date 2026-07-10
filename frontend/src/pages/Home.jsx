import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiShield, FiZap } from 'react-icons/fi';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';

const services = [
  {
    title: 'Buy Data',
    description: 'Enjoy instant internet bundles for all major networks at competitive prices.',
    icon: 'data',
    accent: 'bg-green-600',
  },
  {
    title: 'Airtime Top-up',
    description: 'Recharge phones quickly and securely with real-time confirmation.',
    icon: 'airtime',
    accent: 'bg-emerald-700',
  },
  {
    title: 'Electricity Bills',
    description: 'Pay power bills in minutes and receive a digital receipt instantly.',
    icon: 'electricity',
    accent: 'bg-green-800',
  },
  {
    title: 'Cable TV',
    description: 'Renew your subscription with flexible packages and smooth support.',
    icon: 'cable',
    accent: 'bg-lime-600',
  },
];

const benefits = [
  'Instant payments with zero delay',
  'Bank-grade security and encrypted transactions',
  'Friendly support available whenever you need help',
];

const testimonials = [
  {
    name: 'Grace M.',
    role: 'Small Business Owner',
    quote: 'The platform is fast, simple and I love how quickly my data and airtime are delivered.',
  },
  {
    name: 'Bola T.',
    role: 'Frequent User',
    quote: 'Everything from electricity to cable TV is handled from one beautiful dashboard.',
  },
  {
    name: 'Kelechi A.',
    role: 'Student',
    quote: 'The mobile-first experience is excellent and the support team is always responsive.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ffffff_100%)] text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-[0.2em] text-green-700">JALAL DATA HUB</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href="#services" className="hover:text-green-700">Services</a>
          <a href="#why-us" className="hover:text-green-700">Why Us</a>
          <a href="#reviews" className="hover:text-green-700">Reviews</a>
        </nav>
        <div className="flex gap-2">
          <Link to="/login" className="rounded-full border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 sm:px-4">Login</Link>
          <Link to="/register" className="rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white sm:px-4">Get Started</Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8 lg:gap-12">
        <section className="grid gap-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-green-600 via-green-500 to-green-800 p-6 text-white shadow-2xl sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium">Modern VTU platform for fast utility payments</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">Power every recharge and bill payment with confidence.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-green-50 sm:text-base">From data bundles to airtime, electricity and cable TV, JALAL DATA HUB gives you a secure and seamless way to stay connected.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-full bg-white px-5 py-3 font-semibold text-green-700">Create Account</Link>
              <Link to="/dashboard" className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white">Explore Dashboard</Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Available balance</p>
                <p className="mt-2 text-3xl font-semibold">₦245,800</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3">
                <FiZap className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3 text-sm">
                <span>Data bundles</span>
                <span className="font-semibold">14 active</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3 text-sm">
                <span>Electricity</span>
                <span className="font-semibold">2 pending</span>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="space-y-5">
          <SectionTitle
            eyebrow="Our services"
            title="Everything you need for utility payments in one place"
            description="Quick transactions, clean flows and dependable delivery for everyday essentials."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section id="why-us" className="grid gap-6 rounded-[32px] border border-green-100 bg-white p-6 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div>
            <SectionTitle
              eyebrow="Why choose us"
              title="A secure, modern experience designed for busy lives"
              description="We combine speed, trust and style so your essential payments never feel stressful."
            />
          </div>
          <div className="space-y-4 rounded-[24px] bg-green-50 p-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <FiCheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <p className="text-sm text-slate-700">{benefit}</p>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-white px-4 py-3 shadow-sm">
              <FiShield className="mt-0.5 h-5 w-5 text-green-600" />
              <p className="text-sm text-slate-700">Built with a clean, responsive interface that works beautifully on every device.</p>
            </div>
          </div>
        </section>

        <section id="reviews" className="space-y-5">
          <SectionTitle
            eyebrow="Customer reviews"
            title="Loved by users who value fast service"
            description="Trusted by customers for simple transactions and dependable support."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-green-100 bg-green-950 px-4 py-8 text-green-50 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">JALAL DATA HUB</p>
            <p className="mt-1 text-sm text-green-100/80">Fast, secure and modern utility payments for everyone.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-100/80">
            <span>© 2026 JALAL DATA HUB</span>
            <span className="hidden sm:inline">•</span>
            <Link to="/login" className="hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
