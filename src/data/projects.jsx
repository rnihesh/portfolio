import React from "react";

export const projects = [
  {
    description: "A Blog App",
    title: "Logly",
    src: "/projects/logly.jpeg",
    ctaText: "Visit",
    ctaLink: "https://logly.vercel.app/",
    github: "https://github.com/rnihesh/logly/",
    logo: "/projects/logos/logly.svg",
    content: () => {
      return (
        <>
          <p>
            Logly is a MERN-stack powered blogging platform with clerk,
            role-based access, and responsive design — built for seamless
            writing, sharing, and content management.
          </p>
          <div className="flex g-2 flex-wrap overflow-ellipsis">
            {[
              "ReactJS",
              "NodeJs",
              "Bootstrap",
              "Express",
              "MongoDB",
              "Auth",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      );
    },
  },
  {
    description: "A Vehicle Pooling App",
    title: "RideShare",
    src: "/projects/rideshare.jpeg",
    ctaText: "Visit",
    ctaLink: "https://nihesh-ride-share.vercel.app/",
    github: "https://github.com/rnihesh/car_pooling/",
    logo: "/projects/logos/rideshare.png",
    content: () => {
      return (
        <>
          <p>
            A MERN-based vehicle pooling app using MongoDB aggregation pipelines
            and geo-coordinates for efficient driver-passenger matching,
            location-based queries, with secure authentication with clerk.
          </p>
          <div className="flex g-2 flex-wrap overflow-ellipsis">
            {[
              "ReactJS",
              "NodeJs",
              "MongoDB",
              "Aggregation Pipelines",
              "Leaflet",
              "Bootstrap",
              "Express",
              "Auth",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      );
    },
  },
  {
    description: "A Gamified Habit Tracker",
    title: "Habify",
    src: "/projects/habify.jpeg",
    ctaText: "Visit",
    ctaLink: "https://habify-red.vercel.app/",
    github: "https://github.com/rnihesh/gamified_habit_tracker/",
    logo: "/projects/logos/habify.webp",
    content: () => {
      return (
        <>
          <p>
            HabiFy is a gamified habit tracker built with MERN stack, using
            MongoDB for progress tracking, dynamic scoring, level systems, and
            responsive dashboards & leaderboards with secure user auth and role
            control.
          </p>
          <div className="flex g-2 flex-wrap overflow-ellipsis">
            {[
              "ReactJS",
              "NodeJs",
              "Cron",
              "MongoDB",
              "Bootstrap",
              "Express",
              "Auth",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      );
    },
  },
  {
    description: "A Modern Seller Portal",
    title: "Nihesh's Seller Portal",
    src: "/projects/nihesh_s_seller_portal.jpeg",
    ctaText: "Visit",
    ctaLink: "https://nihesh-seller-portal.vercel.app/",
    github: "https://github.com/rnihesh/nihesh-s-seller-portal/",
    logo: "/projects/logos/nihesh_s_seller_portal.png",
    content: () => {
      return (
        <>
          <p>
            A MERN stack app, integrated with Cloudinary for media management
            and Gemini AI for smart content generation, enabling seamless
            product uploads, edits, and seller analytics.
          </p>
          <div className="flex g-2 flex-wrap overflow-ellipsis">
            {[
              "ReactJS",
              "NodeJs",
              "MongoDB",
              "Bootstrap",
              "Gemini AI",
              "Cloudinary",
              "Express",
              "Auth",
            ].map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      );
    },
  },
  {
    description: "A WebSocket Example",
    title: "Live Cursors",
    src: "/projects/live_cursors.jpeg",
    ctaText: "Visit",
    ctaLink: "https://nihesh-cursors.vercel.app/",
    github: "https://github.com/rnihesh/live-cursors-app/",
    logo: "/projects/logos/cursor.png",
    logoClassName: "dark:invert",
    content: () => {
      return (
        <>
          <p>
            A real-time collaborative web app using WebSockets where users join
            with a name and see each other's cursor movements live, enabling
            shared interaction through minimal input and seamless syncing.
          </p>
          <div className="flex g-2 flex-wrap overflow-ellipsis">
            {["ReactJS", "NodeJs", "WebSockets", "Express", "ws"].map(
              (skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </>
      );
    },
  },
];
