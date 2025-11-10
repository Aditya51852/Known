import React from "react";
import { useNavigate } from "react-router-dom";

const MentorProfile = () => {
  const navigate = useNavigate();

  const mentor = {
    pic: "https://via.placeholder.com/150",
    name: "Dr. Aditi Sharma",
    about:
      "PhD in Computer Science, 8+ years of experience in tech mentorship and career guidance.",
    plans: [
      { title: "Hourly", description: "1-hour session, live Q&A", price: 200 },
      {
        title: "Basic",
        description: "3 sessions/month + resource sharing",
        price: 680,
      },
      {
        title: "Economic",
        description: "Weekly sessions + full-time support",
        price: 2200,
      },
    ],
  };

  const handlePayment = (plan: string, price: number) => {
    console.log(`Paying ₹${price} for ${plan}`);
    setTimeout(() => {
      alert(`Subscribed to ${plan} Plan`);
      navigate("/profile");
    }, 1000);
  };

  return (
    <div className="min-h-screen p-8 pt-24 bg-gray-50 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/3 flex justify-center items-start">
        <img
          src={mentor.pic}
          alt="Mentor Pic"
          className="rounded-full h-48 w-48 object-cover shadow-lg"
        />
      </div>

      <div className="w-full md:w-2/3 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">{mentor.name}</h2>
        <p className="text-gray-600 leading-relaxed">{mentor.about}</p>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Plans</h3>

          <div className="space-y-4">
            {mentor.plans.map((plan) => (
              <div
                key={plan.title}
                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-medium">{plan.title}</h4>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{plan.price}</p>
                  <button
                    onClick={() => handlePayment(plan.title, plan.price)}
                    className="mt-1 px-4 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
