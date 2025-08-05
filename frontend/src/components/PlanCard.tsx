interface PlanProps {
  title: string;
  description: string;
  price: number;
}

export function PlanCard({ title, description, price }: PlanProps) {
  return (
    <div className="border p-4 rounded bg-white shadow-md">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-700 text-sm mb-2">{description}</p>
      <button className="bg-green-500 text-white px-4 py-2 rounded">Pay ₹{price}</button>
    </div>
  );
}