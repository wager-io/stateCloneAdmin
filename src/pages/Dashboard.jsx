import React, { useEffect } from 'react';
import {
  People as Users,
  TrendingUp,
  TrendingDown,
  MonetizationOn,
  AccountBalance,
} from '@mui/icons-material';
import { lazy } from 'react';
import api from '../api/axios';

const AdditionalMetrics = lazy(() => import('../components/dashboard/AdditionalMetrics'));
const TopGameWinners = lazy(() => import('../components/dashboard/TopGameWinners'));
const TransactionNotifications = lazy(() => import('../components/dashboard/TransactionNotifications'));
const TopUsersTable = lazy(() => import('../components/dashboard/TopUsersTable'));
const MonthlyTargetChart = lazy(() => import('../components/dashboard/MonthlyTargetChart'));
// const DepositWithdrawChart = lazy(() => import('../components/dashboard/DepositWithdrawChart'));
// const UserGrowthChart = lazy(() => import('../components/dashboard/UserGrowthChart'));
// const ChartContainer = lazy(() => import('../components/dashboard/ChartContainer'));
const MetricCard = lazy(() => import('../components/dashboard/MetricCard'));

export default function Dashboard() {
  const [statsDataLoading, setStatsDataLoading] = React?.useState(true)
  const [statsData, setStatsData] = React.useState([])
  const [topUsersLoading, setTopUsersLoading] = React.useState(false)
  const [topUsers, setTopUsers] = React.useState([])
  const [recentTransactionsLoading, setRecentTransactionsLoading] = React.useState(false)
  const [recentTransactions, setRecentTransactions] = React.useState([])
  const [topGameWinnersLoading, setTopGameWinnersLoading] = React.useState(false)
  const [topGameWinners, setTopGameWinners] = React.useState([])

    useEffect(()=>{
      async function getStatsData(){
        setStatsDataLoading(true)
        const response = await api.get("/admin/dashboard")
        if(response?.success){
          setStatsData(response?.data)
        }
        setStatsDataLoading(false)
      }

      async function getTopUsers(){
        setTopUsersLoading(true)
        try {
          const response = await api.get("/admin/top-users-with-highest-balance")
          if(response?.success){
            setTopUsers(response?.data)
          }
        } catch (error) {
          console.error('Error fetching top users:', error)
        }
        setTopUsersLoading(false)
      }

      async function getRecentTransactions(){
        setRecentTransactionsLoading(true)
        try {
          const response = await api.get("/admin/recent-transactions")
          if(response?.success){
            setRecentTransactions(response?.data)
          }
        } catch (error) {
          console.error('Error fetching recent transactions:', error)
        }
        setRecentTransactionsLoading(false)
      }

      async function getTopGameWinners(){
        setTopGameWinnersLoading(true)
        try {
          const response = await api.get("/admin/top-game-winners")
          if(response?.success){
            setTopGameWinners(response?.data)
          }
        } catch (error) {
          console.error('Error fetching top game winners:', error)
        }
        setTopGameWinnersLoading(false)
      }

      getStatsData()
      getTopUsers()
      getRecentTransactions()
      getTopGameWinners()
    },[])

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ 
            color: 'var(--text-light)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* 3D Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statsData?.map((metric, index) => {
          const getIcon = (title) => {
            switch (title) {
              case "Total Users":
                return <Users />;
              case "Monthly Deposit":
                return <TrendingUp />;
              case "Monthly Withdraw":
                return <TrendingDown />;
              case "Total GGR":
                return <MonetizationOn />;
              case "Total Loss":
                return <AccountBalance />;
              default:
                return <Users />;
            }
          };
          return (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={getIcon(metric.title)}
              trend={metric.trend}
              trendUp={metric.trendUp}
              description={metric.description}
              isloading={statsDataLoading}
            />
          );
        })}

        {statsData.length === 0 && [1,2,3,4,5].map((e)=>(
          <MetricCard key={e} value={null} />
        ))  }

      </div>

      <div className="space-y-6 mb-8">
        {/* <ChartContainer title="User Growth Trend">
          <UserGrowthChart />
        </ChartContainer> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* <ChartContainer title="Deposits vs Withdrawals">
              <DepositWithdrawChart />
            </ChartContainer> */}
          </div>
          <div className="lg:col-span-1">
            {/* <ChartContainer title="Monthly Target Progress">
              <MonthlyTargetChart />
            </ChartContainer> */}
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <TopUsersTable users={topUsers} loading={topUsersLoading} />
        <TransactionNotifications transactions={recentTransactions} loading={recentTransactionsLoading} />
      </div>

      <TopGameWinners winners={topGameWinners} loading={topGameWinnersLoading} />

      <AdditionalMetrics />
    </div>
  );
}
