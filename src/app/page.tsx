import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Heart, MessageCircle, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full bg-white overflow-y-auto overflow-x-hidden">
      <Navbar />

      <main>
        {/* --- HERO SECTION --- */}
        <section className="bg-green-600 pt-32 pb-24 px-6 rounded-b-[3rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-700/50 border border-green-500/50 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Now live for VSU Students & Baybay Locals
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              Go <span className="text-green-200">Matcha Roommate</span> now.
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-12">
              The safest way to find boarding houses and compatible roommates near Visayas State University. Verified profiles, habit matching, and direct chat.
            </p>

            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 justify-center">
              
              <Link href="/register?redirect=/rooms/create" className="group block h-full">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-transparent hover:border-green-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-center text-left h-full">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Need a Roommate?
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-600">
                    List your property & find the perfect match
                  </p>
                  <div className="flex items-center gap-1 mt-6 text-green-600 font-bold text-base bg-green-50 px-4 py-2 rounded-full group-hover:bg-green-100 transition-colors">
                    List your Room <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link href="/register?redirect=/profiles/create" className="group block h-full">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-transparent hover:border-green-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-center text-left h-full">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Looking for a Place?
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-600">
                    Browse listings & connect with roommates
                  </p>
                  <div className="flex items-center gap-1 mt-6 text-green-600 font-bold text-base bg-green-50 px-4 py-2 rounded-full group-hover:bg-green-100 transition-colors">
                    Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How MatchaRoommate Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We made it simple to find a place that feels like home, with people you actually like.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-green-600 text-white text-xl font-bold rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    1
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                     <Search className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tell us about your habits—are you a night owl? Do you smoke? Do you have pets? We use this to find your best match.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-green-600 text-white text-xl font-bold rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    2
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                     <Heart className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Browse & Match</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore listings for rooms or find people looking for roommates. Filter by budget, location, and compatibility score.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-green-600 text-white text-xl font-bold rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    3
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                     <MessageCircle className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Safely</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chat directly within the app without sharing your personal number until you're ready. Arrange a meetup and move in!
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- ABOUT US / WHY US SECTION --- */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed text-balance">
                Finding the right place shouldn't be a struggle. We built <span className="font-bold text-green-700">MatchaRoommate</span> to relieve the burden of finding a roommate that truly matches your vibe.
                <br /><br />
                Our goal is to help you find a place to live safely and comfortably, because your living environment matters.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureItem 
                icon={ShieldCheck} 
                title="Verified Users" 
                desc="We strictly check contact numbers to ensure every user is a real person."
              />
              <FeatureItem 
                icon={Search} 
                title="Smart Filters" 
                desc="Easily filter by budget, location (Gabas, Pangasugan), and amenities."
              />
              <FeatureItem 
                icon={MessageCircle} 
                title="Privacy First" 
                desc="Chat safely within the app. Your contact info stays hidden until you share it."
              />
            </div>

          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}