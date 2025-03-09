// app/page.tsx

// components/Home.js

import React from 'react';

const Home = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-semibold">Welcome to English with John</h1>
          <p className="mt-2 text-xl">Enhance your English skills with personalized lessons and fun activities.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 bg-secondary">
        <div className="container mx-auto px-6">
          <section>
            <h2 className="text-3xl font-bold text-center">About Me</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center">
              I'm John, an experienced online English tutor, and I'm here to help you improve your English.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-3xl font-bold text-center">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-center">1-on-1 Classes</h3>
                <p className="mt-2 text-muted-foreground text-center">Personalized lessons tailored to your needs.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-center">Group Sessions</h3>
                <p className="mt-2 text-muted-foreground text-center">Join small groups for interactive lessons.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-center">Conversation Practice</h3>
                <p className="mt-2 text-muted-foreground text-center">Improve your speaking skills with real-life topics.</p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-center">Contact</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center">
              Ready to get started? Feel free to reach out to me and schedule your first lesson.
            </p>
            <div className="text-center mt-6">
              <a href="mailto:contact@englishwithjohn.com" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg hover:bg-primary">
                Contact Me
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 English with John. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
