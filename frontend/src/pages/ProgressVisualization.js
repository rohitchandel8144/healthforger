import React from "react";
import OverviewSection from "../components/ProgressBarComponents.js/Overview";
import ProgressGraphs from "../components/ProgressBarComponents.js/ProgressGraphs";
import SummaryStatistics from "../components/ProgressBarComponents.js/SummaryStatistics";
import ComparisonInsights from "../components/ProgressBarComponents.js/ComparisonInsights";
import NotificationsAlerts from "../components/ProgressBarComponents.js/NotificationAlert";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProgressVisualization = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.premiumSubscription == false) {
      navigate('/paymentform');
    }
  }, [navigate]);


  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 mb-8">
          <OverviewSection />
        </div>
        <div className="lg:col-span-1 mb-8">
          <div className="border border-transparent shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
            <ProgressGraphs />
          </div>
        </div>
        <div className="lg:col-span-1 mb-8">
          <div className="border border-transparent shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
            <ComparisonInsights />
          </div>
        </div>
        <div className="lg:col-span-1 mb-8">
          <div className="border border-transparent shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
            <SummaryStatistics />
          </div>
        </div>
        <div className="lg:col-span-1 mb-8">
          <div className="border border-transparent shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
            <NotificationsAlerts />
          </div>
        </div>
      </div>
      <Footer className="mt-10" />
    </div>
  );
};

export default ProgressVisualization;
