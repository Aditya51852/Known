interface ProfileProps {
  name: string;
  phone: string;
  email: string;
  location: string;
  imageUrl: string;
}

export function ProfileCard({ name, phone, email, location, imageUrl }: ProfileProps) {
  return (
    <div className="bg-white rounded shadow p-4">
      <img src={imageUrl} alt="Profile" className="w-20 h-20 rounded-full mb-4" />
      <p><strong>Name:</strong> {"Aditya Raj"}</p>
      <p><strong>Phone:</strong> {7488851195}</p>
      <p><strong>Email:</strong> {"aditya51852@gmail.com"}</p>
      <p><strong>Location:</strong> {"Noida"}</p>
    </div>
  );
}
