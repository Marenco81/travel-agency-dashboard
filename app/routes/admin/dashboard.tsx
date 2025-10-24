import { Header, StatsCard, TripCard } from "components"
import { getUser } from "~/appwrite/auth"
// import { start } from "repl"
import { dashboardStats, user ,allTrips } from "~/constants"
import type {Route} from './+types/dashboard';

// export async function clientLoader() {
//   const user = await getUser();

//   return user
// }

// export async function loader() {
//   throw new Error("some error thrown in a loader");
// } test error

export const clientLoader = async() => await getUser();

const dashboard = ({loaderData}: Route.ComponentProps) => {
    const user = (loaderData as unknown) as BaseUser | null;
    
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? 'Guest'} 👋`}
        description= "Track activity, trends and popular destinations in real time"
      >

      </Header>

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />

        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">
          Created Trips
        </h1>

        <div className="trip-grid">
          {allTrips.slice(0 , 4).map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ''}
              tags={trip.tags}
              price={trip.estimatedPrice}
            >

            </TripCard>
            
          ))}
        </div>
      </section>

    </main>
  )
}

export default dashboard
