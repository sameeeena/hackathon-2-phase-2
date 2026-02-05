'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSession } from '@/lib/auth-client';

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100"></div>
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-full mb-8 tracking-wide shadow-lg">
                TASK MANAGEMENT REVOLUTION
              </div>

              <h1 className="text-7xl md:text-9xl lg:text-[8rem] font-black text-slate-800 mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Master Your Workflow</span>
              </h1>

              <p className="text-xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Transform the way you work with our cutting-edge task management platform designed for ambitious professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!isPending && !session && (
                  <>
                    <Link href="/login-dashboard">
                      <Button className="px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="#features">
                      <Button variant="outline" className="px-8 py-4 text-lg rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium">
                        Explore Features
                      </Button>
                    </Link>
                  </>
                )}

                {session && (
                  <Link href="/dashboard">
                    <Button className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/60 backdrop-blur-sm">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-slate-600">Active Users</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
                <div className="text-slate-600">Uptime</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-slate-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">Powerful Features</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to stay organized and boost your productivity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                      <path d="M12 2v2"/>
                      <path d="M12 22v-2"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Smart Organization</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Intuitive categorization and tagging system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Organize your tasks with customizable categories and smart tags to find what you need instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10"/>
                      <path d="m2 12 3-3 2 3-3 3"/>
                      <path d="m22 12-3 3-2-3 3-3"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Real-time Sync</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Access your tasks anywhere, anytime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Stay in sync across all your devices with real-time updates and seamless experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Focus Mode</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Distraction-free environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Minimize distractions with our focus mode that helps you concentrate on your tasks.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Analytics</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Track your productivity with insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Get detailed analytics on your productivity patterns and optimize your workflow.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                      <line x1="6" y1="1" x2="6" y2="4"/>
                      <line x1="10" y1="1" x2="10" y2="4"/>
                      <line x1="14" y1="1" x2="14" y2="4"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Reminders</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Never miss important deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Set smart reminders and notifications to stay on top of your important tasks.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl text-slate-800 text-center">Collaboration</CardTitle>
                  <CardDescription className="text-slate-600 text-center">
                    Work together seamlessly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    Share tasks and collaborate with your team in real-time with advanced permissions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white/60 backdrop-blur-sm">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-800 mb-4">Trusted by Professionals</h2>
              <p className="text-2xl text-slate-600">Join thousands of satisfied users worldwide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-3">★★★★★</div>
                <p className="text-slate-600 mb-4">"This app transformed how I manage my daily tasks. Highly recommended!"</p>
                <div className="font-semibold text-slate-800">Sarah Johnson</div>
                <div className="text-sm text-slate-500">Product Manager</div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-3">★★★★★</div>
                <p className="text-slate-600 mb-4">"The perfect balance of functionality and design. A game-changer."</p>
                <div className="font-semibold text-slate-800">Michael Chen</div>
                <div className="text-sm text-slate-500">Software Engineer</div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-3">★★★★★</div>
                <p className="text-slate-600 mb-4">"Intuitive interface with powerful features. My productivity increased significantly."</p>
                <div className="font-semibold text-slate-800">Emily Rodriguez</div>
                <div className="text-sm text-slate-500">Marketing Director</div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isPending && !session && (
          <section className="py-20">
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-12 text-center shadow-2xl rounded-3xl border-0">
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have revolutionized their task management. Start your journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/login-dashboard">
                    <Button variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-indigo-100 text-sm">
                  No credit card required • 14-day free trial
                </p>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}