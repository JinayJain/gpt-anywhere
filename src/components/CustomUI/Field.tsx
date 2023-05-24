import Icon from "./Icon";

type FieldProps = {
  name?: string;
  className?: string;
  classInput?: string;
  label?: string;
  textarea?: boolean;
  note?: string;
  error?: string | boolean;
  type?: string;
  value?: string;
  onChange?: any;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: string;
};

const Field = ({
  name,
  className,
  classInput,
  label,
  textarea,
  note,
  error,
  type,
  value,
  onChange,
  onKeyDown,
  placeholder,
  required,
  icon,
}: FieldProps) => {
  const handleKeyDown = (event: any) => {
    const remainingChars = value ? 880 - value.length : 0;
    if (remainingChars <= 0 && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  const remainingChars = value ? 880 - value.length : 0;

  return (
    <div className={`${className}`}>
      <div className=''>
        {label && (
          <div className='flex mb-2 base2 font-semibold'>
            {label}
            {textarea && (
              <span className='ml-auto pl-4 text-n-4/50'>{remainingChars}</span>
            )}
          </div>
        )}
        <div style={{ position: "relative" }}>
          {textarea ? (
            <textarea
              className={`w-full h-24 px-3 py-3 bg-n-2 border-2 border-n-2 rounded-xl base2  text-n-7 outline-none transition-colors  resize-none  ${
                icon && "pl-14"
              } ${value !== "" && "bg-transparent b-n-3"}`}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              required={required}
            ></textarea>
          ) : (
            <input
              name={name}
              className={`w-full h-13 px-3 bg-n-2 border-2 b-n-2 rounded-xl base2  text-n-7 outline-none transition-colors  ${
                icon && "pl-14"
              } ${value !== "" && "bg-transparent b-n-3"} ${classInput}`}
              type={type || "text"}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              required={required}
            />
          )}
          <Icon
            style={{
              position: "absolute",
              top: "0.875rem",
              left: "1rem",
              pointerEvents: "none",
            }}
            className={`transition-colors`}
            fill={"fill-n-4"}
            name={icon}
          />
        </div>
        {note && (
          <div
            className='mt-2 base2 text-n-4/50'
            style={{ pointerEvents: "none" }}
          >
            {note}
          </div>
        )}
        {error && <div className='mt-2 base2 text-accent-1'>{error}</div>}
      </div>
    </div>
  );
};

export default Field;
