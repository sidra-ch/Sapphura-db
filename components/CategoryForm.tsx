// Category form for admin (placeholder)
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
});

export default function CategoryForm() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = (data: any) => {
    // Add category logic
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#1a1a40] p-8 rounded-xl border border-gold">
      <input {...register('name')} placeholder="Category Name" className="shadcn-input" />
      <button type="submit" className="shadcn-button bg-gold text-[#0a0a23]">Add Category</button>
    </form>
  );
}
