export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="min-h-screen bg-[#0B1C3F] text-white p-8">Category: {slug}</div>;
}
