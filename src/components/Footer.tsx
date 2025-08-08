import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 rounded-t-3xl bg-gray-200 p-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Scordo. All rights reserved.</p>
        <p className="mt-2">
          <a href="#" className="mx-2 hover:underline">
            Privacy Policy
          </a>{" "}
          <a href="#" className="mx-2 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
