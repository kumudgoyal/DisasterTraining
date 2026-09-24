"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Users, Map as MapIcon, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-700" />
            <span className="text-xl font-bold text-slate-900">DTM System</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-700 transition-colors">Features</Link>
            <Link href="#stats" className="hover:text-blue-700 transition-colors">Impact</Link>
            <Link href="#how-it-works" className="hover:text-blue-700 transition-colors">How it Works</Link>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                  Officer Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0f172a] text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center"></div>
          <div className="container relative mx-auto px-4 md:px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              National Platform for Disaster Management
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl">
              Real-Time Monitoring for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Disaster Trainings</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
              A comprehensive system to track, evaluate, and optimize capacity building initiatives for disaster response forces nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-lg h-12 px-8">
                    Enter Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-lg h-12 px-8">
                    Authorized Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="w-full py-12 bg-blue-700 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">5,000+</h3>
                <p className="text-blue-100 font-medium">Trained Personnel</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">120+</h3>
                <p className="text-blue-100 font-medium">Districts Covered</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">450+</h3>
                <p className="text-blue-100 font-medium">Mock Drills</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold">98%</h3>
                <p className="text-blue-100 font-medium">Operational Readiness</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Comprehensive Capabilities</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Equipping authorities with advanced tools to ensure standardized and effective disaster response training.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Activity className="h-8 w-8 text-blue-600" />, title: "Live Tracking", desc: "Monitor ongoing training sessions across multiple locations in real-time." },
                { icon: <MapIcon className="h-8 w-8 text-teal-600" />, title: "GIS Mapping", desc: "Geospatial visualization of training coverage and vulnerable zones." },
                { icon: <Users className="h-8 w-8 text-purple-600" />, title: "Resource Management", desc: "Allocate instructors and equipment efficiently based on predictive needs." },
                { icon: <BarChart3 className="h-8 w-8 text-rose-600" />, title: "Impact Analytics", desc: "Data-driven insights into training effectiveness and skill improvements." },
                { icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />, title: "Automated Compliance", desc: "Ensure all programs meet national disaster management standards." },
                { icon: <Shield className="h-8 w-8 text-slate-700" />, title: "Secure Data", desc: "Enterprise-grade security for sensitive personnel and operational data." }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="mb-4 inline-block p-3 bg-white rounded-lg shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-20 bg-slate-50 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                A streamlined workflow for end-to-end training management.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Plan & Schedule", desc: "Define curriculum and schedule sessions for different forces." },
                { step: "02", title: "Enroll Participants", desc: "Register personnel via bulk upload or API integrations." },
                { step: "03", title: "Execute & Monitor", desc: "Conduct training while tracking attendance and progress live." },
                { step: "04", title: "Assess & Report", desc: "Evaluate impact through automated assessments and reports." }
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                  {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-blue-100"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0a0f1d] py-12 text-slate-400">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">DTM System</span>
              </div>
              <p className="max-w-sm">
                National Platform for Disaster Management Training Monitoring. Ensuring preparedness through data-driven capacity building.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@dtm.gov.in</li>
                <li>1800-XXX-XXXX</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Disaster Training Monitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
