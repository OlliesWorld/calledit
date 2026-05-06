import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="bg-stone-50 selection:bg-orange-200 selection:text-orange-900">
        {/* Header Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm text-orange-600 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MessageSquare className="w-4 h-4" />
            <span>We&apos;re here to help</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Get in Touch
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Have questions about our Team & Mentor plan? We&apos;d love to hear from you and help you find the perfect solution for your organization.
          </p>
        </section>

        {/* Contact Options */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Email Contact */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3">Email Us</h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Send us an email and we&apos;ll get back to you within 24 hours.
              </p>
              <a
                href="mailto:sales@example.com"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                sales@example.com
                <span className="text-xl">→</span>
              </a>
            </div>

            {/* Schedule a Call */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3">Schedule a Call</h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Book a 30-minute call to discuss your team&apos;s needs and goals.
              </p>
              <a
                href="https://calendly.com/your-link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Book a time
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200">
            <h2 className="text-3xl font-bold text-stone-900 mb-2 text-center">Send us a Message</h2>
            <p className="text-stone-600 mb-8 text-center">
              Fill out the form below and we&apos;ll be in touch soon.
            </p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-stone-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-stone-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-stone-900 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
                  placeholder="Company or School Name"
                />
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-medium text-stone-900 mb-2">
                  Team Size
                </label>
                <select
                  id="teamSize"
                  name="teamSize"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
                >
                  <option value="">Select team size</option>
                  <option value="5-10">5-10 people</option>
                  <option value="11-25">11-25 people</option>
                  <option value="26-50">26-50 people</option>
                  <option value="51-100">51-100 people</option>
                  <option value="100+">100+ people</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all resize-none"
                  placeholder="Tell us about your needs and goals..."
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              >
                Send Message
              </Button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-stone-900 mb-4">Common Questions</h2>
              <p className="text-stone-600">Quick answers to questions you may have.</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "What's included in the Team & Mentor plan?",
                  a: "The Team plan includes 5 Pro accounts, an admin dashboard, progress tracking, custom learning paths, and a dedicated success manager to ensure your team's success."
                },
                {
                  q: "Can we customize the curriculum?",
                  a: "Absolutely! We work with you to create custom learning paths that align with your team's goals and skill levels."
                },
                {
                  q: "Do you offer training for instructors?",
                  a: "Yes, we provide comprehensive onboarding and ongoing support for instructors and team leads."
                },
                {
                  q: "What payment options are available?",
                  a: "We offer monthly billing, annual billing with a discount, and invoice billing for teams. Contact us to discuss the best option for your organization."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-stone-50 rounded-2xl p-6">
                  <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-500" />
                    {faq.q}
                  </h3>
                  <p className="text-stone-600 leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
              Not ready to reach out yet?
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10">
              Check out our pricing page to see all available plans and features.
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-2xl bg-white text-stone-900 border border-stone-200 hover:bg-stone-100 hover:scale-105 transition-all duration-300 shadow-sm">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>
    </div>
  )
}
