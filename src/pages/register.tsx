// Register page (placeholder)
import { register } from '../lib/auth';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { register: reg, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // Add register logic
    const user = await register(data.email, data.password, data.name);
    if (user) {
      alert('Registration successful!');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1a1a40] p-8 rounded-xl border border-gold space-y-6">
        <input {...reg('name')} placeholder="Name" className="shadcn-input" />
        <input {...reg('email')} placeholder="Email" className="shadcn-input" />
        <input {...reg('password')} type="password" placeholder="Password" className="shadcn-input" />
        <button type="submit" className="shadcn-button bg-gold text-[#0a0a23]">Register</button>
      </form>
    </div>
  );
}
