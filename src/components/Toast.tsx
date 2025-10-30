type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <div
        className={`rounded-full bg-neutral-800 px-4 py-2 text-center text-sm text-neutral-100 shadow-lg transition-opacity ${
          message ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
