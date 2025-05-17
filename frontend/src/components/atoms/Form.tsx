export default function Form({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      className="w-full max-w-md mx-auto flex flex-col items-center gap-4"
    >
      {children}
    </form>
  );
}
