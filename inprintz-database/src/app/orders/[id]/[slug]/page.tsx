import prisma from "../../../../lib/db";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const orders = await prisma.order.findUnique({
        where: {
            id: id,  
        },
    }
  );
    return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
        <h1 className="text-3xl font-semibold">{orders?.job_name}</h1>
        <p>{orders?.id}</p>
    </main>
  );
}
