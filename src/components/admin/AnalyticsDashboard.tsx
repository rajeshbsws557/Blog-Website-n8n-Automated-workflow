"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { DashboardData } from "@/lib/types";

interface Props {
  data: DashboardData;
}

// ──── Custom Tooltip ────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#12121a]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">
        {payload[0].value.toLocaleString()}{" "}
        <span className="text-xs font-normal text-zinc-500">views</span>
      </p>
    </div>
  );
}

// ──── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  gradient,
  delay,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
    >
      {/* Glass glow effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
      />
      <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl p-6 h-full border border-white/[0.04]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold text-white tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ──── Main Component ────────────────────────────────────────────
export function AnalyticsDashboardClient({ data }: Props) {
  const {
    subscriberCount,
    totalViews,
    articlesPublished,
    trafficData,
    recentSubscribers,
    topPosts,
  } = data;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Analytics
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Overview of your site performance over the last 30 days
        </p>
      </motion.div>

      {/* ── Top Summary Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Total Subscribers"
          value={subscriberCount}
          gradient="from-cyan-500/20 to-blue-500/20"
          delay={0}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Views (All Time)"
          value={totalViews}
          gradient="from-violet-500/20 to-fuchsia-500/20"
          delay={0.1}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Articles Published"
          value={articlesPublished}
          gradient="from-emerald-500/20 to-teal-500/20"
          delay={0.2}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
      </div>

      {/* ── Traffic Chart ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 blur-xl" />
        <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Traffic — Last 30 Days
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Page views aggregated by date
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-3 h-0.5 rounded-full bg-cyan-400" />
              Page Views
            </div>
          </div>

          <div className="h-[320px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickFormatter={(value: string) => {
                    const d = new Date(value);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#06b6d4",
                    stroke: "#0c0c14",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Section: Recent Subscribers + Top Content ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscribers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 blur-xl" />
          <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">
                Recent Subscribers
              </h2>
              <a
                href="/admin/subscribers"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View all →
              </a>
            </div>

            {recentSubscribers.length === 0 ? (
              <p className="text-sm text-zinc-500 py-8 text-center">
                No subscribers yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentSubscribers.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-cyan-400 uppercase">
                          {sub.email[0]}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-300 truncate">
                        {sub.email}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-600 flex-shrink-0 ml-3">
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 blur-xl" />
          <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.04]">
            <h2 className="text-lg font-semibold text-white mb-5">
              Top Content
            </h2>

            {topPosts.length === 0 ? (
              <p className="text-sm text-zinc-500 py-8 text-center">
                No published posts yet
              </p>
            ) : (
              <div className="space-y-3">
                {topPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-zinc-600 w-5 text-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                      <svg
                        className="w-3.5 h-3.5 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-zinc-500">
                        {(post.view_count || 0).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
