import React from 'react';

import Help from './Help';
import Cancel from './Cancel';

function Home() {
  return (
    <>
      {/* Main Content: Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen p-6 gap-4 text-gray-200">
        {/* Left Section: Detailed Project Description */}
        <div className="overflow-y-auto p-8 rounded-xl shadow-lg bg-gray-800">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-blue-400">AidTech Alliance</h1>
            <p className="mt-2 text-xl text-gray-300">
              Building a self-sustaining ecosystem of support and goodwill.
            </p>
          </header>

          {/* Idea Approach Details */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">Idea Approach Details</h2>
            <p className="leading-relaxed text-gray-300">
              We are developing a help-exchange platform where users can request assistance anytime,
              categorized into ten levels based on urgency. Each help request deducts a specific amount of coins from
              the requester’s account and credits them to the helper. Coins act as a trust-based currency,
              encouraging community-driven support. Users can earn coins by offering assistance and use them when they need help.
              The system ensures fairness, reliability, and accountability in transactions. Our goal is to create a seamless,
              secure, and rewarding support network. The platform will feature real-time matching, ensuring timely aid distribution.
              Together, we build a self-sustaining ecosystem of support and goodwill.
            </p>
          </section>

          {/* Idea / Solution / Prototype Description */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">Idea / Solution / Prototype Description</h2>
            <p className="leading-relaxed text-gray-300">
              Our platform is an assistance-sharing solution that links individuals in need with those willing to help.
              Requests are organized into ten tiers of urgency so that higher-priority needs are addressed first.
              A coin-based system governs the transactions—users accumulate coins by offering help and spend them when requesting support.
              To ensure fairness and dependability, the platform includes real-time matching, secure transactions, and transparent tracking.
              The intuitive interface enables easy navigation, while instant alerts keep users promptly connected.
              Location-based features, user authentication, and a review system further enhance trust and accountability.
              By cultivating a self-sustaining community, our solution encourages responsible involvement and collaborative assistance,
              building a scalable and reliable support network.
            </p>
          </section>

          {/* Help Tiers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Help Tiers</h2>
            <ul className="list-decimal list-inside space-y-3 text-gray-300">
              <li>
                <span className="font-semibold">Tier 10: Critical Emergency</span> – A person in a life-threatening accident needing immediate medical attention. <em>Action:</em> Immediate response required; contact emergency services.
              </li>
              <li>
                <span className="font-semibold">Tier 9: Severe Emergency</span> – Someone unconscious or in severe pain due to an accident or medical condition. <em>Action:</em> Urgent care required.
              </li>
              <li>
                <span className="font-semibold">Tier 8: High Urgency</span> – Severe allergic reaction or a child lost in a crowd. <em>Action:</em> Immediate, non-life-threatening assistance.
              </li>
              <li>
                <span className="font-semibold">Tier 7: Emergency Assistance</span> – Severe burn or inability to walk after an accident. <em>Action:</em> Prompt medical care needed.
              </li>
              <li>
                <span className="font-semibold">Tier 6: Serious Medical Issue</span> – Chronic pain or severe headache affecting daily life. <em>Action:</em> Assistance needed, but not an immediate emergency.
              </li>
              <li>
                <span className="font-semibold">Tier 5: Moderate Medical Issue</span> – Help with prescription refills or a mild injury. <em>Action:</em> Moderate attention required.
              </li>
              <li>
                <span className="font-semibold">Tier 4: Routine Help Request</span> – Transportation to a medical appointment or help with household chores. <em>Action:</em> Assistance for non-emergency tasks.
              </li>
              <li>
                <span className="font-semibold">Tier 3: Non-urgent Help</span> – Carrying groceries or minor home repair. <em>Action:</em> General day-to-day help.
              </li>
              <li>
                <span className="font-semibold">Tier 2: Minor Help</span> – Setting up a virtual meeting or finding local resources. <em>Action:</em> Minimal effort required.
              </li>
              <li>
                <span className="font-semibold">Tier 1: Convenience Request</span> – Recommendations for local food delivery or a quick reminder. <em>Action:</em> Non-urgent, provided when convenient.
              </li>
            </ul>
          </section>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-8  p-8 rounded-xl shadow-lg">
          <Help />
          <Cancel />
        </div>
      </div>

      
    </>
  );
}

export default Home;
