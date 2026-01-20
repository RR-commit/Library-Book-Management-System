type Props = { message: string; onClose: () => void };
export default function Notice({ message, onClose }: Props) {
  if (!message) return null;
  return (
    <div className="notice" onClick={onClose}>
      {message}
    </div>
  );
}
