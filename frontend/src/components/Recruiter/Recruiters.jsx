import { motion } from "framer-motion";

import google from "../../assets/logos/google.svg";
import microsoft from "../../assets/logos/microsoft.svg";
import amazon from "../../assets/logos/amazon.svg";
import ibm from "../../assets/logos/ibm.svg";
import accenture from "../../assets/logos/accenture.svg";
import infosys from "../../assets/logos/infosys.svg";
import capgemini from "../../assets/logos/capgemini.svg";
import deloitte from "../../assets/logos/deloitte.svg";

const companies = [
  {
    name: "Google",
    logo: google,
  },
  {
    name: "Microsoft",
    logo: microsoft,
  },
  {
    name: "Amazon",
    logo: amazon,
  },
  {
    name: "IBM",
    logo: ibm,
  },
  {
    name: "Accenture",
    logo: accenture,
  },
  {
    name: "Infosys",
    logo: infosys,
  },
  {
    name: "Capgemini",
    logo: capgemini,
  },
  {
    name: "Deloitte",
    logo: deloitte,
  },
];

function Recruiters() {
  return (
    <section className="relative overflow-hidden bg-white py-20">

      {/* Section Heading */}
      <div className="container-custom px-6 text-center">

        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Trusted By
        </span>

        <h2 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">
          Companies Hiring Our Talent
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
          Students can explore opportunities from leading companies.
        </p>

      </div>


      {/* Marquee */}
      <div className="relative mt-14 overflow-hidden">

       {/* Left Fade */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-white via-white/90 to-transparent" />

{/* Right Fade */}
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-white via-white/90 to-transparent" />

        {/* Moving Track */}
        <div className="recruiter-marquee">

          {/* First Set */}
          <div className="flex shrink-0 gap-6">

            {companies.map((company) => (
              <LogoCard
                key={`first-${company.name}`}
                company={company}
              />
            ))}

          </div>


          {/* Duplicate Set */}
          <div className="flex shrink-0 gap-6">

            {companies.map((company) => (
              <LogoCard
                key={`second-${company.name}`}
                company={company}
              />
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}


function LogoCard({ company }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group flexh-[104px] w-[220px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-8 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-xl"
    >

      <img
        src={company.logo}
        alt={`${company.name} logo`}
className="max-h-12 max-w-[150px] object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"      />

    </motion.div>
  );
}

export default Recruiters;