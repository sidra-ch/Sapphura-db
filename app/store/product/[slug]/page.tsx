export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="min-h-screen bg-[#0B1C3F] text-white p-8">Product: {slug}</div>;
}
