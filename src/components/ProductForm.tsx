// Product form for admin (placeholder)
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(1),
  imageUrl: z.string().url(),
  categoryId: z.number(),
});

export default function ProductForm() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = (data: any) => {
    // Add product logic
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#1a1a40] p-8 rounded-xl border border-gold">
      <input {...register('name')} placeholder="Product Name" className="shadcn-input" />
      <textarea {...register('description')} placeholder="Description" className="shadcn-input" />
      <input {...register('price')} type="number" placeholder="Price" className="shadcn-input" />
      <input {...register('imageUrl')} placeholder="Image URL" className="shadcn-input" />
      <input {...register('categoryId')} type="number" placeholder="Category ID" className="shadcn-input" />
      <button type="submit" className="shadcn-button bg-gold text-[#0a0a23]">Add Product</button>
    </form>
  );
}
