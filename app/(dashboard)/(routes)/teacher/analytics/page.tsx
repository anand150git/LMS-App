import { getAnalytics } from '@/actions/GetAnalytics';
import { auth } from '@clerk/nextjs/server';
import DataCard from './_components/DataCard';
import Chart from './_components/Chart';

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  };

  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(userId);

  return (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <DataCard
          label='Total Revenue'
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label='Total Sales'
          value={totalSales}
        />
      </div>
      <div>
        <Chart
          data={data}
        />
      </div>
    </div>
  )
}

export default page