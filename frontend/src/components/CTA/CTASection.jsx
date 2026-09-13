import { motion } from "framer-motion";
import { FaArrowRight, FaStar } from "react-icons/fa";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="container-custom relative">

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-14 text-center shadow-2xl shadow-blue-500/20 md:px-12 md:py-20"
        >

          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

          {/* Decorative Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-3xl">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <FaStar className="text-yellow-300" />
              Your Career Journey Starts Here
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Accelerate
              <br />
              Your Career Path?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
              Discover your strengths, identify the right career path, and
              prepare for your dream opportunities with AI-powered guidance.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

              {/* Primary Button */}
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-xl transition-colors duration-300 hover:bg-slate-50"
              >
                Get Started For Free

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              {/* Secondary Button */}
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                Explore Features
              </motion.button>

            </div>

            {/* Trust Text */}
            <p className="mt-6 text-sm text-blue-200">
              Free to get started • Built for students & freshers
            </p>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default CTASection;