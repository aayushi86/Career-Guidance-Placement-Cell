import accentureLogo from "../../assets/logos/accenture.svg";
import amazonLogo from "../../assets/logos/amazon.svg";
import capgeminiLogo from "../../assets/logos/Capgemini.svg";
import deloitteLogo from "../../assets/logos/deloitte.svg";
import googleLogo from "../../assets/logos/google.svg";
import ibmLogo from "../../assets/logos/ibm.svg";
import infosysLogo from "../../assets/logos/Infosys.svg";
import microsoftLogo from "../../assets/logos/microsoft.svg";

function TrustedBy() {
  const companies = [
    {
      name: "Google",
      logo: googleLogo,
    },
    {
      name: "Microsoft",
      logo: microsoftLogo,
    },
    {
      name: "Amazon",
      logo: amazonLogo,
    },
    {
      name: "IBM",
      logo: ibmLogo,
    },
    {
      name: "Accenture",
      logo: accentureLogo,
    },
    {
      name: "Infosys",
      logo: infosysLogo,
    },
    {
      name: "Capgemini",
      logo: capgeminiLogo,
    },
    {
      name: "Deloitte",
      logo: deloitteLogo,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Trusted By
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Companies Hiring Our Talent
          </h2>

          <p className="mt-3 text-slate-500">
            Students can explore opportunities from leading companies.
          </p>
        </div>

        {/* Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

          {companies.map((company) => (
            <div
              key={company.name}
              className="h-24 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition duration-300"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="max-h-10 max-w-[130px] object-contain"
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default TrustedBy;