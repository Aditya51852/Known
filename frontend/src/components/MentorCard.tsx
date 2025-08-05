interface MentorProps {
  name: string;
  about: string;
  imageUrl: string;
  onClick: () => void;
}

export function MentorCard({ name, about, imageUrl, onClick }: MentorProps) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 cursor-pointer" onClick={onClick}>
      <img src={imageUrl} className="w-16 h-16 rounded-full" alt={name} />
      <h2 className="font-semibold mt-2">{name}</h2>
      <p className="text-sm text-gray-600">{about}</p>
    </div>
  );
}