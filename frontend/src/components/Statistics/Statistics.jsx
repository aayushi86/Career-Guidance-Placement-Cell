import {
  FaUserGraduate,
  FaBuilding,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";

const stats = [
  {
    number: "95",
    suffix: "%",
    title: "Placement Rate",
    description: "Students successfully placed",
    icon: FaChartLine,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "5,000",
    suffix: "+",
    title: "Students Guided",
    description: "Career journeys supported",
    icon: FaUserGraduate,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "300",
    suffix: "+",
    title: "Recruiters",
    description: "Companies connected",
    icon: FaBuilding,
    color: "from-emerald-500 to-teal-500",
  },
  {
    number: "10,000",
    suffix: "+",
    title: "Job Opportunities",
    description: "Opportunities available",
    icon: FaBriefcase,
    color: "from-orange-500 to-amber-500",
  },
];

function Statistics() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-purple-400/10 blur-[120px]" />

      <div className="container-custom relative">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-4xl text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Our Impact
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Empowering Careers With AI
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            Helping students discover opportunities, build skills, and move
            confidently toward their career goals.
          </p>

        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group"
              >

                <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl">

                  {/* Hover Glow */}
                  <div
                    className={`
                      pointer-events-none absolute
                      -right-10 -top-10
                      h-32 w-32
                      rounded-full
                      bg-gradient-to-br ${stat.color}
                      opacity-0 blur-3xl
                      transition-opacity duration-500
                      group-hover:opacity-20
                    `}
                  />

                  {/* Icon */}
                  <div
                    className={`
                      relative flex h-14 w-14
                      items-center justify-center
                      rounded-2xl
                      bg-gradient-to-br ${stat.color}
                      text-xl text-white
                      shadow-lg
                      transition-transform duration-500
                      group-hover:scale-110
                      group-hover:rotate-3
                    `}
                  >
                    <Icon />
                  </div>

                  {/* Number */}
                  <div className="relative mt-8 flex items-baseline">

                    <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                      {stat.number}
                    </h3>

                    <span className="ml-1 text-3xl font-bold text-blue-600">
                      {stat.suffix}
                    </span>

                  </div>

                  {/* Title */}
                  <h4 className="relative mt-4 text-lg font-bold text-slate-900">
                    {stat.title}
                  </h4>

                  {/* Description */}
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-500">
                    {stat.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default Statistics;